"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionRoles } from "@/modules/auth/utils/get-session-roles";
import { getHomePath } from "@/modules/auth/utils/get-home-path";
import { getAccessToken } from "@/shared/services/storage/access-token-storage";

// The shared brand opens the available workspace for the authenticated role.
export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => { router.replace(getHomePath(getSessionRoles(getAccessToken()))); }, [router]);
  return <p role="status">Abriendo tu espacio...</p>;
}
