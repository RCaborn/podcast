import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

/** Fetch all profiles that have a shop_photo_url set. */
export function useMemberDirectory(tradeType?: string, region?: string) {
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      let query = supabase
        .from('profiles')
        .select('*')
        .not('shop_photo_url', 'is', null)
        .not('shop_name', 'is', null)
        .order('created_at', { ascending: false })

      if (tradeType) {
        query = query.eq('trade_type', tradeType)
      }

      const { data, error: err } = await query

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      let result = (data ?? []) as Profile[]

      // Client-side region filter (case-insensitive contains)
      if (region) {
        const lower = region.toLowerCase()
        result = result.filter(
          (p) => p.region?.toLowerCase().includes(lower) || p.location?.toLowerCase().includes(lower),
        )
      }

      setMembers(result)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [tradeType, region])

  return { members, loading, error }
}
