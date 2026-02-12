---
title: Quick Start
nextjs:
  metadata:
    title: Quick Start
    description: Install Netlytics and run your first connectivity check.
---

Install Netlytics and run your first connectivity check. {% .lead %}

---

## Install

Install the package with your preferred package manager:

```bash
# npm
npm install netlytics

# bun
bun add netlytics

# pnpm
pnpm add netlytics

# yarn
yarn add netlytics
```

---

## One-time check

Import and call `checkConnectivity()` to verify internet access with a real HTTP probe:

```js
import { checkConnectivity } from "netlytics";

const result = await checkConnectivity();
console.log(result.online);           // true | false
console.log(result.connectionType);   // "wifi" | "cellular" | "ethernet" | "unknown"
console.log(result.networkQuality);   // "2g" | "3g" | "4g" | "unknown"
console.log(result.latencyMs);        // number | undefined
```

---

## Live updates

Use `watchConnectivity()` to react to connectivity changes. Both online and offline events are validated with a probe:

```js
import { watchConnectivity } from "netlytics";

const unsubscribe = watchConnectivity(
  (result) => {
    console.log(result.online ? "Connected" : "Disconnected");
  },
  { observe: true }
);

// Cleanup when done
unsubscribe();
```

---

## Measure latency

Get round-trip time (RTT) in milliseconds:

```js
import { measureLatency } from "netlytics";

const latencyMs = await measureLatency();
console.log(latencyMs); // number | null
```

---

## Next steps

- [API Reference](/docs/api) — Full options and types.
- [Usage](/docs/usage) — Examples for React, Vue, Angular, Svelte, and vanilla JS.
- [Try it](/try-it) — Live demo in the browser.
