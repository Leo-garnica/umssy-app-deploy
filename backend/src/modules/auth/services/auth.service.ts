import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository.js';
import { InvalidCredentialsException, RoleNotAssignedException } from '../exceptions/index.js';
import { LOGIN_ROLE_PRIORITY } from '../constants/login-role-priority.constants.js';
import type { LoginDto } from '../requests/login.schema.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmailWithRoles(dto.email);

    if (!user || !user.password || user.isActive === false) {
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }

    const assignedRoles = new Set(user.roles.map(({ role }) => role.name));
    const roles = LOGIN_ROLE_PRIORITY.filter((role) => assignedRoles.has(role));
    const roleTag = dto.roleTag ?? roles[0];
    if (!roleTag || !roles.includes(roleTag)) {
      throw new RoleNotAssignedException();
    }
    const accessToken = this.jwtService.sign({ sub: user.id, roleTag, roles });
    return { accessToken, roleTag, roles };
  }
}