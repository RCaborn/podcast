import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useThreads } from '../hooks/useThreads'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { supabase } from '../lib/supabase'
import Tag from '../components/ui/Tag'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import type { ThreadWithMeta } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORIES = ['all', 'delis', 'butchers', 'cheesemongers', 'farm-shops', 'general'] as const
type Category = (typeof CATEGORIES)[number]

const THREAD_CATEGORIES = CATEGORIES.filter((c) => c !== 'all') as Exclude<Category, 'all'>[]

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
  return 'charcoal'
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
      className="block bg-cream border border-sand p-5 sm:p-8 card-hover hover:shadow-md"
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
/*  New Thread Form                                                    */
/* ------------------------------------------------------------------ */

const inputClass =
  'w-full font-body text-sm p-3 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 focus:border-ochre-600 focus:ring-1 focus:ring-ochre-600 focus:outline-none'

function NewThreadForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Exclude<Category, 'all'>>('general')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !title.trim()) return

    setSubmitting(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('threads')
      .insert({
        title: title.trim(),
        category,
        author_id: user.id,
      })
      .select('id')
      .single()

    setSubmitting(false)

    if (err) {
      setError(err.message)
      return
    }

    navigate(`/community/${(data as { id: string }).id}`)
  }

  return (
    <div className="bg-cream border border-sand p-6 sm:p-8">
      <h3 className="font-display font-bold text-lg mb-4">Start a new thread</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5">
            Your question or topic
          </label>
          <textarea
            rows={3}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className={inputClass + ' resize-y'}
          />
        </div>

        <div>
          <label className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Exclude<Category, 'all'>)}
            className={inputClass}
          >
            {THREAD_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="font-body text-sm text-red-600">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? 'Posting…' : 'Post Thread'}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CommunityPage() {
  usePageTitle('The Counter')

  const { threads, loading } = useThreads()
  const { user } = useAuth()
  const [active, setActive] = useState<Category>('all')
  const [showNewThread, setShowNewThread] = useState(false)

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

      {/* Start a thread */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        {user ? (
          showNewThread ? (
            <NewThreadForm onClose={() => setShowNewThread(false)} />
          ) : (
            <Button onClick={() => setShowNewThread(true)}>
              Start a thread
            </Button>
          )
        ) : (
          <Link
            to="/join"
            className="inline-flex items-center justify-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-forest-800 text-cream px-6 py-3 hover:bg-forest-700 transition-colors"
          >
            Join to start a thread
          </Link>
        )}
      </div>

      {/* Thread list */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-5 sm:p-8 bg-cream border border-sand">
                <div className="skeleton h-5 w-16" />
                <div className="skeleton h-6 w-3/4 mt-4" />
                <div className="skeleton h-3 w-32 mt-3" />
                <div className="flex items-center gap-3 mt-4">
                  <div className="skeleton w-8 h-8 rounded-full" />
                  <div className="skeleton h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
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
    </section>
  )
}
