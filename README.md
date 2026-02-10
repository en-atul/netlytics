# Netlytics

Reliable **internet connectivity**, **latency**, and **connection type** (WiFi / mobile data) for web apps. Built to fix the common problem where libraries report "not connected" even when the user is online.

- **Accurate connectivity** — Validates with real HTTP probes, not just `navigator.onLine`
- **WiFi & mobile data** — Same logic for both; no false negatives from connection type
- **Framework-agnostic** — Use from React, Vue, Angular, Svelte, or vanilla JS
- **Connection type** — Optional hint (wifi / cellular) for UX when the Network Information API is available

## Install

```bash
bun add netlytics
# or
npm install netlytics
pnpm add netlytics
```

## Quick start

```ts
import { checkConnectivity, getConnectionType, measureLatency } from "netlytics";

// Is the user actually online? (probe-based, not just navigator.onLine)
const result = await checkConnectivity();
console.log(result.online);        // true | false
console.log(result.connectionType); // "wifi" | "cellular" | "unknown" | ...
console.log(result.latencyMs);      // optional RTT from probe

// Connection type hint (when supported by browser)
const type = getConnectionType();   // "wifi" | "cellular" | "ethernet" | "unknown"

// Latency in ms
const latency = await measureLatency();
console.log(latency);               // number | null
```

## Why Netlytics?

Many NPM connectivity libraries give **wrong results**:

- Relying only on `navigator.onLine` (true when on any network, even without internet)
- Single-endpoint checks that fail due to CORS, CDN, or that one URL being down
- No distinction between WiFi and mobile data, or bad behavior when switching

Netlytics uses **multiple probe URLs**, **timeouts**, and **optional connection-type hints** so you can show correct prompts like "Internet not connected" / "Internet connected" and "Connected via WiFi" / "Connected via mobile data".

## API

### `checkConnectivity(options?)`

Returns `Promise<ConnectivityResult>`:

- `online: boolean` — Internet reachable (at least one probe succeeded)
- `connectionType: ConnectionType` — Best-effort: `"wifi"` | `"cellular"` | `"ethernet"` | `"none"` | `"unknown"`
- `latencyMs?: number` — RTT of the first successful probe

Options:

- `timeout` — Timeout in ms per probe (default: `5000`)
- `requiredSuccesses` — How many probes must succeed (default: `1`)
- `probeUrls` — Custom URLs (must support CORS)

### `getConnectionType()`

Returns `ConnectionType` from the Network Information API when available. Use for UX only; do not use as the only check for online/offline.

### `measureLatency(options?)`

Returns `Promise<number | null>` — average RTT in ms, or `null` if all samples failed.

Options:

- `timeout` — Timeout per request (default: `5000`)
- `sampleSize` — Number of samples (default: `3`)

## Development

```bash
bun install
bun run build
bun test
bun run lint
```

## License

MIT
