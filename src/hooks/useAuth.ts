import { useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

const AVATAR_COLOURS: Profile['avatar_colour'][] = ['olive', 'terracotta', 'charcoal', 'sienna', 'brass']

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function randomColour(): NonNullable<Profile['avatar_colour']> {
  return AVATAR_COLOURS[Math.floor(Math.random() * AVATAR_COLOURS.length)]!
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, fullName: string, shopName?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export function useAuthProvider(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile for a given user id
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile((data as Profile) ?? null)
  }, [])

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signUp = useCallback(async (email: string, password: string, fullName: string, shopName?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }

    const userId = data.user?.id
    if (!userId) return { error: 'Sign-up failed.' }

    // Insert profile row
    const { error: profileErr } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      shop_name: shopName || null,
      avatar_initials: initialsFrom(fullName),
      avatar_colour: randomColour(),
    })

    if (profileErr) return { error: profileErr.message }

    await fetchProfile(userId)
    return { error: null }
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const isAdmin = profile?.role === 'admin'

  return { user, profile, loading, isAdmin, signUp, signIn, signOut }
}
