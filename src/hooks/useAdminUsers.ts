import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

/** Fetch all user profiles for admin management. */
export function useAdminUsers() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setUsers(data as Profile[])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { users, loading, error, refetch }
}

/** Fetch a single profile by id. */
export function useAdminUser(id: string | undefined) {
  const [user, setUser] = useState<Profile | null>(null)
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
        setUser(data as Profile)
      }
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [id])

  return { user, loading, error }
}

/** Profile update mutation for admin use. */
export function useUserMutations() {
  const updateUser = useCallback(async (id: string, fields: Partial<Pick<Profile, 'full_name' | 'shop_name' | 'location' | 'bio' | 'role'>>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    return { data: data as Profile | null, error: error?.message ?? null }
  }, [])

  return { updateUser }
}
