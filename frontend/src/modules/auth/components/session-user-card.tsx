"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileService } from "@/modules/profile/services/profile.service";
import { SidebarUserCard } from "@/shared/components/layout/sidebar-user-card";
import { getSessionRoleLabel } from "../utils/get-session-role-label";
import { endSession, getAccessToken, subscribeToSession } from "../utils/session";

type ProfileName = { status: "loading" } | { status: "failed" } | { status: "loaded"; fullName: string };

function SessionUserCardContent({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState<ProfileName>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    async function loadName() {
      try {
        const profile = await profileService.getProfile();
        const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
        if (isActive) setName(fullName ? { status: "loaded", fullName } : { status: "failed" });
      } catch {
        if (isActive) setName((current) => (current.status === "loaded" ? current : { status: "failed" }));
      }
    }

    void loadName();
    return () => {
      isActive = false;
    };
  }, [pathname]);

  function handleLogout() {
    endSession();
    router.replace("/login");
  }

  const fullName =
    name.status === "loaded" ? name.fullName : name.status === "loading" ? "Cargando usuario…" : "Usuario";

  return (
    <SidebarUserCard
      user={{ fullName, role: getSessionRoleLabel(accessToken) }}
      action={(
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          onClick={handleLogout}
          className="shrink-0 text-surface/80 hover:bg-surface/10 hover:text-surface"
        >
          <LogOut strokeWidth={1.75} aria-hidden="true" />
        </Button>
      )}
    />
  );
}

export function SessionUserCard() {
  const accessToken = useSyncExternalStore(subscribeToSession, getAccessToken, () => null);
  return accessToken ? <SessionUserCardContent accessToken={accessToken} /> : null;
}
