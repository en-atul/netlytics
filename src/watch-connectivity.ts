import {
  DEFAULT_DEBOUNCE_MS,
  DEFAULT_OFFLINE_PROBE_TIMEOUT_MS,
} from "./constants";
import { checkConnectivity } from "./connectivity";
import type { ConnectivityResult, WatchConnectivityOptions } from "./types";

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
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const offlineProbeTimeoutMs =
    options.offlineProbeTimeoutMs ?? DEFAULT_OFFLINE_PROBE_TIMEOUT_MS;

  const win = typeof window !== "undefined" ? window : null;
  if (!observe || !win) {
    return () => {};
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function validateWithProbe(probeOptions: {
    timeout: number;
  }): Promise<ConnectivityResult> {
    options.onChecking?.();
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

  win.addEventListener("online", handleOnline);
  win.addEventListener("offline", handleOffline);

  return function unsubscribe() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = null;
    win.removeEventListener("online", handleOnline);
    win.removeEventListener("offline", handleOffline);
  };
}
