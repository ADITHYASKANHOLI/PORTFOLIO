# Supabase Database & Security Guide

This directory contains the PostgreSQL database migrations and Row Level Security (RLS) policies for **Adithya S. Kanholi's Portfolio & Engineering Journal**.

## 1. Migration Files

- `001_initial_schema.sql`: Creates core tables (`admin_users`, `projects`, `site_content`, `skills`, `social_links`), indexes, helper function `is_admin()`, strict Row Level Security (RLS) policies, and storage bucket configuration.
- `002_seed_data.sql`: Seeds initial authentic content, skills, social links, and project records reflecting Adithya's Electrical & Electronics Engineering journey and the FOLE student collective.

## 2. Setting Up in Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the contents of `001_initial_schema.sql`.
4. Run the contents of `002_seed_data.sql`.
5. Go to **Storage**:
   - Verify that the bucket `portfolio-media` is present and marked as public.
   - Confirm policies allow public read and admin write/update/delete.

## 3. Provisioning the First Authorized Administrator

In accordance with strict security requirements, users cannot promote themselves or insert their own records into `admin_users` from the client.

To create your initial authorized admin:

1. Sign up a new user via Supabase Auth (Dashboard -> **Authentication** -> **Users** -> **Add user**), e.g. with your email and a strong password.
2. Copy the resulting `user_id` (UUID).
3. Open the **SQL Editor** and run:

```sql
insert into public.admin_users (user_id)
values ('<PASTE-YOUR-USER-UUID-HERE>');
```

4. Now log in at `/admin/login` using those credentials. You will have full administrative access to edit content, manage projects, and upload media.

