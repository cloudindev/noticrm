import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export const metadata = {
  title: "Onboarding - NotiCRM",
};

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // NextAuth token has tenantSlug injected if user belongs to a tenant
  const tenantSlug = (session.user as any).tenantSlug;
  
  if (tenantSlug) {
    redirect(`/${tenantSlug}/home`);
  }

  return <OnboardingWizard />;
}
