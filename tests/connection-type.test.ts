import { describe, expect, mock, test } from "bun:test";
import { getConnectionType } from "../src/connection-type";

describe("getConnectionType", () => {
  const originalNavigator = globalThis.navigator;

  test("returns unknown when navigator.connection is not available", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
    });
    expect(getConnectionType()).toBe("unknown");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns wifi when connection.type is wifi", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { type: "wifi" } },
      writable: true,
    });
    expect(getConnectionType()).toBe("wifi");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns cellular for 4g", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { type: "4g" } },
      writable: true,
    });
    expect(getConnectionType()).toBe("cellular");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns ethernet when connection.type is ethernet", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { type: "ethernet" } },
      writable: true,
    });
    expect(getConnectionType()).toBe("ethernet");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });
});
