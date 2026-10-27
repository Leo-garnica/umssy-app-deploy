"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { getSessionRoles } from "@/modules/auth/utils/get-session-roles";
import { getAccessToken, subscribeAccessToken } from "@/shared/services/storage/access-token-storage";
import type { AuthContextValue } from "@/shared/types/auth-context-value.types";
import type { AuthProviderProps } from "@/shared/types/auth-provider-props.types";

const AuthContext = createContext<AuthContextValue | null>(null);
const getServerToken = () => null;
const refreshRoles = async () => {};

// This deploy has no session endpoint, so the roles come from the token issued at login.
function useTokenRoles(): AuthContextValue {
  const accessToken = useSyncExternalStore(subscribeAccessToken, getAccessToken, getServerToken);
  return useMemo(
    () => ({ roles: getSessionRoles(accessToken), isLoading: false, refreshRoles }),
    [accessToken],
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useTokenRoles();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  const tokenRoles = useTokenRoles();
  return context ?? tokenRoles;
}
