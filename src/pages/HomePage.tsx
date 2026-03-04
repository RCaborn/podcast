import { Link } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import Eyebrow from '../components/ui/Eyebrow'
import Tag from '../components/ui/Tag'
import Avatar from '../components/ui/Avatar'
import { useArticles } from '../hooks/useArticles'
import type { Article } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Card style map for editorial grid                                  */
/* ------------------------------------------------------------------ */

const cardStyles: Record<string, {
  card: string; headline: string; excerpt: string; meta: string; tagClass: string
}> = {
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

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      className="hero-grid relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #fffef9 0%, #f2ede3 50%, #e8f0e5 100%)',
      }}
    >
      <div className="animate-fade-up relative z-10 flex flex-col items-center text-center px-6">
        <Logo size="lg" />
        <p className="font-display italic text-charcoal/60 text-lg sm:text-xl mt-6">
          For independents who give a damn.
        </p>
        <p className="font-ui uppercase text-charcoal/35 text-xs tracking-[0.2em] mt-3">
          The home of independent food retail
        </p>
      </div>

      <div className="animate-scroll-pulse absolute bottom-10 flex flex-col items-center gap-2 z-10">
        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.3em] text-ochre-600">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-ochre-600 to-transparent" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Featured Newsletter Banner (data-driven)                           */
/* ------------------------------------------------------------------ */

function NewsletterBanner({ article }: { article: Article }) {
  const issueLabel = article.issue_number
    ? `Counter Culture Weekly · Issue ${String(article.issue_number).padStart(3, '0')}`
    : 'Counter Culture Weekly'

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div
        className="relative overflow-hidden p-8 sm:p-12"
        style={{
          background: 'linear-gradient(135deg, #e8973a 0%, #d4603a 100%)',
        }}
      >
        <span
          className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 font-display text-[180px] leading-none text-white/10 select-none pointer-events-none"
          aria-hidden="true"
        >
          CC
        </span>

        <div className="relative z-10 max-w-xl">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-cream/75">
            {issueLabel}
          </p>
          <h2 className="font-display font-bold text-cream text-2xl sm:text-3xl mt-4 max-w-[500px] leading-snug">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="font-body text-sm text-cream/80 mt-4 max-w-md leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <Link
            to={`/newsletter/${article.slug}`}
            className="inline-flex items-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-cream text-charcoal px-6 py-3 mt-6 hover:bg-cream/90 transition-colors"
          >
            Read this week&rsquo;s issue &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Editorial Grid (data-driven)                                       */
/* ------------------------------------------------------------------ */

function EditorialGrid({ articles }: { articles: Article[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((a) => {
          const key = a.card_style ?? 'light'
          const s = cardStyles[key] ?? cardStyles.light
          const isOchre = key === 'ochre-gradient'
          const isDark = key === 'forest' || isOchre

          return (
            <Link
              key={a.id}
              to={a.tag === 'Newsletter' ? `/newsletter/${a.slug}` : `/articles/${a.slug}`}
              className={`block p-8 transition-shadow hover:shadow-lg ${s.card}`}
              style={isOchre ? { background: 'linear-gradient(135deg, #e8973a 0%, #d4603a 100%)' } : undefined}
            >
              {isDark ? (
                <span className={`inline-block font-ui text-xs font-semibold uppercase tracking-wider px-3 py-1 ${s.tagClass}`}>
                  {a.tag}
                </span>
              ) : (
                <Tag variant="outlined">{a.tag}</Tag>
              )}
              <h3 className={`font-display font-bold text-xl mt-4 leading-snug ${s.headline}`}>
                {a.title}
              </h3>
              <p className={`font-body text-[13px] mt-3 leading-relaxed ${s.excerpt}`}>
                {a.excerpt}
              </p>
              <p className={`font-ui text-[11px] uppercase tracking-wider mt-4 ${s.meta}`}>
                {a.author_name}
                {a.author_source ? ` · ${a.author_source}` : ''}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Community Preview                                                  */
/* ------------------------------------------------------------------ */

function CommunityPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-cream border border-sand p-8 sm:p-10">
        <Tag variant="outlined">Community &middot; Delis</Tag>

        <p className="font-display italic text-xl mt-6 leading-snug max-w-lg">
          &ldquo;What&rsquo;s the one product you&rsquo;d never drop from your
          counter, no matter what the margin?&rdquo;
        </p>

        <div className="mt-8 space-y-6">
          <div className="flex gap-4">
            <Avatar initials="RC" color="ochre" size="sm" />
            <div>
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
                Rosa Capaldi &middot; Rosa&rsquo;s Deli, Edinburgh
              </p>
              <p className="font-body text-[13px] text-charcoal/70 mt-1 leading-relaxed">
                Our house nduja. Costs me a fortune to make but people drive
                across the city for it. That&rsquo;s the point.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Avatar initials="MW" color="forest" size="sm" />
            <div>
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
                Marcus Webb &middot; The Corner Larder, Bristol
              </p>
              <p className="font-body text-[13px] text-charcoal/70 mt-1 leading-relaxed">
                Proper sourdough from a local baker. We sell it at cost.
                Everything else on the counter sells because of it.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/community"
          className="inline-block font-ui text-sm font-semibold uppercase tracking-[0.15em] text-ochre-600 mt-8 hover:text-ochre-700 transition-colors"
        >
          Join the conversation &rarr;
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Manifesto Section                                                  */
/* ------------------------------------------------------------------ */

function Manifesto() {
  return (
    <section
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f2ede3 0%, #e8f0e5 100%)',
      }}
    >
      <span
        className="absolute left-1/2 -translate-x-1/2 top-6 sm:top-12 font-display text-[280px] sm:text-[400px] leading-none text-charcoal/[0.04] select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <div className="relative z-10 mx-auto max-w-[700px] px-6 text-center">
        <Eyebrow>The Counter Culture Manifesto</Eyebrow>

        <div
          className="font-display mt-8 leading-relaxed"
          style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
        >
          <p>
            The supermarkets have the scale. The algorithms have the data. The
            delivery apps have the convenience.
          </p>
          <p className="mt-6 italic text-forest-800">
            You have something none of them can buy.
          </p>
          <p className="mt-6">
            You know your customers by name. You know where your cheese comes
            from. You built something with your hands that your community
            actually needs.
          </p>
          <p className="mt-6">
            Counter Culture exists for the people behind the counter. The ones
            who give a damn. The ones who aren&rsquo;t going anywhere.
          </p>
        </div>

        <div className="mx-auto w-[60px] h-[2px] bg-ochre-600 mt-10" />

        <p className="font-display italic text-charcoal/60 mt-6 text-lg">
          Counter Culture
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { articles, loading } = useArticles()

  // Latest newsletter for the banner
  const latestNewsletter = articles.find((a) => a.tag === 'Newsletter')

  // Grid: all articles (excluding the featured newsletter) — up to 6
  const gridArticles = latestNewsletter
    ? articles.filter((a) => a.id !== latestNewsletter.id).slice(0, 6)
    : articles.slice(0, 6)

  return (
    <>
      <Hero />
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p className="font-ui text-sm uppercase tracking-wider text-charcoal/40">Loading…</p>
        </div>
      ) : (
        <>
          {latestNewsletter && <NewsletterBanner article={latestNewsletter} />}
          {gridArticles.length > 0 && <EditorialGrid articles={gridArticles} />}
        </>
      )}
      <CommunityPreview />
      <Manifesto />
    </>
  )
}
