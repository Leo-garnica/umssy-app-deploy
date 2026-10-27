"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/shared/components/layout";
import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { RoleGate } from "@/shared/components/layout/role-gate";
import { getRouteRoles } from "@/shared/utils/get-route-roles";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <AuthGuard><AppShell><RoleGate allowedRoles={getRouteRoles(pathname ?? "")}>{children}</RoleGate></AppShell></AuthGuard>;
}
