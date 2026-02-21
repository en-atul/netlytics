# netlytics

## 0.3.0

### Minor Changes

- 85d3db7: Add getNetworkQualityAsync for network quality with Safari/Firefox fallback via optional probe URL (default: repo-hosted 2mb.pdf).

## 0.2.0

### Minor Changes

- 4a3706f: feat: improve mobile connectivity detection with polling fallback

  - Add polling mechanism (10s default) as fallback for mobile devices where browser online/offline events don't fire reliably
  - Add Network Information API change event listener for better mobile support
  - Add visibility change handler to detect connectivity when page becomes visible
  - Implement result caching to avoid unnecessary UI re-renders when connectivity status hasn't changed
  - Fix "checking" state getting stuck by ensuring callback always fires after onChecking
  - Disable onChecking during polling to prevent UI flashing every 10 seconds
  - Add animated network background visualization to demo
  - Separate mobile and desktop network handling strategies

  BREAKING CHANGE: None

  This ensures connectivity detection works reliably on mobile devices even when browser online/offline events don't fire, while optimizing performance by avoiding unnecessary updates.
