import { describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import HomePage from "./page";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

describe("HomePage", () => {
  it("opens the login when visiting the frontend root", () => {
    HomePage();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
