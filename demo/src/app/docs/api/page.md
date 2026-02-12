---
title: API Reference
nextjs:
  metadata:
    title: API Reference
    description: Functions and types exported by the Netlytics package.
---

Functions and types exported by the Netlytics package. {% .lead %}

---

## checkConnectivity(options?)

Checks if the device has reachable internet by probing one or more URLs. Does not rely on `navigator.onLine` alone. Returns `Promise<ConnectivityResult>`.

### Returns — ConnectivityResult

- `online: boolean` — Internet reachable (at least one probe succeeded).
- `connectionType: ConnectionType` — `"wifi"` | `"cellular"` | `"ethernet"` | `"none"` | `"unknown"`.
- `networkQuality: NetworkQuality` — `"slow-2g"` | `"2g"` | `"3g"` | `"4g"` | `"unknown"`.
- `latencyMs?: number` — RTT of the first successful probe, if any.

### Options — ConnectivityOptions

- `timeout?: number` — Timeout in ms per probe (default: `5000`).
- `requiredSuccesses?: number` — How many probes must succeed (default: `1`).
- `probeUrls?: string[]` — Custom URLs (must support CORS).

---

## watchConnectivity(callback, options?)

Subscribes to online/offline events and validates each with a network probe. On mobile, also uses polling and visibility-change when events don't fire. Returns an `unsubscribe()` function.

### Parameters

- `callback: (result: ConnectivityResult) => void` — Called when connectivity state changes (after probe).

### Options — WatchConnectivityOptions

- `observe?: boolean` — Listen and validate (default: `true`).
- `debounceMs?: number` — Delay before probing after "online" (default: `400`).
- `offlineProbeTimeoutMs?: number` — Timeout for "offline" probe (default: `2000`).
- `onChecking?: () => void` — Called when a probe is about to run.
- `pollIntervalMs?: number` — Polling fallback in ms (default: `10000`). Set `0` to disable.
- `pollingEnabled?: boolean` — Enable polling fallback (default: `true`).
- `visibilityChange?: boolean` — Re-check when page becomes visible (default: `true`).
- Plus all ConnectivityOptions (`timeout`, `probeUrls`, etc.).

---

## measureLatency(options?)

Measures round-trip time (RTT) in ms by sampling requests to a reliable endpoint. Returns `Promise<number | null>` — average RTT or `null` if all samples failed.

### Options — LatencyOptions

- `timeout?: number` — Timeout per request (default: `5000`).
- `sampleSize?: number` — Number of samples (default: `3`).

---

## getConnectionType()

Returns `ConnectionType` from the Network Information API when available. Use for UX only; do not use as the only check for online/offline. Returns `"wifi"` | `"cellular"` | `"ethernet"` | `"none"` | `"unknown"`.

---

## getNetworkQuality()

Returns `NetworkQuality` from the Network Information API when available. Represents connection speed/quality. Returns `"slow-2g"` | `"2g"` | `"3g"` | `"4g"` | `"unknown"`.

---

## Types

- `ConnectionType` — `"wifi" | "cellular" | "ethernet" | "none" | "unknown"`
- `NetworkQuality` — `"slow-2g" | "2g" | "3g" | "4g" | "unknown"`
- `ConnectivityResult` — `{ online, connectionType, networkQuality, latencyMs? }`
- `ConnectivityOptions` — `{ timeout?, requiredSuccesses?, probeUrls? }`
- `WatchConnectivityOptions` — extends `ConnectivityOptions` with `observe`, `debounceMs`, `offlineProbeTimeoutMs`, `onChecking`, `pollIntervalMs`, `pollingEnabled`, `visibilityChange`
- `LatencyOptions` — `{ timeout?, sampleSize? }`
