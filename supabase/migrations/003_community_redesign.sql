-- ============================================================
-- Counter Culture — community redesign migration
-- ============================================================

-- 1. Extend profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trade_type text CHECK (
    trade_type IN ('deli', 'butcher', 'cheesemonger', 'farm-shop', 'grocer', 'other')
  ),
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS years_trading integer,
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS face_photo_url text,
  ADD COLUMN IF NOT EXISTS shop_photo_url text,
  ADD COLUMN IF NOT EXISTS shop_photo_caption text;

-- 2. Update threads table — add tags and weekly prompt support
ALTER TABLE threads
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_weekly_prompt boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS prompt_week text;

-- Make category nullable (keeping column for backwards compat)
ALTER TABLE threads ALTER COLUMN category DROP NOT NULL;

-- 3. Notice board table
CREATE TABLE IF NOT EXISTS notices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    uuid REFERENCES profiles(id) NOT NULL,
  type         text NOT NULL CHECK (type IN ('supplier-rec', 'equipment-for-sale', 'staff-wanted', 'other')),
  title        text NOT NULL,
  body         text NOT NULL,
  location     text,
  contact_hint text,
  expires_at   timestamptz,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices_select_all" ON notices FOR SELECT USING (true);
CREATE POLICY "notices_insert_auth" ON notices FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "notices_update_own" ON notices FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "notices_delete_own" ON notices FOR DELETE USING (auth.uid() = author_id);

-- 4. Thread reactions
CREATE TABLE IF NOT EXISTS thread_reactions (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  type      text NOT NULL CHECK (type IN ('same-here', 'useful')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(thread_id, author_id, type)
);

ALTER TABLE thread_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions_select_all" ON thread_reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert_auth" ON thread_reactions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "reactions_delete_own" ON thread_reactions FOR DELETE USING (auth.uid() = author_id);
