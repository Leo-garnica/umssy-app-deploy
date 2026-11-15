import { describe, expect, it, vi, beforeEach } from 'vitest';
import { apiClient } from '@/shared/services/api-client';
import { registerDirectAccount } from './direct-registration.service';

vi.mock('@/shared/services/api-client', () => ({
  apiClient: { post: vi.fn() },
  isApiError: (error: { isAxiosError?: boolean }) => Boolean(error?.isAxiosError),
}));
const values = {
  firstName: ' Ana ', lastName: 'Pérez', idCardNumber: '7654321',
  idCardIssuedIn: 'CB', sisCode: '201904512', email: 'ana@example.com', phone: '',
  birthDate: '1999-01-01', graduationYear: '2024',
  career: 'Licenciatura en Ingeniería de Sistemas', password: 'Prueba2026', confirmPassword: 'Prueba2026',
};

describe('registerDirectAccount', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends the existing personal data and password without confirmation or an empty optional phone', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: { id: 'new-user', email: values.email } } });
    await expect(registerDirectAccount(values)).resolves.toEqual({ ok: true, email: values.email });
    const [url, payload] = vi.mocked(apiClient.post).mock.calls[0];
    expect(url).toBe('/access-requests/direct-registration');
    expect(payload).toMatchObject({ firstName: 'Ana', password: values.password, graduationYear: 2024 });
    expect(payload).not.toHaveProperty('confirmPassword');
    expect(payload).not.toHaveProperty('phone');
  });

  it('shows the duplicate-account response without claiming success', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({ isAxiosError: true, response: { status: 409, data: { detail: 'Este correo ya tiene una cuenta' } } });
    await expect(registerDirectAccount(values)).resolves.toMatchObject({ ok: false, message: 'Este correo ya tiene una cuenta' });
  });

  it('maps field errors from the backend', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({ isAxiosError: true, response: { status: 400, data: { errors: [{ field: 'password', message: 'Contraseña inválida' }] } } });
    await expect(registerDirectAccount(values)).resolves.toMatchObject({ ok: false, fieldErrors: { password: 'Contraseña inválida' } });
  });

  it('explains when QA registration is disabled', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({ isAxiosError: true, response: { status: 404 } });
    await expect(registerDirectAccount(values)).resolves.toMatchObject({ ok: false, message: expect.stringContaining('no está disponible') });
  });

  it('handles a network failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Offline'));
    await expect(registerDirectAccount(values)).resolves.toMatchObject({ ok: false, message: expect.stringContaining('conexión') });
  });
});
