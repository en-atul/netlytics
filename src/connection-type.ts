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


