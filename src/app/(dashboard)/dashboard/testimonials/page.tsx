import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TestimonialsList from "@/components/dashboard/testimonials-list";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: testimonials }, { data: profile }] = await Promise.all([
    supabase
      .from("testimonials")
      .select(`*, spaces!inner(name, user_id)`)
      .eq("spaces.user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Testimonios</h1>
        <p className="text-muted-foreground mt-1">
          Aprueba o rechaza los testimonios recibidos
        </p>
      </div>
      <TestimonialsList
        initialTestimonials={testimonials ?? []}
        userPlan={profile?.plan ?? "free"}
      />
    </div>
  );
}
