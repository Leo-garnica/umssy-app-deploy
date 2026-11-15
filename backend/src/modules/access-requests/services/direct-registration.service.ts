import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DirectRegistrationRepository } from '../repositories/direct-registration.repository.js';
import type { DirectRegistrationDto } from '../requests/direct-registration.schema.js';

@Injectable()
export class DirectRegistrationService {
  constructor(
    private readonly config: ConfigService,
    private readonly repository: DirectRegistrationRepository,
  ) {}

  async register(input: DirectRegistrationDto) {
    if (
      this.config.get<string>('UMSSY_DEPLOYMENT_ENV') !== 'qa' ||
      this.config.get<string>('ENABLE_DIRECT_REGISTRATION') !== 'true'
    ) {
      throw new NotFoundException();
    }
    const { password, ...data } = input;
    await this.repository.ensureEmailAvailable(data.email);
    const passwordHash = await bcrypt.hash(password, 10);
    return this.repository.create(data, passwordHash);
  }
}
