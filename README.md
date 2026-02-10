![Netlytics cover](assets/netlytics.avif)

<div align="center"><strong>Netlytics</strong></div>
<div align="center">Reliable internet connectivity, latency, and connection type for web apps.<br />Validates with real HTTP probes — never trust navigator.onLine alone.</div>
<br />
<div align="center">
<a href="https://netlytics.vercel.app">Website</a>
<span> · </span>
<a href="https://github.com/your-org/netlytics">GitHub</a>
<span> · </span>
<a href="https://www.npmjs.com/package/netlytics">npm</a>
</div>

## Introduction

A lightweight library for detecting internet connectivity, measuring latency, and identifying connection types (WiFi, mobile data, ethernet) in web applications. Built to fix the common problem where libraries report "not connected" even when the user is online.

Netlytics validates connectivity with real HTTP probes instead of relying on unreliable browser APIs. It works consistently across WiFi and mobile data, providing accurate status updates for your users.

## Why

Many NPM connectivity libraries give **wrong results**:

- Relying only on `navigator.onLine` (true when on any network, even without internet)
- Single-endpoint checks that fail due to CORS, CDN issues, or that one URL being down
- No distinction between WiFi and mobile data, or bad behavior when switching networks

We believe connectivity detection should be **reliable** and **accurate**. Netlytics uses multiple probe URLs, configurable timeouts, and validates both online and offline events with real network requests — never trusting `navigator.onLine` alone.

## Install

Install Netlytics from your command line.

#### With bun

```sh
bun add netlytics
```

#### With npm

```sh
npm install netlytics
```

#### With pnpm

```sh
pnpm add netlytics
```

#### With yarn

```sh
yarn add netlytics
```

## Getting started

Import the functions you need and start checking connectivity.

```ts
import {
  checkConnectivity,
  getConnectionType,
  measureLatency,
  watchConnectivity,
} from "netlytics";

// Check if the user is actually online (probe-based, not just navigator.onLine)
const result = await checkConnectivity();
console.log(result.online); // true | false
console.log(result.connectionType); // "wifi" | "cellular" | "unknown" | ...
console.log(result.latencyMs); // optional RTT from probe

// Get connection type hint (when supported by browser)
const type = getConnectionType(); // "wifi" | "cellular" | "ethernet" | "unknown"

// Measure latency in ms
const latency = await measureLatency();
console.log(latency); // number | null

// Live updates: both "online" and "offline" events are validated with a probe
const unsubscribe = watchConnectivity(
  (result) => {
    console.log(result.online ? "Connected" : "Disconnected");
  },
  { observe: true } // default; set observe: false to disable
);
// later: unsubscribe();
```

## API

A set of functions to help you build reliable connectivity detection without dealing with browser inconsistencies.

### `checkConnectivity(options?)`

Checks if the device has reachable internet by probing one or more URLs. Returns `Promise<ConnectivityResult>`:

- `online: boolean` — Internet reachable (at least one probe succeeded)
- `connectionType: ConnectionType` — Best-effort: `"wifi"` | `"cellular"` | `"ethernet"` | `"none"` | `"unknown"`
- `networkQuality: NetworkQuality` — Best-effort: `"slow-2g"` | `"2g"` | `"3g"` | `"4g"` | `"unknown"`
- `latencyMs?: number` — RTT of the first successful probe

**Options:**

- `timeout` — Timeout in ms per probe (default: `5000`)
- `requiredSuccesses` — How many probes must succeed (default: `1`)
- `probeUrls` — Custom URLs (must support CORS)

### `getConnectionType()`

Returns `ConnectionType` from the Network Information API when available. Use for UX only; do not use as the only check for online/offline.

### `getNetworkQuality()`

Returns `NetworkQuality` from the Network Information API when available. Represents connection speed/quality (slow-2g, 2g, 3g, 4g).

### `measureLatency(options?)`

Measures round-trip time (latency) in ms by sampling requests to a reliable endpoint. Returns `Promise<number | null>` — average RTT in ms, or `null` if all samples failed.

**Options:**

- `timeout` — Timeout per request (default: `5000`)
- `sampleSize` — Number of samples (default: `3`)

### `watchConnectivity(callback, options?)`

Subscribes to `online` / `offline` events and **validates each with a network probe** (never relies only on `navigator.onLine`). Returns an `unsubscribe()` function.

**Options (all optional):**

- `observe` — When `true` (default), listen and validate. When `false`, no listeners (manual checks only).
- `debounceMs` — Delay before probing after an "online" event (default: `400`).
- `offlineProbeTimeoutMs` — Timeout when validating an "offline" event (default: `2000`).
- `onChecking` — Called when a probe is about to run (e.g. to show "Checking…").
- Plus all `ConnectivityOptions` (`timeout`, `probeUrls`, etc.).

## Try it

A live demo is available to test Netlytics in the browser before installing:

- **[Demo (Vercel)](https://netlytics.vercel.app)** — See connectivity detection, connection type, and latency in real time

## Support

Netlytics works with all popular JavaScript frameworks and vanilla JavaScript:

| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="48px" height="48px" alt="React logo"> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg" width="48px" height="48px" alt="Vue logo"> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg" width="48px" height="48px" alt="Angular logo"> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/svelte/svelte-original.svg" width="48px" height="48px" alt="Svelte logo"> | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="48px" height="48px" alt="JavaScript logo"> |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React ✔                                                                                                                                         | Vue ✔                                                                                                                                       | Angular ✔                                                                                                                                            | Svelte ✔                                                                                                                                          | Vanilla JS ✔                                                                                                                                         |

## License

MIT License
