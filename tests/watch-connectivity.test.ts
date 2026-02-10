import { beforeEach, describe, expect, mock, test } from "bun:test";
import { watchConnectivity } from "../src/watch-connectivity";

describe("watchConnectivity", () => {
  beforeEach(() => {
    globalThis.navigator = { connection: undefined } as Navigator;
  });

  test("with observe: false does not add listeners", () => {
    const callback = mock(() => {});
    const unsubscribe = watchConnectivity(callback, { observe: false });
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });

  test("with observe: false returns no-op unsubscribe", () => {
    const unsubscribe = watchConnectivity(() => {}, { observe: false });
    expect(() => unsubscribe()).not.toThrow();
  });
});
