import axios from "axios";
import { ENV_CONFIG } from "@/shared/config/env.config";

export const apiClient = axios.create({
  baseURL: ENV_CONFIG.apiUrl,
  timeout: 20_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined" &&
        window.location.pathname.startsWith("/profile")) {
      window.sessionStorage.removeItem("accessToken");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);
