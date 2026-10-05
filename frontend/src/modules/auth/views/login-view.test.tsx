import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { LoginView } from "./login-view";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
  replace.mockClear();
});

function submitLogin() {
  render(<LoginView />);
  fireEvent.change(screen.getByPlaceholderText("nombre@ejemplo.com"), {
    target: { value: "prueba@umss.edu.bo" },
  });
  fireEvent.change(screen.getByPlaceholderText("********"), {
    target: { value: "Prueba123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("LoginView", () => {
  it("stores the token and opens the profile after successful authentication", async () => {
    const post = vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      data: { accessToken: "test-token", roleTag: "titulado" },
    });
    submitLogin();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profile"));
    expect(sessionStorage.getItem("accessToken")).toBe("test-token");
    expect(post).toHaveBeenCalledWith("/auth/login", {
      email: "prueba@umss.edu.bo", password: "Prueba123", roleTag: "titulado",
    });
  });

  it.each([
    [{ isAxiosError: true, response: { status: 401 } }, "Correo o contraseña incorrectos."],
    [{ isAxiosError: true, code: "ECONNABORTED" },
      "No se pudo conectar con el servidor. Intenta nuevamente en unos momentos."],
  ])("shows an actionable error and allows retrying", async (error, message) => {
    vi.spyOn(apiClient, "post").mockRejectedValueOnce(error);
    submitLogin();
    expect(await screen.findByText(message)).toBeDefined();
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeEnabled();
    expect(replace).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("accessToken")).toBeNull();
  });
});
