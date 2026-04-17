import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const subscription = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session.metadata?.user_id;
      if (!userId) break;

      const sub = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await supabaseAdmin.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: sub.id,
        stripe_price_id: sub.items.data[0].price.id,
        status: sub.status,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
      });

      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          stripe_subscription_id: sub.id,
          subscription_status: sub.status,
        })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const customerId = subscription.customer as string;
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!profile) break;

      const isActive = subscription.status === "active";

      await supabaseAdmin
        .from("profiles")
        .update({
          plan: isActive ? "pro" : "free",
          subscription_status: subscription.status,
        })
        .eq("id", profile.id);

      await supabaseAdmin.from("subscriptions").upsert({
        user_id: profile.id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
