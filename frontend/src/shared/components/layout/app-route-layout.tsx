"use client";
import type { AppRouteLayoutProps } from "@/shared/types/app-route-layout-props.types";
import { usePathname } from "next/navigation";
import { SessionGate } from "@/modules/auth";
import { getRouteRoles } from "@/shared/utils/get-route-roles";
import { RoleGate } from "./role-gate";
import { AppShell } from "./app-shell";
export function AppRouteLayout({ children }: AppRouteLayoutProps) {
  const pathname = usePathname();
  return <SessionGate><AppShell><RoleGate allowedRoles={getRouteRoles(pathname ?? "")}>{children}</RoleGate></AppShell></SessionGate>;
}
