import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubMatchMedia } from "@/shared/testing/stub-match-media";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
  useRouter: () => ({ replace: vi.fn() }),
}));
vi.mock("@/modules/profile/services/profile.service", () => ({
  profileService: {
    getProfile: vi.fn().mockResolvedValue({ firstName: "Valeria", lastName: "Quispe" }),
  },
}));

describe("AppShell", () => {
  beforeEach(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("shows the signed-in user in the sidebar footer", async () => {
    sessionStorage.setItem("accessToken", `h.${btoa(JSON.stringify({ roleTag: "titulado" }))}.s`);
    render(
      <AppShell>
        <p>Contenido de la página</p>
      </AppShell>,
    );

    expect(await screen.findByText("Valeria Quispe")).toBeDefined();
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeDefined();
  });

  it("does not show a user card without a session", () => {
    render(
      <AppShell>
        <p>Contenido de la página</p>
      </AppShell>,
    );

    expect(screen.queryByRole("button", { name: "Cerrar sesión" })).toBeNull();
  });

  it("renders the sidebar next to the page content", () => {
    render(
      <AppShell>
        <p>Contenido de la página</p>
      </AppShell>,
    );

    expect(screen.getByText("UMSSY")).toBeDefined();
    expect(screen.getByText("Contenido de la página")).toBeDefined();
  });

  it("closes and opens the sidebar with the menu button", () => {
    render(
      <AppShell>
        <p>Contenido de la página</p>
      </AppShell>,
    );

    const sidebar = document.querySelector('[data-slot="sidebar"]');
    const closeButton = screen.getByRole("button", { name: "Cerrar menú" });
    expect(closeButton.getAttribute("aria-expanded")).toBe("true");
    expect(sidebar?.getAttribute("data-state")).toBe("expanded");

    fireEvent.click(closeButton);
    const openButton = screen.getByRole("button", { name: "Abrir menú" });
    expect(openButton.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar?.getAttribute("data-state")).toBe("collapsed");

    fireEvent.click(openButton);
    expect(screen.getByRole("button", { name: "Cerrar menú" })).toBeDefined();
    expect(sidebar?.getAttribute("data-state")).toBe("expanded");
  });
});
