import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subscriptionID } = await req.json();
  if (!subscriptionID) return NextResponse.json({ error: "Missing subscriptionID" }, { status: 400 });

  const { error } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      subscription_status: "active",
      stripe_subscription_id: subscriptionID,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
