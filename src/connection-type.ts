import type { ConnectionType, NetworkQuality } from "./types";

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

/** Connection type from Network Information API when available; "unknown" otherwise (e.g. Safari). */
export function getConnectionType(): ConnectionType {
  const conn = getConnection();
  if (!conn) return "unknown";

  const type = (conn.type ?? "").toLowerCase();

  if (type === "wifi") return "wifi";
  if (type === "ethernet") return "ethernet";
  if (type === "none") return "none";
  if (type === "cellular") return "cellular";
  return "unknown";
}

const DEFAULT_QUALITY_PROBE_URL =
  "https://raw.githubusercontent.com/en-atul/netlytics/main/assets/2mb.pdf";

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
  qualityProbeUrl?: string;
}

/** Network quality from API when available; otherwise measured via optional qualityProbeUrl fetch. */
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


