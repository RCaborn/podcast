import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Article } from '../types/database'

/** Fetch all articles, ordered by published_at desc. */
export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      const { data, error: err } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })

      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setArticles(data as Article[])
      }
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [])

  return { articles, loading, error }
}

/** Fetch a single article by slug. */
export function useArticle(slug: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetch() {
      const { data, error: err } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (cancelled) return
      if (err) {
        setError(err.message)
      } else {
        setArticle(data as Article)
      }
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [slug])

  return { article, loading, error }
}
