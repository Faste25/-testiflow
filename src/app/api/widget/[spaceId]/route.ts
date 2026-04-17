import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ spaceId: string }> }
) {
  const { spaceId } = await params;
  const supabase = await createClient();

  const { data: space } = await supabase
    .from("spaces")
    .select("name, is_active, user_id")
    .eq("id", spaceId)
    .single();

  if (!space?.is_active) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const [{ data: testimonials }, { data: profile }] = await Promise.all([
    supabase
      .from("testimonials")
      .select("submitter_name, text_content, video_url, rating, created_at")
      .eq("space_id", spaceId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("profiles")
      .select("plan")
      .eq("id", space.user_id)
      .single(),
  ]);

  return NextResponse.json(
    {
      testimonials: testimonials ?? [],
      spaceName: space.name,
      hideBranding: profile?.plan === "pro",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60",
      },
    }
  );
}
