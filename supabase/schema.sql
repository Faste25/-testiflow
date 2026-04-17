-- ============================================================
-- TestiFlow — Supabase Schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'inactive' check (
    subscription_status in ('active', 'inactive', 'canceled', 'past_due', 'trialing')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SPACES (Campaigns / Walls)
-- ============================================================
create table public.spaces (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  slug text not null unique,
  logo_url text,
  thank_you_message text default '¡Gracias por tu testimonio!',
  collect_video boolean not null default true,
  collect_text boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index spaces_user_id_idx on public.spaces(user_id);
create index spaces_slug_idx on public.spaces(slug);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  space_id uuid references public.spaces(id) on delete cascade not null,
  submitter_name text not null,
  submitter_email text,
  text_content text,
  video_url text,
  video_duration integer, -- en segundos
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rating integer check (rating >= 1 and rating <= 5),
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonials_space_id_idx on public.testimonials(space_id);
create index testimonials_status_idx on public.testimonials(status);

-- ============================================================
-- EMAIL REQUESTS (solicitudes enviadas a clientes)
-- ============================================================
create table public.email_requests (
  id uuid default uuid_generate_v4() primary key,
  space_id uuid references public.spaces(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  recipient_email text not null,
  recipient_name text,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  sent_at timestamptz,
  opened_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index email_requests_space_id_idx on public.email_requests(space_id);
create index email_requests_token_idx on public.email_requests(token);

-- ============================================================
-- SUBSCRIPTIONS (historial de suscripciones Stripe)
-- ============================================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions(user_id);

-- ============================================================
-- TRIGGERS — updated_at automático
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger spaces_updated_at before update on public.spaces
  for each row execute function public.handle_updated_at();

create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.handle_updated_at();

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ============================================================
-- TRIGGER — crear perfil automáticamente al registrarse
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SPACES
alter table public.spaces enable row level security;

create policy "Users can view own spaces"
  on public.spaces for select
  using (auth.uid() = user_id);

create policy "Users can create spaces"
  on public.spaces for insert
  with check (auth.uid() = user_id);

create policy "Users can update own spaces"
  on public.spaces for update
  using (auth.uid() = user_id);

create policy "Users can delete own spaces"
  on public.spaces for delete
  using (auth.uid() = user_id);

create policy "Public can view active spaces by slug"
  on public.spaces for select
  using (is_active = true);

-- TESTIMONIALS
alter table public.testimonials enable row level security;

create policy "Space owners can view testimonials"
  on public.testimonials for select
  using (
    exists (
      select 1 from public.spaces
      where spaces.id = testimonials.space_id
        and spaces.user_id = auth.uid()
    )
  );

create policy "Space owners can update testimonials"
  on public.testimonials for update
  using (
    exists (
      select 1 from public.spaces
      where spaces.id = testimonials.space_id
        and spaces.user_id = auth.uid()
    )
  );

create policy "Space owners can delete testimonials"
  on public.testimonials for delete
  using (
    exists (
      select 1 from public.spaces
      where spaces.id = testimonials.space_id
        and spaces.user_id = auth.uid()
    )
  );

create policy "Anyone can submit testimonials to active spaces"
  on public.testimonials for insert
  with check (
    exists (
      select 1 from public.spaces
      where spaces.id = testimonials.space_id
        and spaces.is_active = true
    )
  );

create policy "Public can view approved testimonials"
  on public.testimonials for select
  using (status = 'approved');

-- EMAIL REQUESTS
alter table public.email_requests enable row level security;

create policy "Users can view own email requests"
  on public.email_requests for select
  using (auth.uid() = user_id);

create policy "Users can create email requests"
  on public.email_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own email requests"
  on public.email_requests for update
  using (auth.uid() = user_id);

-- SUBSCRIPTIONS
alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Bucket para videos de testimonios
insert into storage.buckets (id, name, public)
values ('testimonial-videos', 'testimonial-videos', true)
on conflict do nothing;

create policy "Anyone can upload testimonial videos"
  on storage.objects for insert
  with check (bucket_id = 'testimonial-videos');

create policy "Anyone can view testimonial videos"
  on storage.objects for select
  using (bucket_id = 'testimonial-videos');

create policy "Space owners can delete videos"
  on storage.objects for delete
  using (
    bucket_id = 'testimonial-videos'
    and auth.uid() is not null
  );

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Contar testimonios aprobados de un usuario (para límite Free)
create or replace function public.get_approved_testimonials_count(p_user_id uuid)
returns integer as $$
  select count(*)::integer
  from public.testimonials t
  join public.spaces s on s.id = t.space_id
  where s.user_id = p_user_id
    and t.status = 'approved';
$$ language sql security definer;
