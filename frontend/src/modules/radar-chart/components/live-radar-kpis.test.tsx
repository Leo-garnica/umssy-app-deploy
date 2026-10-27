import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { mapEpic2Radar } from "../sprint2/radar-mapper";
import { LiveRadarKpis } from "./live-radar-kpis";

afterEach(cleanup);
const data = mapEpic2Radar({ userId: "owner", status: "ready", version: 2, updatedAt: null, dictionaryVersion: "1", skills: [
  { id: "python", name: "Python", text: "Python", source: "nlp", areaId: "data-ai", verificationStatus: "approved", isHighRelevance: true, evidenceRefs: [] },
  { id: "docker", name: "Docker", text: "Docker", source: "nlp", areaId: "cloud-devops", verificationStatus: "pending", isHighRelevance: false, evidenceRefs: [] },
] });
it("keeps an unavailable previous value distinct from a zero variation", () => {
  const { rerender } = render(<LiveRadarKpis radar={data} variation={null} />);
  expect(screen.getByText("Variación anterior no disponible")).toBeInTheDocument();
  rerender(<LiveRadarKpis radar={data} variation={0} />);
  expect(screen.queryByText("Variación anterior no disponible")).toBeNull();
  expect(screen.getByText(/vs. anterior/)).toHaveTextContent("0,0 vs. anterior");
});
it.each([[0.5, /\+/], [-0.5, /[-−]/]] as const)("shows the direction of variation %s", (variation, sign) => {
  render(<LiveRadarKpis radar={data} variation={variation} />);
  expect(screen.getByText(/vs. anterior/)).toHaveTextContent(sign);
});
it("counts only approved skills and scored axes while keeping pending skills separate", () => {
  render(<LiveRadarKpis radar={data} variation={null} />);
  const cards = within(screen.getByRole("list", { name: "Resumen del perfil" })).getAllByRole("listitem");
  expect(cards).toHaveLength(4);
  expect(cards[1]).toHaveTextContent("1 / 6");
  expect(cards[2]).toHaveTextContent("1Habilidades aprobadas");
  expect(cards[3]).toHaveTextContent("1Habilidades pendientes");
});
