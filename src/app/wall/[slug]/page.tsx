import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/wall/testimonial-form";
import { Zap } from "lucide-react";

export default async function WallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!space) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-10">
          {space.logo_url ? (
            <img
              src={space.logo_url}
              alt={space.name}
              className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4"
            />
          ) : (
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
          {space.description && (
            <p className="text-muted-foreground mt-2 text-sm">
              {space.description}
            </p>
          )}
        </div>

        <TestimonialForm space={space} />

        <div className="text-center mt-8">
          <a
            href={process.env.NEXT_PUBLIC_APP_URL ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gray-700 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Powered by TestiFlow
          </a>
        </div>
      </div>
    </div>
  );
}
