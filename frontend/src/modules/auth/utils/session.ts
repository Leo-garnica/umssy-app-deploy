import { ACCESS_TOKEN_STORAGE_KEY } from "@/modules/profile/config/auth-storage.config";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function subscribeToSession(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function endSession(): void {
  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
