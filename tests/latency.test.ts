import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { measureLatency } from "../src/latency";

describe("measureLatency", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    (globalThis as unknown as { fetch: (input: RequestInfo | URL) => Promise<Response> }).fetch =
      mock(() => Promise.resolve({ ok: true } as Response));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("returns average RTT when requests succeed", async () => {
    const result = await measureLatency({
      sampleSize: 2,
      timeout: 1000,
    });
    expect(result).not.toBeNull();
    expect(typeof result).toBe("number");
    expect((result as number) >= 0).toBe(true);
  });

  test("returns null when all requests fail", async () => {
    (globalThis as unknown as { fetch: (input: RequestInfo | URL) => Promise<Response> }).fetch =
      mock(() => Promise.reject(new Error("fail")));
    const result = await measureLatency({ sampleSize: 2, timeout: 50 });
    expect(result).toBeNull();
  });
});
