import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Eyebrow from '../components/ui/Eyebrow'
import Tag from '../components/ui/Tag'
import Avatar from '../components/ui/Avatar'
import { useArticles } from '../hooks/useArticles'
import { useThreads } from '../hooks/useThreads'
import { useMemberDirectory } from '../hooks/useMemberDirectory'
import { usePageTitle } from '../hooks/usePageTitle'
import { mapAvatarColor } from '../lib/avatarColor'
import type { Article, ThreadWithMeta } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function articleHref(a: Article) {
  return a.tag === 'Newsletter' ? `/newsletter/${a.slug}` : `/articles/${a.slug}`
}

/* ------------------------------------------------------------------ */
/*  Skeleton loaders                                                   */
/* ------------------------------------------------------------------ */

function FeedSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="skeleton h-6 w-2/3" />
      <div className="skeleton h-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-40" />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  1. Compact Masthead                                                */
/* ------------------------------------------------------------------ */

function CompactMasthead() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <p className="font-display italic text-charcoal text-lg sm:text-xl">
          For independents who give a damn.
        </p>
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          March 2026
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <div className="h-[3px] bg-ink" />
        <div className="h-px bg-ink/10" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Lead Story + Sidebar                                            */
/* ------------------------------------------------------------------ */

function LeadStorySidebar({ lead, sidebar }: { lead: Article; sidebar: Article[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Lead */}
        <Link to={articleHref(lead)} className="group block">
          <Eyebrow rule>
            {lead.tag}
          </Eyebrow>
          <h2
            className="font-display font-black text-ink mt-4 leading-[1.1] group-hover:text-sienna transition-colors"
            style={{ fontSize: 'clamp(30px, 4.2vw, 50px)' }}
          >
            {lead.title}
          </h2>
          {lead.excerpt && (
            <p className="font-body text-charcoal/60 mt-4 max-w-lg leading-relaxed">
              {lead.excerpt}
            </p>
          )}
          <p className="font-ui text-[11px] uppercase tracking-wider text-slate mt-4">
            {lead.author_name}
            {lead.author_source ? ` · ${lead.author_source}` : ''}
            {lead.read_time ? ` · ${lead.read_time} min read` : ''}
          </p>
        </Link>

        {/* Sidebar */}
        <div className="border-l border-stone pl-6 hidden lg:block">
          <h3 className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-charcoal">
            Latest
          </h3>
          <div className="w-8 h-[2px] bg-ink mt-2" />

          <div className="mt-6 space-y-6">
            {sidebar.map((a) => (
              <Link
                key={a.id}
                to={articleHref(a)}
                className="group block hover:translate-x-[3px] transition-transform"
              >
                <Tag variant="filled" contentType={a.tag as any} className="text-[10px]">
                  {a.tag}
                </Tag>
                <h4 className="font-display font-bold text-ink text-sm mt-2 leading-snug group-hover:text-sienna transition-colors">
                  {a.title}
                </h4>
                <p className="font-ui text-[10px] uppercase tracking-wider text-slate mt-1">
                  {a.author_name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  3. Image Feature Row                                               */
/* ------------------------------------------------------------------ */

function ImageFeatureRow({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section className="pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {articles.slice(0, 2).map((a) => (
          <Link
            key={a.id}
            to={articleHref(a)}
            className="group relative block aspect-[4/3] overflow-hidden"
          >
            <img
              src={a.image_url ?? ''}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(44,36,22,0.85) 0%, rgba(44,36,22,0.20) 50%, transparent 100%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <Tag variant="filled" contentType={a.tag as any} className="bg-brass text-warm-white text-[10px]">
                {a.tag}
              </Tag>
              <h3 className="font-display font-bold text-warm-white text-xl sm:text-2xl mt-3 leading-snug">
                {a.title}
              </h3>
              <p className="font-ui text-[11px] uppercase tracking-wider text-warm-white/30 mt-2">
                {a.author_name}
                {a.read_time ? ` · ${a.read_time} min read` : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  4. Newsletter Strip                                                */
/* ------------------------------------------------------------------ */

function NewsletterStrip({ article }: { article: Article }) {
  const issueLabel = article.issue_number
    ? `Counter Culture Weekly · Issue ${String(article.issue_number).padStart(3, '0')}`
    : 'Counter Culture Weekly'

  return (
    <section className="bg-charcoal relative overflow-hidden">
      <span
        className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 font-display text-[180px] leading-none text-white/[0.03] select-none pointer-events-none"
        aria-hidden="true"
      >
        CC
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-brass">
          {issueLabel}
        </p>
        <h2 className="font-display font-bold text-warm-white text-2xl sm:text-3xl mt-4 max-w-[500px] leading-snug">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="font-body text-sm text-warm-white/60 mt-4 max-w-md leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <Link
          to={`/newsletter/${article.slug}`}
          className="inline-flex items-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-warm-white text-ink px-6 py-3 mt-6 hover:bg-cream transition-colors"
        >
          Read this week&rsquo;s issue &rarr;
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  5. Article Trio                                                    */
/* ------------------------------------------------------------------ */

function ArticleTrio({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-ink/6">
        {articles.slice(0, 3).map((a) => (
          <Link
            key={a.id}
            to={articleHref(a)}
            className="group block md:px-6 md:first:pl-0 md:last:pr-0 border-b border-ink/6 pb-8 last:border-b-0 last:pb-0 md:border-b-0 md:pb-0"
          >
            <Tag variant="filled" contentType={a.tag as any} className="text-[10px]">
              {a.tag}
            </Tag>
            <h3 className="font-display font-bold text-ink text-lg mt-3 leading-snug group-hover:text-sienna transition-colors">
              {a.title}
            </h3>
            {a.excerpt && (
              <p className="font-body text-[13px] text-charcoal/60 mt-2 leading-relaxed line-clamp-3">
                {a.excerpt}
              </p>
            )}
            <p className="font-ui text-[10px] uppercase tracking-wider text-slate mt-3">
              {a.author_name}
              {a.read_time ? ` · ${a.read_time} min` : ''}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  6. Community Thread (inline)                                       */
/* ------------------------------------------------------------------ */

function CommunityThread({ thread }: { thread: ThreadWithMeta }) {
  const isPrompt = thread.is_weekly_prompt

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex gap-6">
        {/* Vertical marker */}
        <div className="hidden sm:flex flex-col items-center">
          <span
            className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-olive border-r-2 border-olive pr-3"
            style={{ writingMode: 'vertical-rl' }}
          >
            {isPrompt ? 'This Week' : 'Community'}
          </span>
        </div>

        <div className="flex-1">
          {isPrompt ? (
            <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.28em] text-terracotta">
              Weekly Prompt
            </span>
          ) : (
            <Tag variant="outlined" contentType="Community" className="text-[10px]">
              {thread.tags?.[0] ?? thread.category ?? 'Community'}
            </Tag>
          )}

          <p className="font-display italic text-xl sm:text-2xl mt-4 leading-snug max-w-lg">
            &ldquo;{thread.title}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 mt-6">
            <Avatar
              initials={thread.author?.avatar_initials ?? '??'}
              color={mapAvatarColor(thread.author?.avatar_colour ?? null)}
              size="sm"
            />
            <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
              {thread.author?.full_name ?? 'Anonymous'}
              {thread.author?.shop_name && <> &middot; {thread.author.shop_name}</>}
            </p>
          </div>

          <p className="font-ui text-[11px] uppercase tracking-wider text-charcoal/40 mt-3">
            {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
          </p>

          <Link
            to={`/community/${thread.id}`}
            className="inline-block font-ui text-sm font-semibold uppercase tracking-[0.15em] text-olive mt-4 hover:text-olive-muted transition-colors"
          >
            Join the conversation &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  7. Opinion Pull-Quote + Aside Card                                 */
/* ------------------------------------------------------------------ */

function OpinionPullQuote({ opinion, aside }: { opinion: Article | null; aside: Article | null }) {
  if (!opinion) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Quote */}
        <Link to={articleHref(opinion)} className="group block border-l-[3px] border-terracotta pl-6 sm:pl-8">
          <p
            className="font-display italic leading-snug group-hover:text-sienna transition-colors"
            style={{ fontSize: 'clamp(20px, 3vw, 32px)' }}
          >
            &ldquo;{opinion.excerpt}&rdquo;
          </p>
          <p className="font-ui text-[11px] uppercase tracking-wider text-slate mt-4">
            {opinion.author_name}
            {opinion.read_time ? ` · ${opinion.read_time} min read` : ''}
          </p>
        </Link>

        {/* Aside card */}
        {aside && (
          <Link
            to={articleHref(aside)}
            className="group block bg-charcoal p-6"
          >
            <Tag variant="filled" contentType={aside.tag as any} className="bg-brass text-warm-white text-[10px]">
              {aside.tag}
            </Tag>
            <h3 className="font-display font-bold text-warm-white text-lg mt-3 leading-snug group-hover:text-cream transition-colors">
              {aside.title}
            </h3>
            <p className="font-body text-[13px] text-warm-white/50 mt-2 leading-relaxed line-clamp-3">
              {aside.excerpt}
            </p>
          </Link>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  8. Second Community Strip                                          */
/* ------------------------------------------------------------------ */

function SecondCommunityStrip({ thread }: { thread: ThreadWithMeta | null }) {
  if (!thread) return null

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-olive shrink-0">
            Community
          </span>
          <div className="hidden sm:block w-px h-8 bg-stone" />
          <p className="font-display italic text-lg leading-snug flex-1">
            &ldquo;{thread.title}&rdquo;
          </p>
          <span className="font-ui text-[11px] uppercase tracking-wider text-slate shrink-0">
            {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  9. Bottom Article Duo                                              */
/* ------------------------------------------------------------------ */

function BottomArticleDuo({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.slice(0, 2).map((a) => (
          <Link
            key={a.id}
            to={articleHref(a)}
            className="group block pb-6 border-b border-ink/6"
          >
            <Tag variant="filled" contentType={a.tag as any} className="text-[10px]">
              {a.tag}
            </Tag>
            <h3 className="font-display font-bold text-ink text-xl mt-3 leading-snug group-hover:text-sienna transition-colors">
              {a.title}
            </h3>
            {a.excerpt && (
              <p className="font-body text-[13px] text-charcoal/60 mt-2 leading-relaxed line-clamp-2">
                {a.excerpt}
              </p>
            )}
            <p className="font-ui text-[10px] uppercase tracking-wider text-slate mt-3">
              {a.author_name}
              {a.read_time ? ` · ${a.read_time} min` : ''}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  10. New Member Teaser                                              */
/* ------------------------------------------------------------------ */

function NewMemberTeaser() {
  const { members } = useMemberDirectory()

  if (members.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/directory" className="flex items-center gap-4 group">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((m) => (
            <img
              key={m.id}
              src={m.shop_photo_url ?? ''}
              alt=""
              className="w-12 h-12 object-cover"
              loading="lazy"
            />
          ))}
        </div>
        <p className="font-ui text-xs text-slate group-hover:text-ink transition-colors">
          {members.length} {members.length === 1 ? 'independent has' : 'independents have'} joined.{' '}
          <span className="text-terracotta">View the directory &rarr;</span>
        </p>
      </Link>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  11. Join Banner                                                    */
/* ------------------------------------------------------------------ */

function JoinBanner() {
  return (
    <section className="grid-paper bg-stone">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
        <h2
          className="font-display font-black"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          Pull up a stool.
        </h2>
        <p className="font-display italic text-slate text-lg sm:text-xl mt-4 max-w-md mx-auto">
          Join the community of independents who give a damn.
        </p>
        <Link
          to="/join"
          className="inline-flex items-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-ink text-warm-white px-8 py-4 mt-8 hover:bg-charcoal transition-colors"
        >
          Join Counter Culture
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  usePageTitle()

  useEffect(() => {
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = 'Counter Culture — the home of independent food retail. Articles, newsletters, and community for independents who give a damn.'
    return () => { if (meta) meta.content = '' }
  }, [])

  const { articles, loading: articlesLoading } = useArticles()
  const { threads, loading: threadsLoading } = useThreads()

  if (articlesLoading || threadsLoading) {
    return <FeedSkeleton />
  }

  // Partition articles
  const latestNewsletter = articles.find((a) => a.tag === 'Newsletter')
  const featuredArticles = articles.filter((a) => a.is_featured && a.image_url)
  const opinions = articles.filter((a) => a.tag === 'Opinion')
  // Lead = first article (newest)
  const lead = articles[0]
  const sidebarArticles = articles.filter((a) => a.id !== lead?.id).slice(0, 3)

  // Articles for trio and duo (excluding lead, featured, newsletter)
  const usedIds = new Set([lead?.id, latestNewsletter?.id, ...featuredArticles.map((a) => a.id)])
  const otherArticles = articles.filter((a) => !usedIds.has(a.id))
  const trioArticles = otherArticles.slice(0, 3)
  const duoArticles = otherArticles.slice(3, 5)

  // Threads — prefer weekly prompt as the featured thread
  const weeklyPrompt = threads.find((t) => t.is_weekly_prompt)
  const firstThread = weeklyPrompt ?? threads[0] ?? null
  const secondThread = threads.find((t) => t.id !== firstThread?.id) ?? null

  return (
    <>
      <CompactMasthead />
      {lead && <LeadStorySidebar lead={lead} sidebar={sidebarArticles} />}
      <ImageFeatureRow articles={featuredArticles} />
      {latestNewsletter && <NewsletterStrip article={latestNewsletter} />}
      <ArticleTrio articles={trioArticles} />
      {firstThread && <CommunityThread thread={firstThread} />}
      <OpinionPullQuote opinion={opinions[0] ?? null} aside={opinions[1] ?? null} />
      <SecondCommunityStrip thread={secondThread} />
      <BottomArticleDuo articles={duoArticles} />
      <NewMemberTeaser />
      <JoinBanner />
    </>
  )
}
