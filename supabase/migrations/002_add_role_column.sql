-- ============================================================
-- Add role column & admin RLS policies
-- ============================================================

-- Add role to profiles
alter table public.profiles
  add column role text not null default 'member'
  check (role in ('member', 'admin'));

-- Helper used by RLS policies
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Admins can insert articles
create policy "Admins can insert articles"
  on public.articles for insert
  to authenticated
  with check (public.is_admin());

-- Admins can update articles
create policy "Admins can update articles"
  on public.articles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete articles
create policy "Admins can delete articles"
  on public.articles for delete
  to authenticated
  using (public.is_admin());

-- Admins can update any profile (role changes, moderation)
create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- To promote the first admin, run:
-- update public.profiles set role = 'admin' where id = '<your-user-uuid>';
