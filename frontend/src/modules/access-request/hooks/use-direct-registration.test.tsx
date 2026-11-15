import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDirectRegistration } from './use-direct-registration';
import { registerDirectAccount } from '../services/direct-registration.service';
import type { DirectRegistrationValues } from '../types/direct-registration.types';

vi.mock('../services/direct-registration.service', () => ({ registerDirectAccount: vi.fn() }));
const values: DirectRegistrationValues = {
  firstName: 'Ana', lastName: 'Pérez', idCardNumber: '7654321',
  idCardIssuedIn: 'CB', sisCode: '201904512', email: 'ana@example.com', phone: '',
  birthDate: '1999-01-01', graduationYear: '2024',
  career: 'Licenciatura en Ingeniería de Sistemas',
  password: 'Prueba2026', confirmPassword: 'Prueba2026',
};
const event = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

describe('useDirectRegistration', () => {
  afterEach(() => vi.clearAllMocks());

  function fill(result: ReturnType<typeof renderHook<ReturnType<typeof useDirectRegistration>, unknown>>['result']) {
    act(() => {
      for (const field of Object.keys(values) as (keyof DirectRegistrationValues)[]) result.current.setValue(field, values[field]);
    });
  }

  it('validates the complete form before contacting the API', async () => {
    const { result } = renderHook(() => useDirectRegistration());
    await act(async () => { await result.current.submit(event()); });
    expect(result.current.errors.email).toBeDefined();
    expect(result.current.errors.password).toBeDefined();
    expect(registerDirectAccount).not.toHaveBeenCalled();
  });

  it('requires matching passwords', async () => {
    const { result } = renderHook(() => useDirectRegistration());
    fill(result);
    act(() => result.current.setValue('confirmPassword', 'Other2026'));
    await act(async () => { await result.current.submit(event()); });
    expect(result.current.errors.confirmPassword).toBe('Las contraseñas deben coincidir');
    expect(registerDirectAccount).not.toHaveBeenCalled();
  });

  it('prevents duplicate submission and clears credentials after success', async () => {
    let resolve!: (value: Awaited<ReturnType<typeof registerDirectAccount>>) => void;
    vi.mocked(registerDirectAccount).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    const { result } = renderHook(() => useDirectRegistration());
    fill(result);
    let pending!: Promise<void>;
    act(() => { pending = result.current.submit(event()); });
    await act(async () => { await result.current.submit(event()); });
    expect(registerDirectAccount).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(true);
    await act(async () => { resolve({ ok: true, email: values.email }); await pending; });
    expect(result.current.createdEmail).toBe(values.email);
    expect(result.current.values.password).toBe('');
    expect(result.current.values.confirmPassword).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('keeps the entered data after failure and allows a corrected retry', async () => {
    vi.mocked(registerDirectAccount).mockResolvedValueOnce({ ok: false, message: 'Correo duplicado', fieldErrors: { email: 'Ya existe' } });
    const { result } = renderHook(() => useDirectRegistration());
    fill(result);
    await act(async () => { await result.current.submit(event()); });
    expect(result.current.values.email).toBe(values.email);
    expect(result.current.message).toBe('Correo duplicado');
    expect(result.current.errors.email).toBe('Ya existe');
    act(() => result.current.setValue('email', 'new@example.com'));
    expect(result.current.errors.email).toBeUndefined();
    vi.mocked(registerDirectAccount).mockResolvedValueOnce({ ok: true, email: 'new@example.com' });
    await act(async () => { await result.current.submit(event()); });
    await waitFor(() => expect(result.current.createdEmail).toBe('new@example.com'));
  });
});
