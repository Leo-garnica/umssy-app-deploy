import { afterEach, describe, expect, it } from "vitest";
import { endSession } from "./session";

afterEach(() => {
  sessionStorage.clear();
});

describe("endSession", () => {
  it("removes the stored access token", () => {
    sessionStorage.setItem("accessToken", "token");

    endSession();

    expect(sessionStorage.getItem("accessToken")).toBeNull();
  });
});
