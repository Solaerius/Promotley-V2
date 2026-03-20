-- Create organization_profiles table (1:1 with organizations)
create table public.organization_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  industry text,
  website text,
  city text,
  target_audience text,
  unique_properties text,
  tone text,
  goals text,
  instagram_handle text,
  tiktok_handle text,
  facebook_handle text,
  linkedin_handle text,
  x_handle text,
  newsletter_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.organization_profiles enable row level security;

-- Members can read
create policy "Members can view org profile"
  on public.organization_profiles for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
    )
  );

-- Founders/admins can insert (note: includes 'founder' role)
create policy "Admins can insert org profile"
  on public.organization_profiles for insert
  with check (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('founder', 'admin', 'owner')
    )
  );

-- Founders/admins can update
create policy "Admins can update org profile"
  on public.organization_profiles for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('founder', 'admin', 'owner')
    )
  )
  with check (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('founder', 'admin', 'owner')
    )
  );
