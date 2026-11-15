'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { FormFieldset } from '@/shared/components/layout/form-fieldset';
import { RequestAccessHeader } from '../components/request-steps/request-access-header';
import { PersonalDataField } from '../components/personal-data/personal-data-field';
import { DirectRegistrationSelect } from '../components/direct-registration-select';
import { CAREERS } from '../constants/careers.constants';
import { ID_CARD_ISSUED_IN } from '../constants/id-card-issued-in.constants';
import { getLatestBirthDate } from '../utils/get-latest-birth-date';
import { useDirectRegistration } from '../hooks/use-direct-registration';
import type { DirectRegistrationValues } from '../types/direct-registration.types';

export function DirectRegistrationView() {
  const { values, errors, message, isSubmitting, createdEmail, setValue, submit } = useDirectRegistration();
  function bind(field: keyof DirectRegistrationValues) {
    return {
      id: field, value: values[field], error: errors[field],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValue(field, event.target.value),
    };
  }

  return (
    <main data-app-shell="true" className="min-h-screen bg-background">
      <RequestAccessHeader appearance="onboarding" />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {createdEmail ? (
          <section aria-labelledby="registration-success" className="space-y-5 rounded-lg border border-border bg-surface p-6">
            <CheckCircle2 aria-hidden="true" className="size-10 text-accent" />
            <h1 id="registration-success" className="text-2xl font-bold text-ink">Tu cuenta está lista</h1>
            <p role="status" className="text-text-secondary">
              Ya puedes iniciar sesión con {createdEmail} y la contraseña que elegiste.
              Al entrar, el asistente te acompañará para completar tu perfil.
            </p>
            <Link href="/login?next=%2Fdashboard" className={buttonVariants()}>
              Iniciar sesión <ArrowRight aria-hidden="true" />
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl font-bold text-app-header">Solicita tu acceso a la comunidad</h1>
              <p className="text-text-secondary">Completa tus datos y elige una contraseña. Tu cuenta estará lista para iniciar sesión, sin documentos ni código de correo.</p>
            </div>
            <form noValidate onSubmit={submit} className="space-y-6 rounded-lg border border-border bg-surface p-6">
              <fieldset disabled={isSubmitting} className="min-w-0 space-y-6 border-0 p-0">
                <legend className="sr-only">Datos para crear tu cuenta</legend>
                <FormFieldset title="Identidad">
                  <div className="grid gap-5 md:grid-cols-2">
                    <PersonalDataField {...bind('firstName')} label="Nombres" isRequired autoComplete="given-name" />
                    <PersonalDataField {...bind('lastName')} label="Apellidos" isRequired autoComplete="family-name" />
                    <PersonalDataField {...bind('idCardNumber')} label="Carnet de identidad" isRequired inputMode="numeric" maxLength={10} />
                    <DirectRegistrationSelect id="idCardIssuedIn" label="Expedido" options={ID_CARD_ISSUED_IN} value={values.idCardIssuedIn} error={errors.idCardIssuedIn} onChange={value => setValue('idCardIssuedIn', value)} />
                    <PersonalDataField {...bind('sisCode')} label="Código SIS" isRequired inputMode="numeric" maxLength={9} />
                  </div>
                </FormFieldset>
                <FormFieldset title="Contacto">
                  <div className="grid gap-5 md:grid-cols-2">
                    <PersonalDataField {...bind('email')} label="Correo electrónico" type="email" isRequired autoComplete="email" help="Usarás este correo para iniciar sesión." />
                    <PersonalDataField {...bind('phone')} label="Teléfono (opcional)" type="tel" autoComplete="tel" maxLength={8} />
                  </div>
                </FormFieldset>
                <FormFieldset title="Datos complementarios">
                  <div className="grid gap-5 md:grid-cols-2">
                    <PersonalDataField {...bind('birthDate')} label="Fecha de nacimiento" isRequired type="date" max={getLatestBirthDate()} onValueChange={value => setValue('birthDate', value)} />
                    <PersonalDataField {...bind('graduationYear')} label="Año de titulación" isRequired inputMode="numeric" maxLength={4} />
                    <div className="md:col-span-2">
                      <DirectRegistrationSelect id="career" label="Carrera" options={CAREERS} value={values.career} error={errors.career} onChange={value => setValue('career', value)} />
                    </div>
                  </div>
                </FormFieldset>
                <FormFieldset title="Contraseña">
                  <div className="grid gap-5 md:grid-cols-2">
                    <PersonalDataField {...bind('password')} label="Contraseña" type="password" isRequired autoComplete="new-password" maxLength={64} help="Al menos 8 caracteres, una mayúscula y un número." />
                    <PersonalDataField {...bind('confirmPassword')} label="Confirmar contraseña" type="password" isRequired autoComplete="new-password" maxLength={64} />
                  </div>
                </FormFieldset>
              </fieldset>
              {message ? <Alert variant="destructive"><AlertDescription>{message}</AlertDescription></Alert> : null}
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <ArrowRight aria-hidden="true" />}
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
