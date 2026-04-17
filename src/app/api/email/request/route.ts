import { createClient } from "@/lib/supabase/server";
import { sendTestimonialRequestEmail } from "@/lib/emails";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { spaceId, recipientEmail, recipientName } = await req.json();

  if (!spaceId || !recipientEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: space } = await supabase
    .from("spaces")
    .select("name, slug")
    .eq("id", spaceId)
    .eq("user_id", user.id)
    .single();

  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: emailRequest, error } = await supabase
    .from("email_requests")
    .insert({
      space_id: spaceId,
      user_id: user.id,
      recipient_email: recipientEmail,
      recipient_name: recipientName ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const wallUrl = `${process.env.NEXT_PUBLIC_APP_URL}/wall/${space.slug}`;

  await sendTestimonialRequestEmail({
    toEmail: recipientEmail,
    toName: recipientName,
    fromName: profile?.full_name ?? profile?.email,
    spaceName: space.name,
    wallUrl,
  });

  await supabase
    .from("email_requests")
    .update({ sent_at: new Date().toISOString() })
    .eq("id", emailRequest.id);

  return NextResponse.json({ success: true });
}
