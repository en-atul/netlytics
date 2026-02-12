---
title: Introduction
nextjs:
  metadata:
    title: Introduction
    description: Reliable internet connectivity, latency, and connection type for web apps — without draining the battery.
---

Reliable internet connectivity, latency, and connection type for web apps — without draining the battery. {% .lead %}

---

## What is Netlytics?

Netlytics is a lightweight library for detecting internet connectivity, measuring latency, and identifying connection types (WiFi, cellular, ethernet) in web applications. It fixes the common problem where apps report "not connected" even when the user is online.

Connectivity is validated with **real HTTP probes** instead of relying on `navigator.onLine` or the `online`/`offline` events alone, which are unreliable across browsers and often don't fire on mobile. The API is designed so you can choose **intentional checks** or **continuous watching** based on your requirements.

---

## Design principles

- **Performance & battery** — Built with performance in mind to avoid draining device battery. Probes run only when needed; polling is configurable or disableable; and we skip redundant UI updates when connectivity hasn't meaningfully changed.
- **Browser differences** — Safari and WebKit behave differently from Chromium-based browsers (e.g. when and how `online`/`offline` fire, Network Information API support). Netlytics accounts for these differences so behavior is consistent where possible.
- **Mobile-first strategy** — On mobile we use a different strategy: event-based detection where available, plus optional polling and visibility-change handling when the user returns to the tab. This ensures connectivity updates are detected even when the browser doesn't fire standard events.

---

## Why Netlytics?

Many connectivity solutions give wrong or inconsistent results because they:

- Rely only on `navigator.onLine` (often `true` when on any network, even without internet)
- Use a single endpoint that can fail due to CORS, CDN issues, or that one URL being down
- Don't handle WiFi vs cellular or tab visibility well, especially on Safari and mobile browsers

Netlytics uses multiple probe URLs, configurable timeouts, and validates both online and offline events with real requests. It never trusts `navigator.onLine` alone and adapts to desktop vs mobile and to browser quirks.

---

## API at a glance

Use the API according to your requirement:

- **Intentional check** — Call `checkConnectivity()` when you need a one-off check (e.g. before a critical action, on button click, or on route change). No listeners, no polling; you control when the probe runs.
- **Auto-watch** — Use `watchConnectivity()` when you need continuous updates (e.g. offline banner, sync status). It subscribes to events and, on mobile, can use optional polling. You can tune `pollIntervalMs` or set `pollingEnabled: false` if you only want event-based updates.
- **measureLatency()** — Measure round-trip time (RTT) in ms when you need latency data.
- **getConnectionType()** / **getNetworkQuality()** — Best-effort hints from the Network Information API when available (WiFi, cellular, 2G/3G/4G). Use for UX only; always validate reachability with probes.

---

## What you get

- **checkConnectivity(options?)** — One-time probe-based check; returns `online`, `connectionType`, `networkQuality`, and optional `latencyMs`.
- **watchConnectivity(callback, options?)** — Subscribe to connectivity changes; events are confirmed with a probe. Returns an `unsubscribe()` function.
- **measureLatency(options?)** — Returns `Promise<number | null>` (average RTT in ms).
- **getConnectionType()** / **getNetworkQuality()** — Synchronous hints when the Network Information API is available.
