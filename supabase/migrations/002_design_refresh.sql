-- ============================================================
-- Counter Culture — design refresh migration
-- ============================================================

-- ---------- articles: new columns ----------
alter table public.articles add column image_url text;
alter table public.articles add column is_featured boolean not null default false;

-- ---------- profiles: update avatar_colour constraint ----------
alter table public.profiles drop constraint if exists profiles_avatar_colour_check;
alter table public.profiles add constraint profiles_avatar_colour_check
  check (avatar_colour in ('olive', 'terracotta', 'charcoal', 'sienna', 'brass'));

-- ---------- articles: update card_style constraint ----------
alter table public.articles drop constraint if exists articles_card_style_check;
alter table public.articles add constraint articles_card_style_check
  check (card_style in ('light', 'cream'));
