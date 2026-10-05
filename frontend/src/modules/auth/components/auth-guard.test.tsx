import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthGuard } from "./auth-guard";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe("AuthGuard", () => {
  it("redirects visitors without a session and hides the private view", async () => {
    render(<AuthGuard><p>Private profile</p></AuthGuard>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("Private profile")).toBeNull();
  });

  it("shows the private view when a session exists", async () => {
    sessionStorage.setItem("accessToken", "test-token");
    render(<AuthGuard><p>Private profile</p></AuthGuard>);
    expect(await screen.findByText("Private profile")).toBeDefined();
    expect(replace).not.toHaveBeenCalled();
  });
});
