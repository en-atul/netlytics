import type { ConnectionType } from "./types";

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
 */
export function getConnectionType(): ConnectionType {
  const conn = getConnection();
  if (!conn) return "unknown";

  const type = (conn.type ?? conn.effectiveType ?? "").toLowerCase();
  if (type === "wifi") return "wifi";
  if (type === "cellular" || type === "4g" || type === "3g" || type === "2g") return "cellular";
  if (type === "ethernet") return "ethernet";
  if (type === "none") return "none";
  return "unknown";
}
