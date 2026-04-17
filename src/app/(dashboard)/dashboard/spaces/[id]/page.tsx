import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import SpaceForm from "@/components/dashboard/space-form";
import SpaceEmbedSection from "@/components/dashboard/space-embed-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!space) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
        </div>
        <Link href={`/wall/${space.slug}`} target="_blank">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Ver Wall
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <SpaceForm userId={user.id} space={space} />
        <SpaceEmbedSection spaceId={space.id} slug={space.slug} />
      </div>
    </div>
  );
}
