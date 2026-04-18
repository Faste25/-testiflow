"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Zap, Check } from "lucide-react";

interface Props {
  profile: {
    plan: string;
    subscription_status: string;
    stripe_subscription_id: string | null;
  } | null;
  paypalClientId: string;
  paypalPlanId: string;
}

const PRO_FEATURES = [
  "Testimonios ilimitados",
  "Sin branding de TestiFlow",
  "Todos los Espacios que quieras",
  "Widget embed avanzado",
  "Soporte prioritario",
];

const FREE_FEATURES = [
  "Hasta 10 testimonios aprobados",
  "Espacios ilimitados",
  "Widget embed básico",
  "Branding de TestiFlow",
];

export default function BillingClient({ profile, paypalClientId, paypalPlanId }: Props) {
  const [upgrading, setUpgrading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isPro = profile?.plan === "pro";

  async function handleApprove(subscriptionID: string) {
    setUpgrading(true);
    try {
      const res = await fetch("/api/paypal/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionID }),
      });
      if (!res.ok) throw new Error("Error activando plan");
      toast({ title: "Plan Pro activado", description: "Bienvenido a Pro!" });
      router.refresh();
    } catch {
      toast({ title: "Error", description: "No se pudo activar el plan.", variant: "destructive" });
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className={`border-2 ${!isPro ? "border-indigo-600" : "border-gray-100"}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Free</CardTitle>
              {!isPro && <Badge className="bg-indigo-100 text-indigo-700">Actual</Badge>}
            </div>
            <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={`border-2 ${isPro ? "border-indigo-600" : "border-gray-100"} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
            Popular
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                Pro
              </CardTitle>
              {isPro && <Badge className="bg-indigo-100 text-indigo-700">Actual</Badge>}
            </div>
            <p className="text-2xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {!isPro && (
              <PayPalScriptProvider options={{
                clientId: paypalClientId,
                vault: true,
                intent: "subscription",
              }}>
                <PayPalButtons
                  style={{ shape: "rect", color: "blue", layout: "vertical", label: "subscribe" }}
                  disabled={upgrading}
                  createSubscription={(_data, actions) =>
                    actions.subscription.create({ plan_id: paypalPlanId })
                  }
                  onApprove={(data) => handleApprove(data.subscriptionID!)}
                  onError={() => toast({ title: "Error con PayPal", variant: "destructive" })}
                />
              </PayPalScriptProvider>
            )}
            {isPro && (
              <p className="text-sm text-center text-indigo-600 font-medium">Plan activo</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
