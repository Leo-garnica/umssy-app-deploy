import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
vi.mock("@/modules/home", () => ({ HomeView: () => <main>Comunidad UMSSY</main> }));
describe("HomePage", () => { it("shows the public home from develop", () => {
  render(<HomePage />); expect(screen.getByRole("main")).toHaveTextContent("Comunidad UMSSY");
}); });
