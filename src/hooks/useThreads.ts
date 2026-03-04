import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ThreadWithMeta, ThreadDetail, Profile, Reply } from '../types/database'

/** Fetch all threads with reply count and author profile, ordered newest first. */
export function useThreads() {
  const [threads, setThreads] = useState<ThreadWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      const { data, error: err } = await supabase
        .from('threads')
        .select('*, author:profiles!author_id(*), replies(count)')
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      const mapped: ThreadWithMeta[] = (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        category: row.category as ThreadWithMeta['category'],
        author_id: row.author_id as string,
        created_at: row.created_at as string,
        author: row.author as Profile,
        reply_count: ((row.replies as { count: number }[])?.[0]?.count) ?? 0,
      }))

      setThreads(mapped)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [])

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
        .select('*, author:profiles!author_id(*), replies(*, author:profiles!author_id(*))')
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
        category: row.category as ThreadDetail['category'],
        author_id: row.author_id as string,
        created_at: row.created_at as string,
        author: row.author as Profile,
        replies: (row.replies as (Reply & { author: Profile })[]) ?? [],
      }

      setThread(detail)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [id])

  return { thread, loading, error }
}
