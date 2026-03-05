import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const CONSENT_TEXT =
  'I agree to receive the Counter Culture weekly newsletter. Independent food retail news, community updates, and occasional relevant announcements. Unsubscribe any time.'

interface SubscribeParams {
  email: string
  firstName?: string
  source: string
}

export interface SubscribeResult {
  status: 'success' | 'already-subscribed' | 'error'
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useSubscribe() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SubscribeResult | null>(null)

  const subscribe = useCallback(async ({ email, firstName, source }: SubscribeParams) => {
    // Client-side email validation
    if (!EMAIL_RE.test(email)) {
      const r: SubscribeResult = { status: 'error', message: 'Please enter a valid email address.' }
      setResult(r)
      return r
    }

    setLoading(true)
    setResult(null)

    const { error } = await supabase.from('subscribers').insert({
      email: email.toLowerCase().trim(),
      first_name: firstName?.trim() || null,
      source,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    setLoading(false)

    if (error) {
      // Supabase unique constraint violation code
      if (error.code === '23505') {
        const r: SubscribeResult = { status: 'already-subscribed', message: "You're already on the list." }
        setResult(r)
        return r
      }
      const r: SubscribeResult = { status: 'error', message: 'Something went wrong. Please try again.' }
      setResult(r)
      return r
    }

    const r: SubscribeResult = { status: 'success', message: "You're in. First issue lands next Thursday." }
    setResult(r)
    return r
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setLoading(false)
  }, [])

  return { subscribe, loading, result, reset }
}
