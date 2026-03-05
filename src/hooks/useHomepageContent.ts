import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Article, ThreadWithMeta, Profile, ThreadReaction } from '../types/database'

export interface HomepageContent {
  lead: Article | null
  imageFeatures: Article[]
  newsletterStrip: Article | null
  trio: Article[]
  opinionPullquote: Article | null
  aside: Article | null
  bottom: Article[]
  communityInline: ThreadWithMeta | null
  communityStrip: ThreadWithMeta | null
  sidebar: Article[]
  loading: boolean
}

export function useHomepageContent(): HomepageContent {
  const [articles, setArticles] = useState<Article[]>([])
  const [sidebarArticles, setSidebarArticles] = useState<Article[]>([])
  const [threads, setThreads] = useState<ThreadWithMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      const [featuredRes, sidebarRes, threadRes] = await Promise.all([
        // Featured articles
        supabase
          .from('articles')
          .select('*')
          .not('featured_position', 'is', null)
          .eq('status', 'published'),
        // Sidebar: 3 most recent published without a featured position
        supabase
          .from('articles')
          .select('*')
          .is('featured_position', null)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3),
        // Featured threads
        supabase
          .from('threads')
          .select('*, author:profiles!author_id(*), replies(count), thread_reactions(*)')
          .not('featured_thread_position', 'is', null)
          .eq('is_hidden', false),
      ])

      if (cancelled) return

      setArticles((featuredRes.data as Article[]) ?? [])
      setSidebarArticles((sidebarRes.data as Article[]) ?? [])

      const mappedThreads: ThreadWithMeta[] = (threadRes.data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        tags: row.tags ?? [],
        author_id: row.author_id,
        is_weekly_prompt: row.is_weekly_prompt ?? false,
        prompt_week: row.prompt_week,
        featured_thread_position: row.featured_thread_position,
        is_pinned: row.is_pinned ?? false,
        is_locked: row.is_locked ?? false,
        is_hidden: row.is_hidden ?? false,
        created_at: row.created_at,
        author: row.author as Profile,
        reply_count: row.replies?.[0]?.count ?? 0,
        reactions: (row.thread_reactions as ThreadReaction[]) ?? [],
      }))

      setThreads(mappedThreads)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [])

  function byPosition(pos: string): Article | null {
    return articles.find((a) => a.featured_position === pos) ?? null
  }

  function threadByPosition(pos: string): ThreadWithMeta | null {
    return threads.find((t) => t.featured_thread_position === pos) ?? null
  }

  const if1 = byPosition('image-feature-1')
  const if2 = byPosition('image-feature-2')
  const imageFeatures = [if1, if2].filter(Boolean) as Article[]

  const t1 = byPosition('trio-1')
  const t2 = byPosition('trio-2')
  const t3 = byPosition('trio-3')
  const trio = [t1, t2, t3].filter(Boolean) as Article[]

  const b1 = byPosition('bottom-1')
  const b2 = byPosition('bottom-2')
  const bottom = [b1, b2].filter(Boolean) as Article[]

  return {
    lead: byPosition('lead'),
    imageFeatures,
    newsletterStrip: byPosition('newsletter-strip'),
    trio,
    opinionPullquote: byPosition('opinion-pullquote'),
    aside: byPosition('aside'),
    bottom,
    communityInline: threadByPosition('community-inline'),
    communityStrip: threadByPosition('community-strip'),
    sidebar: sidebarArticles,
    loading,
  }
}
