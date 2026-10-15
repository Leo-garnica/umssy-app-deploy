import { afterEach, describe, expect, it, vi } from "vitest";
import { endSession, getAccessToken, subscribeToSession } from "./session";

afterEach(() => {
  sessionStorage.clear();
});

describe("session", () => {
  it("reads the stored access token", () => {
    expect(getAccessToken()).toBeNull();
    sessionStorage.setItem("accessToken", "token");
    expect(getAccessToken()).toBe("token");
  });

  it("removes the access token when the session ends", () => {
    sessionStorage.setItem("accessToken", "token");
    endSession();
    expect(getAccessToken()).toBeNull();
  });

  it("notifies storage changes until the subscription is cancelled", () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeToSession(onChange);
    window.dispatchEvent(new Event("storage"));
    expect(onChange).toHaveBeenCalledOnce();
    unsubscribe();
    window.dispatchEvent(new Event("storage"));
    expect(onChange).toHaveBeenCalledOnce();
  });
});
