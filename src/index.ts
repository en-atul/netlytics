/**
 * Netlytics — reliable internet connectivity, latency, and connection type
 * for web apps. Avoids false "offline" results; works across WiFi and mobile data.
 */

export { checkConnectivity } from "./connectivity";
export { getConnectionType } from "./connection-type";
export { measureLatency } from "./latency";
export {
  DEFAULT_PROBE_URLS,
  DEFAULT_PROBE_TIMEOUT_MS,
  DEFAULT_REQUIRED_SUCCESSES,
  DEFAULT_LATENCY_TIMEOUT_MS,
  DEFAULT_LATENCY_SAMPLE_SIZE,
} from "./constants";
export type {
  ConnectionType,
  ConnectivityStatus,
  ConnectivityResult,
  ConnectivityOptions,
  LatencyOptions,
  NetlyticsOptions,
} from "./types";
