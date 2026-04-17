export type Plan = "free" | "pro";
export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "canceled"
  | "past_due"
  | "trialing";
export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  slug: string;
  logo_url: string | null;
  thank_you_message: string;
  collect_video: boolean;
  collect_text: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  space_id: string;
  submitter_name: string;
  submitter_email: string | null;
  text_content: string | null;
  video_url: string | null;
  video_duration: number | null;
  status: TestimonialStatus;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface EmailRequest {
  id: string;
  space_id: string;
  user_id: string;
  recipient_email: string;
  recipient_name: string | null;
  token: string;
  sent_at: string | null;
  opened_at: string | null;
  submitted_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type SpaceWithCount = Space & {
  testimonials_count: number;
  approved_count: number;
};
