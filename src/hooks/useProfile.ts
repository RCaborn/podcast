import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

/** Fetch a profile by user id. */
export function useProfile(id: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
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
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setProfile(data as Profile)
      }
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [id])

  /** Update the current user's own profile (RLS enforced). */
  const updateProfile = useCallback(
    async (fields: Partial<Omit<Profile, 'id' | 'created_at'>>) => {
      if (!id) return { error: 'No profile id' }

      const { data, error: err } = await supabase
        .from('profiles')
        .update(fields)
        .eq('id', id)
        .select()
        .single()

      if (!err && data) setProfile(data as Profile)
      return { data: data as Profile | null, error: err?.message ?? null }
    },
    [id],
  )

  return { profile, loading, error, updateProfile }
}
