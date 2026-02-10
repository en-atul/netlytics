import {
  DEFAULT_LATENCY_SAMPLE_SIZE,
  DEFAULT_LATENCY_TIMEOUT_MS,
  DEFAULT_PROBE_URLS,
} from "./constants";
import type { LatencyOptions } from "./types";

function measureRtt(url: string, timeoutMs: number): Promise<number | null> {
  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const cacheBust = url.includes("?") ? `&_=${Date.now()}` : `?_=${Date.now()}`;

  return fetch(`${url}${cacheBust}`, {
    method: "HEAD",
    mode: "cors",
    cache: "no-store",
    signal: controller.signal,
  })
    .then((res) => {
      clearTimeout(timeoutId);
      return res.ok ? Math.round(performance.now() - start) : null;
    })
    .catch(() => {
      clearTimeout(timeoutId);
      return null;
    });
}

/**
 * Measures round-trip time (latency) in ms by sampling requests to a reliable endpoint.
 * Returns the average RTT or null if all samples failed.
 */
export async function measureLatency(options: LatencyOptions = {}): Promise<number | null> {
  const timeout = options.timeout ?? DEFAULT_LATENCY_TIMEOUT_MS;
  const sampleSize = options.sampleSize ?? DEFAULT_LATENCY_SAMPLE_SIZE;
  const url = DEFAULT_PROBE_URLS[0];

  const samples: number[] = [];
  for (let i = 0; i < sampleSize; i++) {
    const rtt = await measureRtt(url, timeout);
    if (rtt !== null) samples.push(rtt);
  }

  if (samples.length === 0) return null;
  return Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
}
