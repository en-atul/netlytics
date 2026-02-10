import { describe, expect, test } from "bun:test";
import { getConnectionType, getNetworkQuality } from "../src/connection-type";

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

  test("returns cellular when connection.type is cellular", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { type: "cellular" } },
      writable: true,
    });
    expect(getConnectionType()).toBe("cellular");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns unknown when only effectiveType is 4g (desktop speed hint)", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { effectiveType: "4g" } },
      writable: true,
    });
    expect(getConnectionType()).toBe("unknown");
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

describe("getNetworkQuality", () => {
  const originalNavigator = globalThis.navigator;

  test("returns unknown when navigator.connection is not available", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
    });
    expect(getNetworkQuality()).toBe("unknown");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns slow-2g when effectiveType is slow-2g", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { effectiveType: "slow-2g" } },
      writable: true,
    });
    expect(getNetworkQuality()).toBe("slow-2g");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns 2g when effectiveType is 2g", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { effectiveType: "2g" } },
      writable: true,
    });
    expect(getNetworkQuality()).toBe("2g");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns 3g when effectiveType is 3g", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { effectiveType: "3g" } },
      writable: true,
    });
    expect(getNetworkQuality()).toBe("3g");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns 4g when effectiveType is 4g", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { effectiveType: "4g" } },
      writable: true,
    });
    expect(getNetworkQuality()).toBe("4g");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns unknown when effectiveType is missing", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: {} },
      writable: true,
    });
    expect(getNetworkQuality()).toBe("unknown");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });

  test("returns unknown when effectiveType is unrecognized", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { connection: { effectiveType: "5g" } },
      writable: true,
    });
    expect(getNetworkQuality()).toBe("unknown");
    Object.defineProperty(globalThis, "navigator", { value: originalNavigator, writable: true });
  });
});
