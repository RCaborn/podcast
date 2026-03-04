import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { useArticle, useArticles } from '../hooks/useArticles'
import Tag from '../components/ui/Tag'
import type { Article } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Card style helpers (reused by the "More from CC" section)          */
/* ------------------------------------------------------------------ */

const styleMap: Record<string, { card: string; headline: string; excerpt: string; meta: string; tagClass: string }> = {
  forest: {
    card: 'bg-forest-800 text-cream',
    headline: 'text-cream',
    excerpt: 'text-cream/60',
    meta: 'text-cream/40',
    tagClass: 'bg-ochre-400 text-forest-800',
  },
  'ochre-gradient': {
    card: 'text-cream',
    headline: 'text-cream',
    excerpt: 'text-cream/70',
    meta: 'text-cream/50',
    tagClass: 'bg-cream/20 text-cream',
  },
  light: {
    card: 'bg-cream text-charcoal border border-sand',
    headline: 'text-charcoal',
    excerpt: 'text-charcoal/60',
    meta: 'text-charcoal/40',
    tagClass: '',
  },
  cream: {
    card: 'bg-ochre-50 text-charcoal',
    headline: 'text-charcoal',
    excerpt: 'text-charcoal/60',
    meta: 'text-charcoal/40',
    tagClass: '',
  },
}

function RelatedCard({ article: a }: { article: Article }) {
  const key = a.card_style ?? 'light'
  const s = styleMap[key] ?? styleMap.light
  const isOchre = key === 'ochre-gradient'
  const isDark = key === 'forest' || isOchre

  return (
    <Link
      to={a.tag === 'Newsletter' ? `/newsletter/${a.slug}` : `/articles/${a.slug}`}
      className={`block p-6 transition-shadow hover:shadow-lg ${s.card}`}
      style={isOchre ? { background: 'linear-gradient(135deg, #e8973a 0%, #d4603a 100%)' } : undefined}
    >
      {isDark ? (
        <span className={`inline-block font-ui text-xs font-semibold uppercase tracking-wider px-3 py-1 ${s.tagClass}`}>
          {a.tag}
        </span>
      ) : (
        <Tag variant="outlined">{a.tag}</Tag>
      )}
      <h3 className={`font-display font-bold text-lg mt-3 leading-snug ${s.headline}`}>
        {a.title}
      </h3>
      <p className={`font-body text-[13px] mt-2 leading-relaxed line-clamp-2 ${s.excerpt}`}>
        {a.excerpt}
      </p>
      <p className={`font-ui text-[11px] uppercase tracking-wider mt-3 ${s.meta}`}>
        {a.author_name}{a.author_source ? ` · ${a.author_source}` : ''}
      </p>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { article, loading, error } = useArticle(slug)
  const { articles } = useArticles()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-ui text-sm uppercase tracking-wider text-charcoal/40">Loading…</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-display text-2xl">Article not found</p>
        <Link to="/" className="font-ui text-sm uppercase tracking-wider text-ochre-600 hover:text-ochre-700">
          Back to home
        </Link>
      </div>
    )
  }

  const related = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3)

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="py-16 sm:py-24">
      {/* Header */}
      <header className="mx-auto max-w-[680px] px-4 sm:px-6">
        {article.tag && (
          <div className="mb-6">
            <Tag variant="filled">{article.tag}</Tag>
          </div>
        )}

        <h1
          className="font-display font-black leading-tight"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
        >
          {article.title}
        </h1>

        <p className="font-ui text-[11px] uppercase tracking-wider text-charcoal/50 mt-4">
          {article.author_name}
          {article.author_source && <> &middot; {article.author_source}</>}
          {article.read_time && <> &middot; {article.read_time} min read</>}
          {publishedDate && <> &middot; {publishedDate}</>}
        </p>

        {/* Ochre rule */}
        <div className="w-16 h-[2px] bg-ochre-600 mt-6" />
      </header>

      {/* Body */}
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 mt-10 prose-article">
        <Markdown>{article.body ?? ''}</Markdown>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="font-display font-bold text-2xl mb-8">
            More from Counter Culture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => (
              <RelatedCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
