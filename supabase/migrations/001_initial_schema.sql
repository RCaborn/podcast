-- ============================================================
-- Counter Culture — initial schema
-- ============================================================

-- ---------- profiles ----------
create table public.profiles (
  id             uuid primary key references auth.users on delete cascade,
  full_name      text not null,
  shop_name      text,
  location       text,
  bio            text,
  avatar_initials text check (char_length(avatar_initials) <= 2),
  avatar_colour  text check (avatar_colour in ('forest', 'ochre', 'rust', 'sage', 'ink')),
  created_at     timestamptz not null default now()
);

-- ---------- articles ----------
create table public.articles (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text unique not null,
  excerpt        text,
  body           text,
  tag            text,
  author_name    text,
  author_source  text,
  read_time      integer,
  card_style     text check (card_style in ('forest', 'ochre-gradient', 'light', 'cream')),
  issue_number   integer,
  published_at   timestamptz,
  created_at     timestamptz not null default now()
);

-- ---------- threads ----------
create table public.threads (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  category       text not null check (category in ('delis', 'butchers', 'cheesemongers', 'farm-shops', 'general')),
  author_id      uuid not null references public.profiles(id),
  created_at     timestamptz not null default now()
);

-- ---------- replies ----------
create table public.replies (
  id             uuid primary key default gen_random_uuid(),
  thread_id      uuid not null references public.threads(id) on delete cascade,
  author_id      uuid not null references public.profiles(id),
  content        text not null,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- Row-Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.threads  enable row level security;
alter table public.replies  enable row level security;

-- articles: public read
create policy "Articles are viewable by everyone"
  on public.articles for select
  using (true);

-- threads: public read, authenticated insert
create policy "Threads are viewable by everyone"
  on public.threads for select
  using (true);

create policy "Authenticated users can create threads"
  on public.threads for insert
  to authenticated
  with check (true);

-- replies: public read, authenticated insert
create policy "Replies are viewable by everyone"
  on public.replies for select
  using (true);

create policy "Authenticated users can create replies"
  on public.replies for insert
  to authenticated
  with check (true);

-- profiles: public read, update own row only
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
