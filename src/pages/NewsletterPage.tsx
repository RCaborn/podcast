import { Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { usePageTitle } from '../hooks/usePageTitle'
import NewsletterSubscribePanel from '../components/newsletter/NewsletterSubscribePanel'
import type { Article } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Issue Card                                                         */
/* ------------------------------------------------------------------ */

function IssueCard({ article: a }: { article: Article }) {
  const publishedDate = a.published_at
    ? new Date(a.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Link
      to={`/newsletter/${a.slug}`}
      className="group block p-6 sm:p-10 bg-warm-white border border-stone card-hover hover:shadow-lg"
    >
      {a.issue_number != null && (
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
          Issue {String(a.issue_number).padStart(3, '0')}
        </p>
      )}

      <h2 className="font-display font-bold text-xl sm:text-2xl mt-3 leading-snug group-hover:text-sienna transition-colors">
        {a.title}
      </h2>

      <p className="font-ui text-[11px] uppercase tracking-wider mt-4 text-slate">
        {publishedDate}
        {a.read_time && <> &middot; {a.read_time} min read</>}
      </p>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NewsletterPage() {
  usePageTitle('The Weekly')

  const { articles, loading } = useArticles()

  const newsletters = articles
    .filter((a) => a.tag === 'Newsletter')
    .sort((a, b) => (b.issue_number ?? 0) - (a.issue_number ?? 0))

  return (
    <section className="py-16 sm:py-24">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="font-display font-bold text-4xl sm:text-5xl">The Weekly</h1>
        <p className="font-display italic text-charcoal/60 text-lg mt-3">
          Every week, one issue. No filler.
        </p>
        <div className="w-16 h-[2px] bg-terracotta mt-6" />
      </header>

      {/* Subscribe panel */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <NewsletterSubscribePanel />
      </div>

      {/* Issue list */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-6 sm:p-10 bg-warm-white border border-stone">
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-7 w-3/4 mt-3" />
                <div className="skeleton h-3 w-40 mt-4" />
              </div>
            ))}
          </div>
        ) : newsletters.length === 0 ? (
          <p className="font-body text-charcoal/60">No issues yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {newsletters.map((a) => (
              <IssueCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
