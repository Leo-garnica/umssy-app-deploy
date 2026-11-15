import type { PersonalDataValues } from './personal-data-values.types';
import type { FieldErrors } from './field-errors.types';

export type DirectRegistrationValues = PersonalDataValues & {
  password: string;
  confirmPassword: string;
};

export type DirectRegistrationErrors = FieldErrors & {
  password?: string;
  confirmPassword?: string;
};

export type DirectRegistrationResult =
  | { ok: true; email: string }
  | { ok: false; message: string; fieldErrors: DirectRegistrationErrors };
