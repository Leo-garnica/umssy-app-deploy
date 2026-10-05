import type { ReactNode } from "react";
import { AppShell } from "@/shared/components/layout";
import { AuthGuard } from "@/modules/auth/components/auth-guard";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><AppShell>{children}</AppShell></AuthGuard>;
}
