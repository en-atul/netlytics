/**
 * Default probe URLs. Use small, CORS-friendly, highly available resources.
 * Do not rely on navigator.onLine alone — these validate actual internet reachability.
 */
export const DEFAULT_PROBE_URLS = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://unpkg.com/react@18/umd/react.production.min.js",
] as const;

export const DEFAULT_PROBE_TIMEOUT_MS = 5000;
export const DEFAULT_REQUIRED_SUCCESSES = 1;
export const DEFAULT_LATENCY_TIMEOUT_MS = 5000;
export const DEFAULT_LATENCY_SAMPLE_SIZE = 3;
/** Timeout when validating an "offline" event so we respond quickly. */
export const DEFAULT_OFFLINE_PROBE_TIMEOUT_MS = 2000;
/** Debounce delay before probing after an "online" event. */
export const DEFAULT_DEBOUNCE_MS = 400;
/** Polling interval as fallback when events don't fire (e.g. mobile devices). */
export const DEFAULT_POLL_INTERVAL_MS = 10000;
