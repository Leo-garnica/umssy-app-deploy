import { apiClient, isApiError } from '@/shared/services/api-client';
import { buildAccessRequestPayload } from '../utils/build-access-request-payload';
import type { DirectRegistrationErrors, DirectRegistrationResult, DirectRegistrationValues } from '../types/direct-registration.types';

type RegistrationResponse = { data: { id: string; email: string } };
type RegistrationError = { detail?: string; errors?: { field: string; message: string }[] };

export async function registerDirectAccount(values: DirectRegistrationValues): Promise<DirectRegistrationResult> {
  try {
    const response = await apiClient.post<RegistrationResponse>('/access-requests/direct-registration', {
      ...buildAccessRequestPayload(values, 'create'),
      password: values.password,
    });
    return { ok: true, email: response.data.data.email };
  } catch (error) {
    const fieldErrors: DirectRegistrationErrors = {};
    if (isApiError<RegistrationError>(error)) {
      for (const issue of error.response?.data?.errors ?? []) {
        if (issue.field in values)
          fieldErrors[issue.field as keyof DirectRegistrationErrors] = issue.message;
      }
      if (error.response?.status === 404)
        return { ok: false, fieldErrors, message: 'El registro directo no está disponible en este momento. Inténtalo más tarde.' };
      return {
        ok: false, fieldErrors,
        message: error.response?.data?.detail ?? 'No se pudo crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.',
      };
    }
    return { ok: false, fieldErrors, message: 'No se pudo crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.' };
  }
}
