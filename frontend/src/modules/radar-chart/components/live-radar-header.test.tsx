import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProfile } from "@/modules/profile/hooks/use-profile";
import { useProfilePhoto } from "@/modules/profile/hooks/use-profile-photo";
import { mapEpic2Radar } from "../sprint2/radar-mapper";
import type { RadarBridgeView } from "../sprint2/types";
import { LiveRadarHeader } from "./live-radar-header";

vi.mock("@/modules/profile/hooks/use-profile", () => ({ useProfile: vi.fn() }));
vi.mock("@/modules/profile/hooks/use-profile-photo", () => ({ useProfilePhoto: vi.fn() }));
function radar(overrides: Partial<RadarBridgeView> = {}): RadarBridgeView {
  return { ...mapEpic2Radar({ userId: "owner", status: "ready", version: 2, updatedAt: null, dictionaryVersion: "1", skills: [] }), ...overrides };
}
beforeEach(() => {
  vi.mocked(useProfile).mockReturnValue({ profile: null } as ReturnType<typeof useProfile>);
  vi.mocked(useProfilePhoto).mockReturnValue({ photoUrl: null } as ReturnType<typeof useProfilePhoto>);
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("live radar identity and processing state", () => {
  it("shows a neutral identity and unavailable date before the profile loads", () => {
    render(<LiveRadarHeader radar={radar()} />);
    expect(screen.getByRole("heading", { name: "Mi perfil profesional" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Mi perfil profesional" })).toHaveTextContent("MP");
    expect(screen.getByText(/Última actualización: Sin actualización/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Sin evidencias aprobadas");
  });
  it("renders the signed-in user's name, headline and actual photo", () => {
    vi.mocked(useProfile).mockReturnValue({ profile: { firstName: "Ana", lastName: "Pérez", headline: "Ingeniera QA" } } as ReturnType<typeof useProfile>);
    vi.mocked(useProfilePhoto).mockReturnValue({ photoUrl: "/photo-qa.png" } as ReturnType<typeof useProfilePhoto>);
    render(<LiveRadarHeader radar={radar({ updatedAt: "2026-10-27T12:00:00Z" })} />);
    expect(screen.getByRole("heading", { name: "Ana Pérez" })).toBeInTheDocument();
    expect(screen.getByText("Ingeniera QA")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ana Pérez" })).toHaveAttribute("src", "/photo-qa.png");
    expect(screen.getByText(/Última actualización:/)).toHaveTextContent("2026");
  });
  it("uses initials and a neutral headline when the user has no photo or headline", () => {
    vi.mocked(useProfile).mockReturnValue({ profile: { firstName: "Ana", lastName: "", headline: null } } as ReturnType<typeof useProfile>);
    render(<LiveRadarHeader radar={radar()} />);
    expect(screen.getByRole("img", { name: "Ana" })).toHaveTextContent("A");
    expect(screen.getByText("Competencias y evidencias de tu perfil")).toBeInTheDocument();
  });
  it.each<[Partial<RadarBridgeView>, string]>([
    [{ status: "pending", processingStatus: "pending" }, "Actualización en curso"],
    [{ status: "pending", processingStatus: "ready" }, "Pendiente de revisión"],
    [{ status: "error", processingStatus: "error" }, "Análisis con error"],
  ])("distinguishes processing and review outcomes %j", (state, label) => {
    render(<LiveRadarHeader radar={radar(state)} />);
    expect(screen.getByRole("status")).toHaveTextContent(label);
  });
  it("labels a published radar and lists the actual approved skills", () => {
    const data = mapEpic2Radar({ userId: "owner", status: "ready", version: 3, updatedAt: null, dictionaryVersion: "1", skills: [{ id: "python", text: "Python", name: "Python", source: "manual", areaId: "data-ai", verificationStatus: "approved", isHighRelevance: false, evidenceRefs: [] }] });
    render(<LiveRadarHeader radar={data} />);
    expect(screen.getByRole("status")).toHaveTextContent("Publicado");
    expect(screen.getByRole("list", { name: "Tecnologías" })).toHaveTextContent("Python");
  });
});
