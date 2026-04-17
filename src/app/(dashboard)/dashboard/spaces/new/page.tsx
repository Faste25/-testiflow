import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SpaceForm from "@/components/dashboard/space-form";

export default async function NewSpacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Espacio</h1>
        <p className="text-muted-foreground mt-1">
          Crea un espacio para empezar a recolectar testimonios
        </p>
      </div>
      <SpaceForm userId={user.id} />
    </div>
  );
}
