import type { Metadata } from "next";
import { DirectRegistrationView, RequestAccessView } from "@/modules/access-request";

export const metadata: Metadata = { title: "Solicitud de acceso" };

export default function RequestAccessPage() {
  const directRegistration = process.env.UMSSY_DEPLOYMENT_ENV === "qa" &&
    process.env.ENABLE_DIRECT_REGISTRATION === "true";
  return directRegistration ? <DirectRegistrationView /> : <RequestAccessView />;
}
