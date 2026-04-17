import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BillingClient from "@/components/dashboard/billing-client";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, stripe_subscription_id")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu plan y suscripción
        </p>
      </div>
      <BillingClient profile={profile} />
    </div>
  );
}
