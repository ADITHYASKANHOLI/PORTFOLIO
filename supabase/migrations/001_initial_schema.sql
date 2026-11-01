-- Migration: 001_initial_schema.sql
-- Description: Core tables for Adithya S. Kanholi's Engineering Portfolio & Journal

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ADMIN USERS TABLE
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  created_at timestamptz default now() not null
);

comment on table public.admin_users is 'Tracks authenticated users authorized as portfolio admins.';

-- Helper Function: Check if current authenticated user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- 2. PROJECTS TABLE
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text not null default '',
  full_description text not null default '',
  cover_image_path text,
  gallery jsonb not null default '[]'::jsonb,
  category text not null default 'Software & Systems',
  technologies text[] not null default '{}',
  github_url text,
  demo_url text,
  external_url text,
  project_date date default current_date,
  featured boolean not null default false,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_published on public.projects(published);
create index if not exists idx_projects_display_order on public.projects(display_order asc);

-- 3. SITE CONTENT TABLE
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_site_content_section_key on public.site_content(section_key);

-- 4. SKILLS TABLE
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_skills_category on public.skills(category);
create index if not exists idx_skills_display_order on public.skills(display_order asc);

-- 5. SOCIAL LINKS TABLE
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  display_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_social_links_display_order on public.social_links(display_order asc);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.site_content enable row level security;
alter table public.skills enable row level security;
alter table public.social_links enable row level security;

-- Policies: admin_users
create policy "Admins can view admin_users list"
  on public.admin_users for select
  using (public.is_admin());

create policy "Admins can manage admin_users"
  on public.admin_users for all
  using (public.is_admin())
  with check (public.is_admin());

-- Policies: projects
create policy "Public can view published projects"
  on public.projects for select
  using (published = true or public.is_admin());

create policy "Admins can insert projects"
  on public.projects for insert
  with check (public.is_admin());

create policy "Admins can update projects"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete projects"
  on public.projects for delete
  using (public.is_admin());

-- Policies: site_content
create policy "Public can view site content"
  on public.site_content for select
  using (true);

create policy "Admins can insert site content"
  on public.site_content for insert
  with check (public.is_admin());

create policy "Admins can update site content"
  on public.site_content for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete site content"
  on public.site_content for delete
  using (public.is_admin());

-- Policies: skills
create policy "Public can view skills"
  on public.skills for select
  using (true);

create policy "Admins can manage skills"
  on public.skills for all
  using (public.is_admin())
  with check (public.is_admin());

-- Policies: social_links
create policy "Public can view enabled social links"
  on public.social_links for select
  using (enabled = true or public.is_admin());

create policy "Admins can manage social links"
  on public.social_links for all
  using (public.is_admin())
  with check (public.is_admin());

-- 7. STORAGE SETUP SCRIPT
-- Insert storage bucket 'portfolio-media'
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Storage RLS
create policy "Public can read portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "Admins can upload portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and public.is_admin());

create policy "Admins can update portfolio media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and public.is_admin())
  with check (bucket_id = 'portfolio-media' and public.is_admin());

create policy "Admins can delete portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and public.is_admin());

