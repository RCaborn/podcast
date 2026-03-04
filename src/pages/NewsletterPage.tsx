import { Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { usePageTitle } from '../hooks/usePageTitle'
import type { Article } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Card style helpers                                                 */
/* ------------------------------------------------------------------ */

const styleMap: Record<string, { card: string; eyebrow: string; headline: string; date: string }> = {
  'ochre-gradient': {
    card: 'text-cream',
    eyebrow: 'text-cream/60',
    headline: 'text-cream',
    date: 'text-cream/50',
  },
  forest: {
    card: 'bg-forest-800 text-cream',
    eyebrow: 'text-cream/60',
    headline: 'text-cream',
    date: 'text-cream/50',
  },
  light: {
    card: 'bg-cream text-charcoal border border-sand',
    eyebrow: 'text-ochre-600',
    headline: 'text-charcoal',
    date: 'text-charcoal/40',
  },
  cream: {
    card: 'bg-ochre-50 text-charcoal',
    eyebrow: 'text-ochre-600',
    headline: 'text-charcoal',
    date: 'text-charcoal/40',
  },
}

function IssueCard({ article: a }: { article: Article }) {
  const key = a.card_style ?? 'light'
  const s = styleMap[key] ?? styleMap.light
  const isOchre = key === 'ochre-gradient'

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
      className={`block p-6 sm:p-10 card-hover hover:shadow-lg ${s.card}`}
      style={isOchre ? { background: 'linear-gradient(135deg, #e8973a 0%, #d4603a 100%)' } : undefined}
    >
      {a.issue_number != null && (
        <p className={`font-ui text-xs font-semibold uppercase tracking-[0.15em] ${s.eyebrow}`}>
          Issue {String(a.issue_number).padStart(3, '0')}
        </p>
      )}

      <h2 className={`font-display font-bold text-xl sm:text-2xl mt-3 leading-snug ${s.headline}`}>
        {a.title}
      </h2>

      <p className={`font-ui text-[11px] uppercase tracking-wider mt-4 ${s.date}`}>
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
        <div className="w-16 h-[2px] bg-ochre-600 mt-6" />
      </header>

      {/* Issue list */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-6 sm:p-10 bg-cream border border-sand">
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
