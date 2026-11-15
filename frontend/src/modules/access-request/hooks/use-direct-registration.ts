'use client';

import { useRef, useState, type FormEvent } from 'react';
import { EMPTY_VALUES } from '../constants/access-request-defaults.constants';
import { registerDirectAccount } from '../services/direct-registration.service';
import { validateDirectRegistration } from '../utils/validate-direct-registration';
import type { DirectRegistrationErrors, DirectRegistrationValues } from '../types/direct-registration.types';

export function useDirectRegistration() {
  const [values, setValues] = useState<DirectRegistrationValues>({ ...EMPTY_VALUES, password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<DirectRegistrationErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const submitting = useRef(false);

  function setValue(field: keyof DirectRegistrationValues, value: string) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || createdEmail) return;
    const nextErrors = validateDirectRegistration(values);
    setErrors(nextErrors);
    setMessage(null);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      const result = await registerDirectAccount(values);
      if (result.ok) {
        setCreatedEmail(result.email);
        setValues({ ...EMPTY_VALUES, password: '', confirmPassword: '' });
      } else {
        setErrors(result.fieldErrors);
        setMessage(result.message);
      }
    } catch {
      setMessage('No se pudo crear tu cuenta. Inténtalo de nuevo.');
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return { values, errors, message, isSubmitting, createdEmail, setValue, submit };
}
