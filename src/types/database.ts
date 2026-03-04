/* ------------------------------------------------------------------ */
/*  Row types matching supabase/migrations/001_initial_schema.sql      */
/* ------------------------------------------------------------------ */

export interface Profile {
  id: string
  full_name: string
  shop_name: string | null
  location: string | null
  bio: string | null
  avatar_initials: string | null
  avatar_colour: 'forest' | 'ochre' | 'rust' | 'sage' | 'ink' | null
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  tag: string | null
  author_name: string | null
  author_source: string | null
  read_time: number | null
  card_style: 'forest' | 'ochre-gradient' | 'light' | 'cream' | null
  issue_number: number | null
  published_at: string | null
  created_at: string
}

export interface Thread {
  id: string
  title: string
  category: 'delis' | 'butchers' | 'cheesemongers' | 'farm-shops' | 'general'
  author_id: string
  created_at: string
}

export interface Reply {
  id: string
  thread_id: string
  author_id: string
  content: string
  created_at: string
}

/* ------------------------------------------------------------------ */
/*  Composite / joined types used by hooks                             */
/* ------------------------------------------------------------------ */

export interface ThreadWithMeta extends Thread {
  reply_count: number
  author: Profile
}

export interface ThreadDetail extends Thread {
  author: Profile
  replies: (Reply & { author: Profile })[]
}
