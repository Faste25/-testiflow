import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const FREE_FEATURES = [
  "Hasta 10 testimonios aprobados",
  "Espacios ilimitados",
  "Formulario con video",
  "Widget embed básico",
  'Branding "Powered by TestiFlow"',
];

const PRO_FEATURES = [
  "Testimonios ilimitados",
  "Sin branding de TestiFlow",
  "Todos los Espacios que quieras",
  "Widget embed premium",
  "Soporte prioritario",
  "Dark mode en el widget",
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let plan = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    plan = profile?.plan ?? "free";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">TestiFlow</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Precios simples y transparentes
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Empieza gratis. Actualiza cuando estés listo para crecer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Plan Free */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Free</h2>
              <p className="text-gray-500 text-sm">Para empezar a recolectar testimonios</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500 ml-2">/mes</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  {plan === "free" ? "Plan actual" : "Plan Free"}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="w-full">Empezar gratis</Button>
              </Link>
            )}
          </div>

          {/* Plan Pro */}
          <div className="bg-indigo-600 rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Popular
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Pro
              </h2>
              <p className="text-indigo-200 text-sm">Para profesionales que quieren escalar</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$12</span>
              <span className="text-indigo-200 ml-2">/mes</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {user ? (
              plan === "pro" ? (
                <Link href="/dashboard/billing">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                    Gestionar suscripción
                  </Button>
                </Link>
              ) : (
                <UpgradeButton />
              )
            ) : (
              <Link href="/login">
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                  Empezar con Pro
                </Button>
              </Link>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          Sin contratos. Cancela cuando quieras. Pago seguro con Stripe.
        </p>
      </div>
    </div>
  );
}

function UpgradeButton() {
  return (
    <form action="/api/stripe/checkout" method="POST">
      <Button type="submit" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
        Upgrade a Pro — $12/mes
      </Button>
    </form>
  );
}
