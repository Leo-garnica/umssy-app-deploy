import type { DirectRegistrationErrors, DirectRegistrationValues } from '../types/direct-registration.types';
import { validatePersonalData } from './validate-personal-data';

export function validateDirectRegistration(values: DirectRegistrationValues): DirectRegistrationErrors {
  const errors: DirectRegistrationErrors = validatePersonalData(values);
  if (values.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
  else if (values.password.length > 64 || new TextEncoder().encode(values.password).length > 72)
    errors.password = 'La contraseña es demasiado larga; utiliza menos caracteres';
  else if (!/[A-Z]/.test(values.password)) errors.password = 'La contraseña debe incluir una letra mayúscula';
  else if (!/\d/.test(values.password)) errors.password = 'La contraseña debe incluir un número';
  if (values.confirmPassword !== values.password || !values.confirmPassword)
    errors.confirmPassword = 'Las contraseñas deben coincidir';
  return errors;
}
