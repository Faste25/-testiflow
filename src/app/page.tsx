import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Star, Video, Code, CheckCircle, ArrowRight, MessageSquare, BarChart2, Shield } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">TestiFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Precios</Link>
            <Link href="/login">
              <Button variant="outline" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-indigo-700 hover:bg-indigo-800">Empezar gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Star className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
          La herramienta de testimonios más simple del mercado
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Recolecta testimonios que<br />
          <span className="text-indigo-700">convierten clientes</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Crea formularios de testimonio en segundos, recibe texto y video de tus clientes, y embebeló en tu web con un solo copy-paste.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login">
            <Button size="lg" className="bg-indigo-700 hover:bg-indigo-800 h-12 px-8 text-base">
              Empezar gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Ver precios
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">Sin tarjeta de crédito. Gratis para siempre en el plan básico.</p>
      </section>

      {/* Social proof numbers */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { number: "2 min", label: "Para crear tu primer formulario" },
            { number: "100%", label: "Control sobre qué mostrar" },
            { number: "0 código", label: "Para embeber en tu web" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-indigo-700 mb-1">{s.number}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
          <p className="text-gray-500 text-lg">3 pasos para tener testimonios en tu web</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <MessageSquare className="w-6 h-6 text-indigo-700" />,
              title: "Creá tu espacio",
              desc: "Configurá un formulario personalizado para tu negocio en menos de 2 minutos. Sin código.",
            },
            {
              step: "02",
              icon: <Video className="w-6 h-6 text-indigo-700" />,
              title: "Compartí el link",
              desc: "Tus clientes entran al link y dejan su testimonio en texto o video directamente desde el navegador.",
            },
            {
              step: "03",
              icon: <Code className="w-6 h-6 text-indigo-700" />,
              title: "Embebé en tu web",
              desc: "Aprobá los mejores testimonios y pegá el código en tu sitio. Funciona en Shopify, Wix, Webflow y más.",
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="text-6xl font-black text-gray-50 absolute top-4 right-6 select-none">{item.step}</div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-indigo-50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitás</h2>
            <p className="text-gray-500 text-lg">Potente pero simple. Sin curva de aprendizaje.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Video className="w-5 h-5 text-indigo-700" />, title: "Video testimonials", desc: "Tus clientes graban videos directamente desde el navegador. Sin apps externas." },
              { icon: <Star className="w-5 h-5 text-indigo-700" />, title: "Sistema de ratings", desc: "Recolectá puntuaciones de 1 a 5 estrellas junto con cada testimonio." },
              { icon: <CheckCircle className="w-5 h-5 text-indigo-700" />, title: "Aprobación manual", desc: "Vos decidís qué testimonios aparecen públicamente. 100% control editorial." },
              { icon: <Code className="w-5 h-5 text-indigo-700" />, title: "Widget embed", desc: "Código para pegar en cualquier web. Compatible con Shopify, WooCommerce, Webflow y más." },
              { icon: <BarChart2 className="w-5 h-5 text-indigo-700" />, title: "Múltiples espacios", desc: "Creá un espacio por producto, cliente o campaña. Sin límite de espacios." },
              { icon: <Shield className="w-5 h-5 text-indigo-700" />, title: "Sin contraseñas", desc: "Login por magic link. Tus clientes entran al formulario sin crear cuenta." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-indigo-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Precios simples</h2>
          <p className="text-gray-500 text-lg">Empezá gratis. Sin sorpresas.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
            <p className="text-sm text-gray-500 mb-6">Para probar sin riesgo</p>
            <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-base font-normal text-gray-400">/mes</span></p>
            <ul className="space-y-3 mb-8">
              {["Hasta 10 testimonios aprobados", "Espacios ilimitados", "Video + texto", "Widget embed básico"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button variant="outline" className="w-full">Empezar gratis</Button>
            </Link>
          </div>
          <div className="bg-indigo-700 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">Popular</div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Zap className="w-4 h-4" />Pro</h3>
            <p className="text-sm text-indigo-200 mb-6">Para profesionales</p>
            <p className="text-4xl font-bold text-white mb-6">$19<span className="text-base font-normal text-indigo-300">/mes</span></p>
            <ul className="space-y-3 mb-8">
              {["Testimonios ilimitados", "Sin branding de TestiFlow", "Widget embed premium", "Soporte prioritario"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="w-4 h-4 text-indigo-300 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50">Empezar con Pro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-indigo-700 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Empezá a recolectar testimonios hoy
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Gratis para siempre. Sin tarjeta de crédito. Listo en 2 minutos.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 h-12 px-10 text-base font-semibold">
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-700 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-900">TestiFlow</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-gray-600">Precios</Link>
            <Link href="/login" className="hover:text-gray-600">Login</Link>
          </div>
          <p className="text-sm text-gray-400">© 2025 TestiFlow</p>
        </div>
      </footer>
    </div>
  );
}
