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
    (globalThis as unknown as { fetch: (input: RequestInfo | URL) => Promise<Response> }).fetch =
      mock(() => Promise.resolve({ ok: true } as Response));
    const result = await checkConnectivity({
      probeUrls: ["https://example.com/probe"],
      timeout: 1000,
    });
    expect(result.online).toBe(true);
    expect(result.connectionType).toBeDefined();
  });

  test("returns offline when probe fails", async () => {
    (globalThis as unknown as { fetch: (input: RequestInfo | URL) => Promise<Response> }).fetch =
      mock(() => Promise.reject(new Error("Network error")));
    const result = await checkConnectivity({
      probeUrls: ["https://example.com/probe"],
      timeout: 100,
    });
    expect(result.online).toBe(false);
  });

  test("uses custom probe URLs", async () => {
    const customUrl = "https://my-cdn.com/ping";
    const fetchMock = mock(() => Promise.resolve({ ok: true } as Response));
    (globalThis as unknown as { fetch: (input: RequestInfo | URL) => Promise<Response> }).fetch =
      fetchMock;
    await checkConnectivity({ probeUrls: [customUrl], timeout: 100 });
    const firstCallUrl = String((fetchMock.mock.calls[0] as unknown as [string] | undefined)?.[0] ?? "");
    expect(firstCallUrl).toContain("my-cdn.com");
  });
});
