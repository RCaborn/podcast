import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ThreadWithMeta, ThreadDetail, Profile, Reply, ThreadReaction } from '../types/database'

/** Fetch all threads with reply count, author profile, and reactions. */
export function useThreads(tagFilter?: string, typeFilter?: 'discussion' | 'prompt' | 'all') {
  const [threads, setThreads] = useState<ThreadWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      const { data, error: err } = await supabase
        .from('threads')
        .select('*, author:profiles!author_id(*), replies(count), thread_reactions(*)')
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      let mapped: ThreadWithMeta[] = (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        category: row.category as string | null,
        tags: (row.tags as string[]) ?? [],
        author_id: row.author_id as string,
        is_weekly_prompt: (row.is_weekly_prompt as boolean) ?? false,
        prompt_week: row.prompt_week as string | null,
        created_at: row.created_at as string,
        author: row.author as Profile,
        reply_count: ((row.replies as { count: number }[])?.[0]?.count) ?? 0,
        reactions: (row.thread_reactions as ThreadReaction[]) ?? [],
      }))

      // Apply type filter
      if (typeFilter === 'prompt') {
        mapped = mapped.filter((t) => t.is_weekly_prompt)
      } else if (typeFilter === 'discussion') {
        mapped = mapped.filter((t) => !t.is_weekly_prompt)
      }

      // Apply tag filter
      if (tagFilter) {
        mapped = mapped.filter((t) => t.tags.includes(tagFilter))
      }

      setThreads(mapped)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [tagFilter, typeFilter])

  return { threads, loading, error }
}

/** Fetch a single thread by id with all replies and their author profiles. */
export function useThread(id: string | undefined) {
  const [thread, setThread] = useState<ThreadDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetch() {
      const { data, error: err } = await supabase
        .from('threads')
        .select('*, author:profiles!author_id(*), replies(*, author:profiles!author_id(*)), thread_reactions(*)')
        .eq('id', id)
        .single()

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      const row = data as Record<string, unknown>
      const detail: ThreadDetail = {
        id: row.id as string,
        title: row.title as string,
        category: row.category as string | null,
        tags: (row.tags as string[]) ?? [],
        author_id: row.author_id as string,
        is_weekly_prompt: (row.is_weekly_prompt as boolean) ?? false,
        prompt_week: row.prompt_week as string | null,
        created_at: row.created_at as string,
        author: row.author as Profile,
        replies: (row.replies as (Reply & { author: Profile })[]) ?? [],
        reactions: (row.thread_reactions as ThreadReaction[]) ?? [],
      }

      setThread(detail)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [id])

  return { thread, loading, error }
}

/** Toggle a reaction on a thread. */
export function useToggleReaction() {
  const toggle = useCallback(async (threadId: string, authorId: string, type: 'same-here' | 'useful') => {
    // Check if reaction exists
    const { data: existing } = await supabase
      .from('thread_reactions')
      .select('id')
      .eq('thread_id', threadId)
      .eq('author_id', authorId)
      .eq('type', type)
      .maybeSingle()

    if (existing) {
      await supabase.from('thread_reactions').delete().eq('id', existing.id)
      return false // removed
    } else {
      await supabase.from('thread_reactions').insert({ thread_id: threadId, author_id: authorId, type })
      return true // added
    }
  }, [])

  return { toggle }
}
