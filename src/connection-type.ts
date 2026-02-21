import type { ConnectionType, NetworkQuality } from "./types";

/**
 * Network Information API (navigator.connection) is not available in all browsers.
 * When available, use it as a hint only — do not use for "internet active" decision.
 */
interface NetworkInformation {
  effectiveType?: string;
  type?: string;
  downlink?: number;
  rtt?: number;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  const n = navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };
  return n.connection ?? n.mozConnection ?? n.webkitConnection;
}

/**
 * Returns the current connection type when the Network Information API is supported.
 * Returns "unknown" when not supported (e.g. many desktop browsers, Safari).
 * Use this for UX (e.g. "Connected via WiFi") — never as the only check for online/offline.
 *
 * Note: On desktop Chrome, effectiveType is often "4g" as a speed/quality hint, not actual
 * cellular. We only report "cellular" when conn.type is explicitly "cellular", so Mac/Wi‑Fi
 * doesn't show "Mobile data".
 */
export function getConnectionType(): ConnectionType {
  const conn = getConnection();
  if (!conn) return "unknown";

  const type = (conn.type ?? "").toLowerCase();

  if (type === "wifi") return "wifi";
  if (type === "ethernet") return "ethernet";
  if (type === "none") return "none";
  // Only report "cellular" when type explicitly says so. On desktop Chrome, effectiveType
  // is often "4g" as a speed/quality hint — don't treat that as "Mobile data".
  if (type === "cellular") return "cellular";
  return "unknown";
}

/** Default 2MB test file for quality measurement. Hosted in this repo. */
const DEFAULT_QUALITY_PROBE_URL =
  "https://raw.githubusercontent.com/en-atul/netlytics/main/assets/2mb.pdf";

/**
 * Measures connection quality by fetching a test file (Safari/Firefox fallback when
 * Network Information API is not available). Uses repo-hosted 2mb.pdf by default.
 */
async function measureConnectionQuality(
  testFileUrl: string = DEFAULT_QUALITY_PROBE_URL
): Promise<{ speedMbps: string; quality: NetworkQuality }> {
  const start = performance.now();
  const response = await fetch(testFileUrl + "?cache=" + Date.now());
  const blob = await response.blob();
  const duration = (performance.now() - start) / 1000;
  const bitsLoaded = blob.size * 8;
  const speedMbps = (bitsLoaded / duration) / (1024 * 1024);

  let quality: NetworkQuality;
  if (speedMbps < 0.1) quality = "slow-2g";
  else if (speedMbps < 0.5) quality = "2g";
  else if (speedMbps < 5) quality = "3g";
  else quality = "4g";

  return { speedMbps: speedMbps.toFixed(2), quality };
}

export function getNetworkQuality(): NetworkQuality {
  const conn = getConnection();
  if (!conn) return "unknown";

  const quality = (conn.effectiveType ?? "").toLowerCase();

  if (quality === "slow-2g") return "slow-2g";
  if (quality === "2g") return "2g";
  if (quality === "3g") return "3g";
  if (quality === "4g") return "4g";
  return "unknown";
}

export interface GetNetworkQualityAsyncOptions {
  /**
   * URL of a test file to fetch for speed measurement (e.g. 2MB image).
   * Host yourself; used when Network Information API is unavailable (Safari, Firefox). */
  qualityProbeUrl?: string;
}

/**
 * Returns network quality from the Network Information API when available.
 * When unavailable (Safari, Firefox), measures quality by fetching a test file.
 * Provide qualityProbeUrl (e.g. your own /test-file-2mb.jpg) for the fallback.
 */
export async function getNetworkQualityAsync(
  options: GetNetworkQualityAsyncOptions = {}
): Promise<NetworkQuality> {
  const conn = getConnection();

  if (conn?.effectiveType) {
    const q = conn.effectiveType.toLowerCase();
    if (["slow-2g", "2g", "3g", "4g"].includes(q)) {
      return q as NetworkQuality;
    }
  }

  try {
    const { quality } = await measureConnectionQuality(options.qualityProbeUrl);
    return quality;
  } catch {
    return "unknown";
  }
}


