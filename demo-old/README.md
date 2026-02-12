# Netlytics — Demo

This app demonstrates [Netlytics](../) in the browser: connectivity check, connection type, and latency.

## Run locally

From the **repo root** (build the library first, then the demo):

```bash
bun run build
cd demo && bun install && bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Test “offline”:** Use Chrome DevTools → Network → set to “Offline”, then click “Check again” to see “Internet not connected”.

## Deploy

The app is set up to deploy on [Vercel](https://vercel.com). From the repo root, Vercel will:

1. Run `bun install`
2. Run `bun run build` (builds the Netlytics library)
3. Install and build the demo in `demo`
4. Serve `demo/dist`


