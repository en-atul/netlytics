import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { checkConnectivity } from "../src/connectivity";

describe("checkConnectivity", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.navigator = { connection: undefined } as Navigator;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("returns online when probe succeeds", async () => {
    globalThis.fetch = mock(() => Promise.resolve({ ok: true } as Response));
    const result = await checkConnectivity({
      probeUrls: ["https://example.com/probe"],
      timeout: 1000,
    });
    expect(result.online).toBe(true);
    expect(result.connectionType).toBeDefined();
  });

  test("returns offline when probe fails", async () => {
    globalThis.fetch = mock(() => Promise.reject(new Error("Network error")));
    const result = await checkConnectivity({
      probeUrls: ["https://example.com/probe"],
      timeout: 100,
    });
    expect(result.online).toBe(false);
  });

  test("uses custom probe URLs", async () => {
    const customUrl = "https://my-cdn.com/ping";
    globalThis.fetch = mock(() => Promise.resolve({ ok: true } as Response));
    await checkConnectivity({ probeUrls: [customUrl], timeout: 100 });
    expect((globalThis.fetch as ReturnType<typeof mock>).mock.calls[0]?.[0]).toContain(
      "my-cdn.com"
    );
  });
});
