/**
 * Connection type from the Network Information API when available.
 * Do not use as sole source of truth for "internet active" — always validate with probes.
 */
export type ConnectionType = "wifi" | "cellular" | "ethernet" | "none" | "unknown";

/**
 * High-level connectivity status for UI prompts.
 */
export type ConnectivityStatus = "checking" | "online" | "offline";

/**
 * Result of an internet connectivity check.
 */
export interface ConnectivityResult {
  /** Whether the device has reachable internet (validated by probe). */
  online: boolean;
  /** Best-effort connection type; may be unknown on unsupported browsers. */
  connectionType: ConnectionType;
  /** Latency in ms to the probe that succeeded, if measured. */
  latencyMs?: number;
}

/**
 * Options for connectivity checks.
 */
export interface ConnectivityOptions {
  /** Timeout in ms for each probe request. */
  timeout?: number;
  /** How many endpoints must succeed to consider online (default: 1). */
  requiredSuccesses?: number;
  /** Custom probe URLs (must support CORS and be reliable). */
  probeUrls?: string[];
}

/**
 * Options for latency measurement.
 */
export interface LatencyOptions {
  /** Timeout in ms per request. */
  timeout?: number;
  /** Sample size (number of requests) to compute average RTT. */
  sampleSize?: number;
}

/**
 * Options for the main Netlytics instance.
 */
export interface NetlyticsOptions extends ConnectivityOptions, LatencyOptions {}
