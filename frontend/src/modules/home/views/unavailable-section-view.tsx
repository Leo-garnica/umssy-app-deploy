import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PublicFooter, PublicHeader } from "@/shared/components/layout";

export function UnavailableSectionView({ title }: { title: string }) {
  return <div className="flex min-h-dvh flex-col bg-surface text-ink"><PublicHeader /><main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-20"><h1 className="font-tight text-4xl font-extrabold">{title}</h1><p className="text-text-secondary">Esta sección no está incluida en este entorno de revisión. Inicia sesión con tu cuenta existente para revisar el perfil profesional, el radar y las vacantes.</p><div className="flex flex-wrap gap-3"><Link href="/login" className={buttonVariants({ variant: "institutional" })}>Iniciar sesión</Link><Link href="/" className={buttonVariants({ variant: "outline" })}>Volver al inicio</Link></div></main><PublicFooter /></div>;
}
