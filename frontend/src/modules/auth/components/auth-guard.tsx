"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, subscribeAccessToken } from "@/shared/services/storage/access-token-storage";

function hasSession() {
  return Boolean(getAccessToken());
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(subscribeAccessToken, hasSession, () => false);

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  return authenticated ? children : <p role="status">Verificando sesión...</p>;
}
