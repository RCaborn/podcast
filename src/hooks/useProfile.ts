import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { uploadFacePhoto, uploadShopPhoto } from '../lib/storage'
import type { Profile, ThreadWithMeta, Notice } from '../types/database'

/** Fetch a profile by user id, with their threads and notices. */
export function useProfile(id: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [threads, setThreads] = useState<ThreadWithMeta[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetch() {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return
      if (profileErr) {
        setError(profileErr.message)
        setLoading(false)
        return
      }

      setProfile(profileData as Profile)

      // Fetch their threads
      const { data: threadData } = await supabase
        .from('threads')
        .select('*, author:profiles!author_id(*), replies(count)')
        .eq('author_id', id)
        .order('created_at', { ascending: false })

      if (!cancelled && threadData) {
        setThreads(
          threadData.map((row: Record<string, unknown>) => ({
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
          })),
        )
      }

      // Fetch their notices
      const { data: noticeData } = await supabase
        .from('notices')
        .select('*, author:profiles!author_id(*)')
        .eq('author_id', id)
        .order('created_at', { ascending: false })

      if (!cancelled && noticeData) {
        setNotices(noticeData as Notice[])
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

  /** Upload face photo and update profile. */
  const uploadFace = useCallback(
    async (file: File) => {
      if (!id) throw new Error('No profile id')
      const url = await uploadFacePhoto(id, file)
      await updateProfile({ face_photo_url: url })
      return url
    },
    [id, updateProfile],
  )

  /** Upload shop photo and update profile. */
  const uploadShop = useCallback(
    async (file: File) => {
      if (!id) throw new Error('No profile id')
      const url = await uploadShopPhoto(id, file)
      await updateProfile({ shop_photo_url: url })
      return url
    },
    [id, updateProfile],
  )

  return { profile, threads, notices, loading, error, updateProfile, uploadFace, uploadShop }
}
