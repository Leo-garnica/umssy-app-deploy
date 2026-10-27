import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearAccessToken, saveAccessToken } from "@/shared/services/storage/access-token-storage";
import AppLayout from "./layout";

const route = vi.hoisted(() => ({ pathname: "/profile" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname, useRouter: () => ({ replace: vi.fn() }) }));

vi.mock("@/modules/auth/components/session-gate", () => ({
  SessionGate: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/shared/components/layout/app-shell", () => ({
  AppShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

describe("AppLayout", () => {
  beforeEach(() => {
    route.pathname = "/profile";
    saveAccessToken(`h.${btoa(JSON.stringify({ roleTag: "titulado" }))}.s`);
  });
  afterEach(() => {
    cleanup();
    clearAccessToken();
  });

  it("wraps every authenticated page with the app shell", () => {
    render(
      <AppLayout>
        <p>page-content</p>
      </AppLayout>,
    );

    expect(screen.getByTestId("app-shell")).toContainElement(screen.getByText("page-content"));
  });

  it("keeps the shared shell while denying an unauthorized private route", () => {
    route.pathname = "/affinity-radar/review-queue";
    render(<AppLayout><p>private-review-content</p></AppLayout>);
    expect(screen.getByTestId("app-shell")).toContainElement(screen.getByRole("alert"));
    expect(screen.queryByText("private-review-content")).not.toBeInTheDocument();
  });
});
