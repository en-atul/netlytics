---
title: Design principles
nextjs:
  metadata:
    title: Design principles
    description: The core design principles that guide Netlytics development.
---

The core design principles that guide Netlytics development. {% .lead %}

---

## Performance & Battery

Netlytics is built with performance in mind to avoid draining device battery:

- **Probes run only when needed** — No continuous polling unless explicitly enabled
- **Configurable polling** — You control polling intervals or can disable it entirely
- **Skip redundant updates** — UI updates are skipped when connectivity hasn't meaningfully changed
- **Efficient timeouts** — Configurable timeouts prevent hanging requests
- **Cache busting** — Prevents false positives from cached responses

---

## Browser Differences

Safari and WebKit behave differently from Chromium-based browsers:

- **Event timing** — `online`/`offline` events fire at different times
- **Network Information API** — Support varies across browsers
- **Mobile behavior** — iOS Safari has different event patterns than Chrome on Android

Netlytics accounts for these differences so behavior is consistent where possible, while adapting to browser quirks when necessary.

---

## Mobile-First Strategy

On mobile, Netlytics uses a different strategy:

- **Event-based detection** — Uses browser events when available
- **Optional polling** — Provides polling fallback for unreliable event scenarios
- **Visibility-change handling** — Re-checks when the user returns to the tab
- **Mobile-specific timeouts** — Shorter timeouts for offline probes on mobile

This ensures connectivity updates are detected even when the browser doesn't fire standard events reliably.

---

## Reliability Over Convenience

Netlytics prioritizes accuracy:

- **Never trusts `navigator.onLine` alone** — Always validates with real HTTP probes
- **Multiple probe URLs** — Reduces false negatives from single endpoint failures
- **Validates both online and offline** — Confirms offline state with a quick probe
- **Configurable success requirements** — Can require multiple successful probes

---

## Developer Experience

The API is designed for clarity and flexibility:

- **Intentional checks** — `checkConnectivity()` for one-off checks
- **Continuous watching** — `watchConnectivity()` for reactive updates
- **Clear return types** — Well-defined TypeScript types
- **Sensible defaults** — Works out of the box with minimal configuration
- **Full control** — All options are configurable when needed

---

## Backward Compatibility

Netlytics maintains compatibility:

- **Works in all modern browsers** — No polyfills required for core functionality
- **Graceful degradation** — Falls back when APIs aren't available
- **Type-safe** — Full TypeScript support with exported types

---

## Open Source Values

- **Transparent** — All code is open source
- **Community-driven** — Contributions welcome
- **Well-documented** — Clear API documentation and examples
- **Tested** — Comprehensive test coverage
