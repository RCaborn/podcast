import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Article } from '../types/database'

/** Fetch all articles for admin management. */
export function useAdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setArticles(data as Article[])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { articles, loading, error, refetch }
}

/** Fetch a single article by id. */
export function useAdminArticle(id: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null)
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
        .from('articles')
        .select('*')
        .eq('id', id)
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
  }, [id])

  return { article, loading, error }
}

type ArticleFields = Omit<Article, 'id' | 'created_at'>

/** Article create / update / delete mutations. */
export function useArticleMutations() {
  const createArticle = useCallback(async (fields: ArticleFields) => {
    const { data, error } = await supabase
      .from('articles')
      .insert(fields)
      .select()
      .single()
    return { data: data as Article | null, error: error?.message ?? null }
  }, [])

  const updateArticle = useCallback(async (id: string, fields: Partial<ArticleFields>) => {
    const { data, error } = await supabase
      .from('articles')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    return { data: data as Article | null, error: error?.message ?? null }
  }, [])

  const deleteArticle = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    return { error: error?.message ?? null }
  }, [])

  return { createArticle, updateArticle, deleteArticle }
}
