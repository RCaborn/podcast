/* ------------------------------------------------------------------ */
/*  Row types matching supabase/migrations                             */
/* ------------------------------------------------------------------ */

export interface Profile {
  id: string
  full_name: string
  shop_name: string | null
  location: string | null
  region: string | null
  trade_type: 'deli' | 'butcher' | 'cheesemonger' | 'farm-shop' | 'grocer' | 'other' | null
  years_trading: number | null
  tagline: string | null
  bio: string | null
  avatar_initials: string | null
  avatar_colour: 'olive' | 'terracotta' | 'charcoal' | 'sienna' | 'brass' | null
  face_photo_url: string | null
  shop_photo_url: string | null
  shop_photo_caption: string | null
  is_admin: boolean
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
  card_style: 'light' | 'cream' | null
  issue_number: number | null
  image_url: string | null
  is_featured: boolean
  featured_position: string | null
  status: 'draft' | 'published' | 'archived'
  pullquote: string | null
  published_at: string | null
  created_at: string
}

export interface Thread {
  id: string
  title: string
  category: string | null
  tags: string[]
  author_id: string
  is_weekly_prompt: boolean
  prompt_week: string | null
  featured_thread_position: string | null
  is_pinned: boolean
  is_locked: boolean
  is_hidden: boolean
  created_at: string
}

export interface Reply {
  id: string
  thread_id: string
  author_id: string
  content: string
  is_hidden: boolean
  created_at: string
}

export interface Notice {
  id: string
  author_id: string
  type: 'supplier-rec' | 'equipment-for-sale' | 'staff-wanted' | 'other'
  title: string
  body: string
  location: string | null
  contact_hint: string | null
  expires_at: string | null
  created_at: string
  author?: Profile
}

export interface ThreadReaction {
  id: string
  thread_id: string
  author_id: string
  type: 'same-here' | 'useful'
  created_at: string
}

/* ------------------------------------------------------------------ */
/*  Composite / joined types used by hooks                             */
/* ------------------------------------------------------------------ */

export interface ThreadWithMeta extends Thread {
  reply_count: number
  author: Profile
  reactions?: ThreadReaction[]
}

export interface ThreadDetail extends Thread {
  author: Profile
  replies: (Reply & { author: Profile })[]
  reactions?: ThreadReaction[]
}
