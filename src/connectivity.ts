import {
  DEFAULT_PROBE_TIMEOUT_MS,
  DEFAULT_PROBE_URLS,
  DEFAULT_REQUIRED_SUCCESSES,
} from "./constants";
import { getConnectionType, getNetworkQuality } from "./connection-type";
import type { ConnectivityOptions, ConnectivityResult } from "./types";

function probeUrl(url: string, timeoutMs: number): Promise<{ ok: boolean; latencyMs?: number }> {
  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const cacheBust = url.includes("?") ? `&_=${Date.now()}` : `?_=${Date.now()}`;

  return fetch(`${url}${cacheBust}`, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
    signal: controller.signal,
  })
    .then((res) => {
      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - start);
      return { ok: res.ok, latencyMs };
    })
    .catch(() => {
      clearTimeout(timeoutId);
      return { ok: false };
    });
}

/**
 * Checks if the device has reachable internet by probing one or more URLs.
 * Does not rely on navigator.onLine alone (which is unreliable for "real" internet).
 * Works across WiFi and mobile data by validating with actual requests.
 */
export async function checkConnectivity(
  options: ConnectivityOptions = {}
): Promise<ConnectivityResult> {
  const timeout = options.timeout ?? DEFAULT_PROBE_TIMEOUT_MS;
  const requiredSuccesses = options.requiredSuccesses ?? DEFAULT_REQUIRED_SUCCESSES;
  const urls = options.probeUrls?.length
    ? options.probeUrls
    : [...DEFAULT_PROBE_URLS];

  const connectionType = getConnectionType();
  const networkQuality = getNetworkQuality();
  const results = await Promise.all(urls.map((url) => probeUrl(url, timeout)));

  const succeeded = results.filter((r) => r.ok);
  const online = succeeded.length >= requiredSuccesses;
  const latencyMs = succeeded[0]?.latencyMs;

  return {
    online,
    connectionType,
    networkQuality,
    ...(latencyMs !== undefined && { latencyMs }),
  };
}
