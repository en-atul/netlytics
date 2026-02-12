---
title: Getting started
---

Reliable internet connectivity, latency, and connection type for web apps — without draining the battery. {% .lead %}

{% quick-links %}

{% quick-link title="Introduction" icon="installation" href="/docs/introduction" description="Learn about Netlytics and how it solves connectivity detection problems." /%}

{% quick-link title="Quick Start" icon="presets" href="/docs/quick-start" description="Get up and running with Netlytics in minutes." /%}

{% quick-link title="API Reference" icon="plugins" href="/docs/api" description="Complete API documentation with all functions and types." /%}

{% quick-link title="Try it" icon="theming" href="/try-it" description="See connectivity detection in action before you install." /%}

{% /quick-links %}

Netlytics is a lightweight library for detecting internet connectivity, measuring latency, and identifying connection types (WiFi, cellular, ethernet) in web applications. It fixes the common problem where apps report "not connected" even when the user is online.

---

## Quick start

Get started with Netlytics in just a few steps.

### Installing dependencies

Install the package with your preferred package manager:

```bash
npm install netlytics
```

Or with bun, pnpm, or yarn:

```bash
bun add netlytics
pnpm add netlytics
yarn add netlytics
```

### Your first connectivity check

Import and call `checkConnectivity()` to verify internet access:

```js
import { checkConnectivity } from "netlytics";

const result = await checkConnectivity();
console.log(result.online);           // true | false
console.log(result.connectionType);   // "wifi" | "cellular" | "ethernet" | "unknown"
console.log(result.networkQuality);   // "2g" | "3g" | "4g" | "unknown"
console.log(result.latencyMs);        // number | undefined
```

---

## Why Netlytics?

Many connectivity solutions give wrong or inconsistent results because they rely only on `navigator.onLine` (often `true` when on any network, even without internet), use a single endpoint that can fail, or don't handle WiFi vs cellular or tab visibility well.

Netlytics uses multiple probe URLs, configurable timeouts, and validates both online and offline events with real requests. It never trusts `navigator.onLine` alone and adapts to desktop vs mobile and to browser quirks.

---

## Next steps

- Read the [Introduction](/docs/introduction) to learn more about Netlytics
- Check out the [Quick Start](/docs/quick-start) guide
- Explore the [API Reference](/docs/api) for complete documentation
- See it in action with the [Try it](/try-it) demo
