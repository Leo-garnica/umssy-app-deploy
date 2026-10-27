import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { clearAccessToken, saveAccessToken } from "@/shared/services/storage/access-token-storage";
import { AuthProvider, useAuth } from "./auth-context";

function createToken(payload: unknown) {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

function RolesProbe() {
  const { roles, isLoading } = useAuth();
  return <p>{isLoading ? "loading" : roles.join(",") || "no roles"}</p>;
}

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe("AuthProvider", () => {
  it("reads the roles from the stored access token", () => {
    saveAccessToken(createToken({ roleTag: "titulado" }));

    render(<AuthProvider><RolesProbe /></AuthProvider>);

    expect(screen.getByText("titulado")).toBeInTheDocument();
  });

  it("updates the roles when the session starts or ends", () => {
    render(<AuthProvider><RolesProbe /></AuthProvider>);
    expect(screen.getByText("no roles")).toBeInTheDocument();

    act(() => {
      saveAccessToken(createToken({ roles: ["mentor", "titulado"] }));
    });
    expect(screen.getByText("titulado,mentor")).toBeInTheDocument();

    act(() => {
      clearAccessToken();
    });
    expect(screen.getByText("no roles")).toBeInTheDocument();
  });

  it("falls back to the token roles without a provider", () => {
    saveAccessToken(createToken({ roleTag: "mentor" }));

    const { result } = renderHook(() => useAuth());

    expect(result.current.roles).toEqual(["mentor"]);
    expect(result.current.isLoading).toBe(false);
  });
});
