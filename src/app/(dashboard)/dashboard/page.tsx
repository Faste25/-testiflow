import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SpaceCard from "@/components/dashboard/space-card";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: spaces } = await supabase
    .from("spaces")
    .select(
      `
      *,
      testimonials(count)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Espacios</h1>
          <p className="text-muted-foreground mt-1">
            Crea espacios para recolectar testimonios de tus clientes
          </p>
        </div>
        <Link href="/dashboard/spaces/new">
          <Button className="bg-indigo-700 hover:bg-indigo-800">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Espacio
          </Button>
        </Link>
      </div>

      {!spaces?.length ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Crea tu primer Espacio
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Un Espacio es una página donde tus clientes pueden dejar sus
            testimonios en texto o video.
          </p>
          <Link href="/dashboard/spaces/new">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              <Plus className="w-4 h-4 mr-2" />
              Crear primer Espacio
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
