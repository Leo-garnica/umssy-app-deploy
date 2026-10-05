"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function hasSession() {
  return Boolean(window.sessionStorage.getItem("accessToken"));
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(subscribe, hasSession, () => false);

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/login");
    }
  }, [router]);

  return authenticated ? children : <p role="status">Verificando sesión...</p>;
}
