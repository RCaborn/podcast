import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import SectionHeader from '../../components/ui/SectionHeader'
import Button from '../../components/ui/Button'
import Tag from '../../components/ui/Tag'
import { useAdminArticles } from '../../hooks/useAdminArticles'
import { useArticleMutations } from '../../hooks/useAdminArticles'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminArticles() {
  usePageTitle('Admin — Articles')

  const { articles, loading, error, refetch } = useAdminArticles()
  const { deleteArticle } = useArticleMutations()

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    const { error: err } = await deleteArticle(id)
    if (err) {
      alert(err)
    } else {
      refetch()
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="flex gap-4 mb-8">
          <Link to="/admin" className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 hover:text-charcoal">
            Dashboard
          </Link>
          <span className="text-charcoal/20">/</span>
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal">
            Articles
          </span>
        </nav>

        <div className="flex items-end justify-between gap-4">
          <SectionHeader eyebrow="Admin" title="Articles" />
          <Link to="/admin/articles/new">
            <Button>New Article</Button>
          </Link>
        </div>

        {loading && (
          <p className="font-body text-charcoal/50 mt-8">Loading…</p>
        )}

        {error && (
          <p className="font-body text-sm text-red-600 mt-8">{error}</p>
        )}

        {!loading && !error && (
          <div className="mt-10 divide-y divide-charcoal/10">
            {articles.map((article) => (
              <div key={article.id} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-body font-medium text-charcoal truncate">
                      {article.title}
                    </h3>
                    {article.tag && <Tag variant="outlined">{article.tag}</Tag>}
                  </div>
                  <p className="font-ui text-xs text-charcoal/40 mt-1">
                    {formatDate(article.published_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/admin/articles/${article.id}/edit`}
                    className="font-ui text-xs font-semibold uppercase tracking-wider text-ochre-600 hover:text-ochre-700"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id, article.title)}
                    className="font-ui text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {articles.length === 0 && (
              <p className="font-body text-charcoal/50 py-8 text-center">
                No articles yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
