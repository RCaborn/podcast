import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { Article } from '../../types/database'

type FilterTab = 'all' | 'published' | 'draft' | 'archived'

export default function ArticlesAdminPage() {
  usePageTitle('Articles — Admin')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: true })
    setArticles((data as Article[]) ?? [])
    setLoading(false)
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
    { key: 'archived', label: 'Archived' },
  ]

  const filtered = articles.filter((a) => {
    if (filter === 'all') return true
    if (filter === 'draft') return a.status === 'draft'
    return a.status === filter
  })

  // Sort: drafts first, then by published_at desc
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'draft' && b.status !== 'draft') return -1
    if (b.status === 'draft' && a.status !== 'draft') return 1
    return (b.published_at ?? '').localeCompare(a.published_at ?? '')
  })

  async function updateStatus(id: string, status: string) {
    const update: Record<string, unknown> = { status }
    if (status === 'published') {
      const article = articles.find((a) => a.id === id)
      if (!article?.published_at) update.published_at = new Date().toISOString()
    }
    await supabase.from('articles').update(update).eq('id', id)
    setMenuOpen(null)
    loadArticles()
  }

  async function deleteArticle(id: string) {
    await supabase.from('articles').delete().eq('id', id)
    setConfirmDelete(null)
    setMenuOpen(null)
    loadArticles()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-bold text-3xl text-ink">Articles</h1>
        <Link
          to="/admin/articles/new"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-ink text-warm-white py-3 px-6 hover:bg-charcoal transition-colors"
        >
          New Article
        </Link>
      </div>
      <div className="h-[2px] bg-terracotta w-12 mt-3" />

      {/* Filter tabs */}
      <div className="flex gap-1 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`font-ui text-[11px] font-semibold uppercase tracking-[0.2em] py-2 px-4 transition-colors ${
              filter === tab.key
                ? 'bg-ink text-warm-white'
                : 'text-slate hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Article list */}
      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-14" />)}
        </div>
      ) : (
        <div className="mt-6 divide-y divide-ink/6">
          {sorted.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 py-4 px-3 hover:bg-cream transition-colors relative"
            >
              {/* Status dot */}
              <span
                className={`w-2 h-2 shrink-0 ${
                  a.status === 'published'
                    ? 'bg-olive'
                    : a.status === 'draft'
                    ? 'bg-brass'
                    : 'bg-slate/40'
                }`}
                title={a.status}
              />

              {/* Title */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/admin/articles/${a.id}/edit`}
                  className="font-display font-bold text-[16px] text-ink hover:text-sienna transition-colors truncate block"
                >
                  {a.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {a.tag && (
                    <span className="font-ui text-[10px] uppercase tracking-[0.15em] text-slate">
                      {a.tag}
                    </span>
                  )}
                  {a.author_name && (
                    <span className="font-body text-[12px] text-slate/60">
                      {a.author_name}
                    </span>
                  )}
                  <span className="font-body text-[12px] text-slate/40">
                    {a.published_at
                      ? new Date(a.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Draft'}
                  </span>
                  {a.featured_position && (
                    <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-terracotta border border-terracotta/30 px-2 py-0.5">
                      {a.featured_position}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === a.id ? null : a.id)}
                  className="p-2 text-slate hover:text-ink transition-colors font-body text-lg"
                  aria-label="Actions"
                >
                  &hellip;
                </button>

                {menuOpen === a.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(null)} />
                    <div className="absolute right-0 top-10 z-40 bg-parchment border border-ink/10 shadow-lg w-48">
                      <Link
                        to={`/admin/articles/${a.id}/edit`}
                        className="block font-ui text-[11px] uppercase tracking-[0.15em] px-4 py-3 hover:bg-cream transition-colors"
                        onClick={() => setMenuOpen(null)}
                      >
                        Edit
                      </Link>
                      {a.status !== 'published' && (
                        <button
                          onClick={() => updateStatus(a.id, 'published')}
                          className="w-full text-left font-ui text-[11px] uppercase tracking-[0.15em] px-4 py-3 hover:bg-cream transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      {a.status === 'published' && (
                        <button
                          onClick={() => updateStatus(a.id, 'draft')}
                          className="w-full text-left font-ui text-[11px] uppercase tracking-[0.15em] px-4 py-3 hover:bg-cream transition-colors"
                        >
                          Unpublish
                        </button>
                      )}
                      {a.status !== 'archived' && (
                        <button
                          onClick={() => updateStatus(a.id, 'archived')}
                          className="w-full text-left font-ui text-[11px] uppercase tracking-[0.15em] px-4 py-3 hover:bg-cream transition-colors"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => { setConfirmDelete(a.id); setMenuOpen(null) }}
                        className="w-full text-left font-ui text-[11px] uppercase tracking-[0.15em] px-4 py-3 text-sienna hover:bg-cream transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <p className="font-body text-slate py-8 text-center">No articles found.</p>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-8 max-w-sm w-full">
            <h3 className="font-display font-bold text-xl">Delete article?</h3>
            <p className="font-body text-[14px] text-slate mt-2">
              This can&rsquo;t be undone. The article will be permanently removed.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] border border-ink/10 py-2.5 px-5 hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteArticle(confirmDelete)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-sienna text-warm-white py-2.5 px-5 hover:bg-terracotta transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
