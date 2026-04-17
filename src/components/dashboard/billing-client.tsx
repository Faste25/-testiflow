"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Check } from "lucide-react";

interface Props {
  profile: {
    plan: string;
    subscription_status: string;
    stripe_subscription_id: string | null;
  } | null;
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

export default function BillingClient({ profile }: Props) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const { toast } = useToast();
  const isPro = profile?.plan === "pro";

  async function handleCheckout() {
    setLoading("checkout");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
        variant: "destructive",
      });
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
        variant: "destructive",
      });
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Plan Free */}
        <Card className={`border-2 ${!isPro ? "border-violet-600" : "border-gray-100"}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Free</CardTitle>
              {!isPro && <Badge className="bg-violet-100 text-violet-700">Actual</Badge>}
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

        {/* Plan Pro */}
        <Card className={`border-2 ${isPro ? "border-violet-600" : "border-gray-100"} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
            Popular
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-violet-600" />
                Pro
              </CardTitle>
              {isPro && <Badge className="bg-violet-100 text-violet-700">Actual</Badge>}
            </div>
            <p className="text-2xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {!isPro && (
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={handleCheckout}
                disabled={loading === "checkout"}
              >
                {loading === "checkout" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upgrade a Pro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {isPro && profile?.stripe_subscription_id && (
        <Card className="border-gray-100">
          <CardContent className="pt-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Suscripción activa</p>
              <p className="text-xs text-muted-foreground capitalize">
                Estado: {profile.subscription_status}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePortal}
              disabled={loading === "portal"}
            >
              {loading === "portal" && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Gestionar suscripción
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
