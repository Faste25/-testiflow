"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/dashboard");
      } else if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
        supabase.auth.getSession().then(({ data }) => {
          if (!data.session) router.replace("/login?error=auth");
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Iniciando sesión...</p>
    </div>
  );
}
