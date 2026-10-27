import { clearAccessToken } from "@/shared/services/storage/access-token-storage";

export function endSession(): void {
  clearAccessToken();
}
