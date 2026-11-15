import { z } from 'zod';
import { createAccessRequestSchema } from './create-access-request.schema.js';
import { activateAccountSchema } from './activation.schema.js';

export const directRegistrationSchema = createAccessRequestSchema.safeExtend({
  password: activateAccountSchema.shape.password.refine(
    (value) => Buffer.byteLength(value, 'utf8') <= 72,
    'La contraseña es demasiado larga; utiliza menos caracteres',
  ),
});

export type DirectRegistrationDto = z.infer<typeof directRegistrationSchema>;
