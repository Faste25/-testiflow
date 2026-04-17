import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/emails";
import { NextResponse } from "next/server";

// Llamado desde el webhook de Supabase Auth (Database Webhooks)
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { record } = await req.json();
  if (record?.email) {
    await sendWelcomeEmail(record.email, record.raw_user_meta_data?.full_name);
  }

  return NextResponse.json({ ok: true });
}
