import { NextResponse } from "next/server";

// Stripe integration replaced by PayPal
export async function POST() {
  return NextResponse.json({ error: "Use PayPal integration" }, { status: 410 });
}
