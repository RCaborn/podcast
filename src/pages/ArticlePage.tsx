import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { useArticle, useArticles } from '../hooks/useArticles'
import { usePageTitle } from '../hooks/usePageTitle'
import Tag from '../components/ui/Tag'
import ArticleSubscribeBanner from '../components/articles/ArticleSubscribeBanner'
import type { Article } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Related Card                                                       */
/* ------------------------------------------------------------------ */

function RelatedCard({ article: a }: { article: Article }) {
  return (
    <Link
      to={a.tag === 'Newsletter' ? `/newsletter/${a.slug}` : `/articles/${a.slug}`}
      className="group block p-6 bg-warm-white border border-stone card-hover hover:shadow-lg"
    >
      <Tag variant="outlined" contentType={a.tag as any}>{a.tag}</Tag>
      <h3 className="font-display font-bold text-lg mt-3 leading-snug group-hover:text-sienna transition-colors">
        {a.title}
      </h3>
      <p className="font-body text-[13px] mt-2 leading-relaxed line-clamp-2 text-charcoal/60">
        {a.excerpt}
      </p>
      <p className="font-ui text-[11px] uppercase tracking-wider mt-3 text-slate">
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

  usePageTitle(article?.title)

  if (loading) {
    return (
      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-[680px] px-4 sm:px-6">
          <div className="skeleton h-5 w-24 mb-6" />
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-3/4 mt-2" />
          <div className="skeleton h-4 w-48 mt-4" />
          <div className="w-16 h-[2px] bg-stone mt-6" />
          <div className="mt-10 space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-4 w-full" />
            ))}
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      </article>
    )
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-display text-2xl">Article not found</p>
        <Link to="/" className="font-ui text-sm uppercase tracking-wider text-terracotta hover:text-sienna">
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
            <Tag variant="filled" contentType={article.tag as any}>{article.tag}</Tag>
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

        {/* Terracotta rule */}
        <div className="w-16 h-[2px] bg-terracotta mt-6" />
      </header>

      {/* Body */}
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 mt-10 prose-article">
        <Markdown>{article.body ?? ''}</Markdown>
      </div>

      {/* Subscribe banner */}
      <ArticleSubscribeBanner />

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
