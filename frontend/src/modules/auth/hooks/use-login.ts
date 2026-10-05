"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { authService } from "../services/auth.service";
import type { LoginPayload, LoginResponse } from "../types/auth-types";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(payload: LoginPayload): Promise<LoginResponse | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.login(payload);
    } catch (cause) {
      if (isAxiosError(cause) && cause.response?.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else if (isAxiosError(cause) && cause.response?.status === 403) {
        setError("El rol elegido no corresponde a tu cuenta.");
      } else if (isAxiosError(cause) && cause.response?.status === 400) {
        setError("Revisa el correo, la contraseña y el rol seleccionados.");
      } else {
        setError("No se pudo conectar con el servidor. Intenta nuevamente en unos momentos.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
