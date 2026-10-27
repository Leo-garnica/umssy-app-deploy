import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { clearAccessToken, saveAccessToken } from "@/shared/services/storage/access-token-storage";
import DashboardPage from "./page";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
afterEach(() => { cleanup(); clearAccessToken(); replace.mockClear(); });

it.each([
  ["titulado", "/profile"],
  ["administrativo", "/affinity-radar/review-queue"],
  ["empresa", "/recruiters"],
])("opens the available homepage for %s", async (roleTag, destination) => {
  saveAccessToken(`h.${btoa(JSON.stringify({ roleTag }))}.s`);
  render(<DashboardPage />);
  await waitFor(() => expect(replace).toHaveBeenCalledWith(destination));
});
