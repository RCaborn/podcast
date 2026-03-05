-- ============================================================
-- Counter Culture — admin system migration
-- ============================================================

-- ---------- profiles: admin flag ----------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- ---------- articles: featured position, status, pullquote ----------
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS featured_position text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS pullquote text;

-- Constraints
ALTER TABLE public.articles
  ADD CONSTRAINT articles_featured_position_check
    CHECK (featured_position IN (
      'lead', 'image-feature-1', 'image-feature-2', 'newsletter-strip',
      'trio-1', 'trio-2', 'trio-3', 'opinion-pullquote', 'aside',
      'bottom-1', 'bottom-2'
    ));

-- Unique constraint on featured_position (nulls excluded)
CREATE UNIQUE INDEX IF NOT EXISTS articles_featured_position_unique
  ON public.articles (featured_position)
  WHERE featured_position IS NOT NULL;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_status_check
    CHECK (status IN ('draft', 'published', 'archived'));

-- ---------- threads: featured position, moderation flags ----------
ALTER TABLE public.threads
  ADD COLUMN IF NOT EXISTS featured_thread_position text,
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

ALTER TABLE public.threads
  ADD CONSTRAINT threads_featured_thread_position_check
    CHECK (featured_thread_position IN ('community-inline', 'community-strip'));

CREATE UNIQUE INDEX IF NOT EXISTS threads_featured_thread_position_unique
  ON public.threads (featured_thread_position)
  WHERE featured_thread_position IS NOT NULL;

-- ---------- replies: moderation flag ----------
ALTER TABLE public.replies
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

-- ============================================================
-- Admin RLS policies
-- ============================================================
-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Articles: admin full CRUD
CREATE POLICY "Admin full access to articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Articles: admin can insert
CREATE POLICY "Admin can insert articles"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Threads: admin full CRUD
CREATE POLICY "Admin full access to threads"
  ON public.threads
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Replies: admin full CRUD
CREATE POLICY "Admin full access to replies"
  ON public.replies
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Profiles: admin can update any profile (for setting is_admin)
CREATE POLICY "Admin can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Notices: admin full CRUD
CREATE POLICY "Admin full access to notices"
  ON public.notices
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
