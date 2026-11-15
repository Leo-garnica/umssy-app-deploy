import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import {
  directRegistrationSchema,
  type DirectRegistrationDto,
} from '../requests/direct-registration.schema.js';
import { DirectRegistrationService } from '../services/direct-registration.service.js';

@Controller('access-requests/direct-registration')
export class DirectRegistrationController {
  constructor(private readonly registration: DirectRegistrationService) {}

  @Post()
  register(
    @Body(new ZodValidationPipe(directRegistrationSchema))
    body: DirectRegistrationDto,
  ) {
    return this.registration.register(body);
  }
}
