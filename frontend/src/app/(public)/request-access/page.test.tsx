import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RequestAccessPage, { metadata } from "./page";

// El encabezado usa useRouter, que necesita el App Router montado
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("RequestAccessPage", () => {
  afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

  it("renderiza la vista de solicitud de acceso", () => {
    render(<RequestAccessPage />);

    expect(screen.getByRole("heading", { name: "Solicita tu acceso a la comunidad" })).toBeInTheDocument();
  });

  it("define el título de la página", () => {
    expect(metadata.title).toBe("Solicitud de acceso");
  });
});

describe("QA direct registration routing", () => {
  afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

  it("shows account creation only with both QA flags enabled", () => {
    vi.stubEnv("UMSSY_DEPLOYMENT_ENV", "qa");
    vi.stubEnv("ENABLE_DIRECT_REGISTRATION", "true");
    render(<RequestAccessPage />);
    expect(screen.getByRole("button", { name: "Crear cuenta" })).toBeVisible();
    expect(screen.getByLabelText(/^Confirmar contraseña/)).toBeVisible();
    expect(screen.queryByText("Documento académico")).not.toBeInTheDocument();
  });

  it("keeps the institutional flow outside QA even when the switch is enabled", () => {
    vi.stubEnv("UMSSY_DEPLOYMENT_ENV", "production");
    vi.stubEnv("ENABLE_DIRECT_REGISTRATION", "true");
    render(<RequestAccessPage />);
    expect(screen.queryByRole("button", { name: "Crear cuenta" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continuar/ })).toBeVisible();
  });
});
