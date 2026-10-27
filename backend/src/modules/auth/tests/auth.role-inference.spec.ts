import { afterEach, describe, expect, it, vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service.js';
import { InvalidCredentialsException, RoleNotAssignedException } from '../exceptions/index.js';

afterEach(() => vi.restoreAllMocks());

async function setup(assigned: string[], isActive = true) {
  const password = await bcrypt.hash('Prueba123', 4);
  const repository = { findUserByEmailWithRoles: vi.fn().mockResolvedValue({
    id: 'qa-user', password, isActive, roles: assigned.map(name => ({ role: { name } })),
  }) };
  const jwt = { sign: vi.fn().mockReturnValue('signed-token') };
  return { service: new AuthService(repository as never, jwt as never), jwt };
}

describe('login without a role selector', () => {
  it.each(['titulado', 'empresa', 'administrativo'])('infers %s from assigned roles', async roleTag => {
    const { service, jwt } = await setup([roleTag]);
    await expect(service.login({ email: 'qa@example.test', password: 'Prueba123' }))
      .resolves.toEqual({ accessToken: 'signed-token', roleTag, roles: [roleTag] });
    expect(jwt.sign).toHaveBeenCalledWith({ sub: 'qa-user', roleTag, roles: [roleTag] });
  });
  it('uses develop priority and never grants an unassigned role', async () => {
    const { service, jwt } = await setup(['titulado', 'empresa', 'administrativo']);
    const result = await service.login({ email: 'qa@example.test', password: 'Prueba123' });
    expect(result.roleTag).toBe('administrativo');
    expect(jwt.sign).toHaveBeenCalledWith({ sub: 'qa-user', roleTag: 'administrativo', roles: ['administrativo', 'empresa', 'titulado'] });
  });
  it('denies inactive accounts', async () => {
    const { service, jwt } = await setup(['titulado'], false);
    await expect(service.login({ email: 'qa@example.test', password: 'Prueba123' })).rejects.toBeInstanceOf(InvalidCredentialsException);
    expect(jwt.sign).not.toHaveBeenCalled();
  });
  it('denies accounts without enabled roles', async () => {
    const { service, jwt } = await setup([]);
    await expect(service.login({ email: 'qa@example.test', password: 'Prueba123' })).rejects.toBeInstanceOf(RoleNotAssignedException);
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
