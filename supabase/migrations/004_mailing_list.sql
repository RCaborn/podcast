-- Migration 004: Mailing list subscribers table
-- Stores newsletter subscriptions from multiple capture points.
-- Emails are private data — only service role can SELECT/UPDATE/DELETE.
-- Unsubscribe handling requires a server-side function (Edge Function)
-- to be added later, since the client cannot SELECT or UPDATE rows.

create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  first_name    text,
  status        text not null default 'active'
                  check (status in ('active', 'unsubscribed')),
  source        text not null
                  check (source in (
                    'homepage-strip',
                    'homepage-footer',
                    'article-footer',
                    'newsletter-page',
                    'subscribe-page',
                    'join-flow'
                  )),
  consent_given boolean not null default false,
  consent_text  text not null,
  consented_at  timestamptz not null default now(),
  ip_hint       text,
  created_at    timestamptz not null default now()
);

-- RLS
alter table public.subscribers enable row level security;

-- Anyone can subscribe (insert)
create policy "Anyone can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- No public SELECT — subscriber emails are private data.
-- Only accessible via service role (server-side / Edge Functions).

-- No public UPDATE — status changes (unsubscribe) must go through
-- a server-side function to be built later.

-- No public DELETE.
