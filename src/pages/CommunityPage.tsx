import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useThreads } from '../hooks/useThreads'
import Tag from '../components/ui/Tag'
import Avatar from '../components/ui/Avatar'
import type { ThreadWithMeta } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORIES = ['all', 'delis', 'butchers', 'cheesemongers', 'farm-shops', 'general'] as const
type Category = (typeof CATEGORIES)[number]

const categoryLabels: Record<Category, string> = {
  all: 'All',
  delis: 'Delis',
  butchers: 'Butchers',
  cheesemongers: 'Cheesemongers',
  'farm-shops': 'Farm Shops',
  general: 'General',
}

function mapAvatarColor(c: string | null): 'ochre' | 'forest' | 'charcoal' {
  if (c === 'ochre') return 'ochre'
  if (c === 'forest' || c === 'sage') return 'forest'
  return 'charcoal' // rust, ink, null → charcoal
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

/* ------------------------------------------------------------------ */
/*  Thread Card                                                        */
/* ------------------------------------------------------------------ */

function ThreadCard({ thread: t }: { thread: ThreadWithMeta }) {
  const authorName = t.author?.full_name ?? 'Anonymous'
  const shopName = t.author?.shop_name

  return (
    <Link
      to={`/community/${t.id}`}
      className="block bg-cream border border-sand p-6 sm:p-8 hover:shadow-md transition-shadow"
    >
      <Tag variant="outlined">{categoryLabels[t.category] ?? t.category}</Tag>

      <h3 className="font-display italic text-xl mt-4 leading-snug">
        {t.title}
      </h3>

      <p className="font-ui text-[11px] uppercase tracking-wider text-charcoal/40 mt-3">
        {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'} &middot; {timeAgo(t.created_at)}
      </p>

      <div className="flex items-center gap-3 mt-4">
        <Avatar
          initials={t.author?.avatar_initials ?? '??'}
          color={mapAvatarColor(t.author?.avatar_colour ?? null)}
          size="sm"
        />
        <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
          {authorName}
          {shopName && <> &middot; {shopName}</>}
        </p>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CommunityPage() {
  const { threads, loading } = useThreads()
  const [active, setActive] = useState<Category>('all')

  const filtered = active === 'all'
    ? threads
    : threads.filter((t) => t.category === active)

  return (
    <section className="py-16 sm:py-24">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl">The Counter</h1>
        <div className="w-16 h-[2px] bg-ochre-600 mt-6" />
      </header>

      {/* Category filter tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 font-ui text-xs font-semibold uppercase tracking-wider px-4 py-2 transition-colors ${
                active === cat
                  ? 'bg-charcoal text-cream'
                  : 'border border-charcoal text-charcoal hover:bg-charcoal/5'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="font-ui text-sm uppercase tracking-wider text-charcoal/40">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="font-body text-charcoal/60">No threads yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </div>

      {/* Start a thread — disabled for now */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <button
          disabled
          className="font-ui font-bold uppercase text-sm tracking-[0.2em] bg-forest-800 text-cream px-6 py-3 opacity-50 cursor-not-allowed"
          title="Sign in to start a thread"
        >
          Start a thread
        </button>
        <p className="font-ui text-[11px] uppercase tracking-wider text-charcoal/40 mt-2">
          Sign in to start a thread
        </p>
      </div>
    </section>
  )
}
