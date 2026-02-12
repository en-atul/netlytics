---
title: Architecture guide
nextjs:
  metadata:
    title: Architecture guide
    description: Learn how Netlytics is structured internally and how the components work together.
---

Learn how Netlytics is structured internally and how the components work together. {% .lead %}

---

## Overview

Netlytics is organized into focused modules, each handling a specific aspect of connectivity detection:

- **`connectivity.ts`** — Core connectivity checking with HTTP probes
- **`watch-connectivity.ts`** — Event-based watching with validation
- **`latency.ts`** — Latency measurement utilities
- **`connection-type.ts`** — Network Information API integration
- **`utils.ts`** — Shared utility functions
- **`constants.ts`** — Default configuration values
- **`types.ts`** — TypeScript type definitions

---

## Core Components

### Connectivity Checking (`connectivity.ts`)

The `checkConnectivity()` function is the core of Netlytics. It:

1. **Probes multiple URLs** — Uses a list of reliable endpoints (defaults include Google, Cloudflare, etc.)
2. **Validates with real requests** — Makes actual HTTP GET requests with CORS support
3. **Handles timeouts** — Each probe has a configurable timeout (default: 5 seconds)
4. **Requires successes** — Can be configured to require multiple successful probes
5. **Returns comprehensive results** — Includes online status, connection type, network quality, and latency

### Watching Connectivity (`watch-connectivity.ts`)

The `watchConnectivity()` function provides continuous monitoring:

1. **Subscribes to events** — Listens to browser `online`/`offline` events
2. **Validates with probes** — Every event is confirmed with an actual HTTP probe
3. **Mobile fallbacks** — Uses polling and visibility-change handling on mobile when events don't fire
4. **Debouncing** — Prevents rapid-fire checks when coming back online
5. **Returns unsubscribe** — Clean function to stop watching

### Latency Measurement (`latency.ts`)

The `measureLatency()` function:

1. **Samples multiple requests** — Makes multiple probes to get accurate RTT
2. **Averages results** — Returns the average latency from successful samples
3. **Handles failures** — Returns `null` if all samples fail

### Connection Type Detection (`connection-type.ts`)

Uses the Network Information API when available:

1. **Reads from API** — Accesses `navigator.connection` or `navigator.mozConnection`
2. **Normalizes values** — Converts API values to consistent types
3. **Fallback handling** — Returns `"unknown"` when API is unavailable

---

## Design Decisions

### Why Multiple Probe URLs?

Using multiple URLs ensures reliability:
- If one endpoint is down, others can still succeed
- Different CDNs may have different availability
- Reduces false negatives from single-point failures

### Why Validate Events?

Browser `online`/`offline` events are unreliable:
- They often fire when connected to WiFi without internet
- Mobile browsers may not fire them consistently
- They don't guarantee actual internet connectivity

Netlytics validates every event with a real HTTP probe to ensure accuracy.

### Why Polling on Mobile?

Mobile browsers have inconsistent event behavior:
- Safari on iOS may not fire events reliably
- Some Android browsers have delays
- Tab visibility changes aren't always detected

Polling provides a reliable fallback for mobile scenarios.

---

## File Structure

```text
src/
├── index.ts              # Main exports
├── connectivity.ts      # checkConnectivity()
├── watch-connectivity.ts # watchConnectivity()
├── latency.ts            # measureLatency()
├── connection-type.ts   # getConnectionType(), getNetworkQuality()
├── constants.ts          # Default values
├── types.ts              # TypeScript types
└── utils.ts              # Shared utilities
```

---

## Contributing

When contributing to Netlytics:

1. **Follow the existing patterns** — Keep code style consistent
2. **Add tests** — All new features should have tests
3. **Update types** — Keep TypeScript types in sync
4. **Document changes** — Update relevant documentation

See [How to contribute](/docs/how-to-contribute) for more details.
