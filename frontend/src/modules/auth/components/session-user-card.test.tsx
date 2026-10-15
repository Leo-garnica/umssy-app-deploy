import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { profileService } from "@/modules/profile/services/profile.service";
import { SessionUserCard } from "./session-user-card";

vi.mock("@/modules/profile/services/profile.service", () => ({ profileService: { getProfile: vi.fn() } }));
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/profile",
}));

function createToken(payload: unknown) {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

function mockProfile(firstName: string, lastName: string) {
  vi.mocked(profileService.getProfile).mockResolvedValue({ firstName, lastName } as Awaited<
    ReturnType<typeof profileService.getProfile>
  >);
}

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.resetAllMocks();
});

describe("SessionUserCard", () => {
  it("shows the full name and the role of the authenticated user", async () => {
    sessionStorage.setItem("accessToken", createToken({ roleTag: "titulado" }));
    mockProfile("Usuario", "De Prueba");

    render(<SessionUserCard />);

    expect(screen.getByText("Cargando usuario…")).toBeInTheDocument();
    expect(await screen.findByText("Usuario De Prueba")).toBeInTheDocument();
    expect(screen.getByText("Titulado")).toBeInTheDocument();
  });

  it("keeps a visible fallback when the profile request fails", async () => {
    sessionStorage.setItem("accessToken", "invalid-token");
    vi.mocked(profileService.getProfile).mockRejectedValue(new Error("Unavailable"));

    render(<SessionUserCard />);

    await waitFor(() => expect(screen.getByText("Usuario")).toBeInTheDocument());
    expect(screen.getByText("Usuario autenticado")).toBeInTheDocument();
  });

  it("ends the session and redirects to the login page", async () => {
    sessionStorage.setItem("accessToken", createToken({ roleTag: "titulado" }));
    mockProfile("Usuario", "De Prueba");
    render(<SessionUserCard />);
    await screen.findByText("Usuario De Prueba");

    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(sessionStorage.getItem("accessToken")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("renders nothing and does not request the profile without a session", () => {
    const { container } = render(<SessionUserCard />);

    expect(container).toBeEmptyDOMElement();
    expect(profileService.getProfile).not.toHaveBeenCalled();
  });
});
