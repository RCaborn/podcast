import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Notice, Profile } from '../types/database'

/** Fetch all active notices, newest first. */
export function useNotices(typeFilter?: Notice['type'] | 'all') {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      let query = supabase
        .from('notices')
        .select('*, author:profiles!author_id(*)')
        .order('created_at', { ascending: false })

      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('type', typeFilter)
      }

      const { data, error: err } = await query

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      const mapped: Notice[] = (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        author_id: row.author_id as string,
        type: row.type as Notice['type'],
        title: row.title as string,
        body: row.body as string,
        location: row.location as string | null,
        contact_hint: row.contact_hint as string | null,
        expires_at: row.expires_at as string | null,
        created_at: row.created_at as string,
        author: row.author as Profile,
      }))

      setNotices(mapped)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [typeFilter])

  return { notices, loading, error }
}
