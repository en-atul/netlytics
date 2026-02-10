import {
  DEFAULT_DEBOUNCE_MS,
  DEFAULT_OFFLINE_PROBE_TIMEOUT_MS,
  DEFAULT_POLL_INTERVAL_MS,
} from "./constants";
import { checkConnectivity } from "./connectivity";
import type { ConnectivityResult, WatchConnectivityOptions } from "./types";
import { isMobileOS } from "./utils";

/**
 * Subscribes to online/offline events and validates each with a network probe.
 * We never rely only on navigator.onLine — both events are confirmed by a real request.
 * Returns an unsubscribe function.
 */
export function watchConnectivity(
  callback: (result: ConnectivityResult) => void,
  options: WatchConnectivityOptions = {}
): () => void {
  const observe = options.observe !== false;
  const visibilityChange = options.visibilityChange !== false;
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const offlineProbeTimeoutMs =
    options.offlineProbeTimeoutMs ?? DEFAULT_OFFLINE_PROBE_TIMEOUT_MS;
  const pollingEnabled = options.pollingEnabled !== false;
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

  const win = typeof window !== "undefined" ? window : null;
  const doc = typeof document !== "undefined" ? document : null;

  if (!observe || !win) {
    return () => { };
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  async function validateWithProbe(probeOptions: {
    timeout: number;
    skipOnChecking?: boolean; // Skip onChecking for polling to avoid UI flashing
  }): Promise<ConnectivityResult> {
    if (!probeOptions.skipOnChecking) {
      options.onChecking?.();
    }
    return checkConnectivity({
      ...options,
      timeout: probeOptions.timeout,
    });
  }

  function handleOnline() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      debounceTimer = null;
      const result = await validateWithProbe({
        timeout: options.timeout ?? 5000,
      });
      callback(result);
    }, debounceMs);
  }

  function handleOffline() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    validateWithProbe({ timeout: offlineProbeTimeoutMs }).then(callback);
  }

  function handleVisibilityChange() {
    // stop polling if it's running on page visibility change to hidden
    if (doc?.hidden && pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }

    if (!doc?.hidden) {
      // on page visibility change to visible, validate connectivity
      handleOnline()

      if (!pollTimer) {
        // start polling if it's not running on page visibility change to visible
        startPolling();
      }
    }
  }

  function startPolling() {
    if (pollIntervalMs > 0 && !pollTimer) {
      pollTimer = setInterval(async () => {
        const result = await validateWithProbe({
          timeout: options.timeout ?? 5000,
          skipOnChecking: true, // Skip onChecking for polling to avoid "Checking..." flashing every 10 seconds
        });
        callback(result);
      }, pollIntervalMs);
    }
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  /**
   * Handles network events for mobile devices.
   * Starts polling as a fallback for mobile devices where events don't fire reliably.
   */
  function enableMobileNetworkHandling() {
    if (pollingEnabled) {
      startPolling();
    }
  }

  if (isMobileOS()) {
    enableMobileNetworkHandling();
  }

  // on Mobile/Tablet/iPad devices "online" and "offline" events don't
  // fire reliably, so we use polling as a fallback.👆🏻
  win.addEventListener("online", handleOnline);
  win.addEventListener("offline", handleOffline);
  if (visibilityChange) {
    doc?.addEventListener("visibilitychange", handleVisibilityChange);
  }

  return function unsubscribe() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = null;
    stopPolling();
    win.removeEventListener("online", handleOnline);
    win.removeEventListener("offline", handleOffline);
    doc?.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
