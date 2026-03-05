import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useThreads, useToggleReaction } from '../hooks/useThreads'
import { useNotices } from '../hooks/useNotices'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { supabase } from '../lib/supabase'
import { mapAvatarColor } from '../lib/avatarColor'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Eyebrow from '../components/ui/Eyebrow'
import type { ThreadWithMeta, Notice } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Constants & Helpers                                                */
/* ------------------------------------------------------------------ */

const TAGS = ['all', 'suppliers', 'equipment', 'staffing', 'range', 'margins', 'first-year', 'seasonal'] as const
type TagFilter = (typeof TAGS)[number]

const NOTICE_TYPES = ['all', 'supplier-rec', 'equipment-for-sale', 'staff-wanted'] as const
type NoticeFilter = (typeof NOTICE_TYPES)[number]

const noticeTypeLabels: Record<string, string> = {
  'all': 'All',
  'supplier-rec': 'Suppliers',
  'equipment-for-sale': 'Equipment',
  'staff-wanted': 'Staff',
  'other': 'Other',
}

const noticeTypeColors: Record<string, string> = {
  'supplier-rec': 'text-brass',
  'equipment-for-sale': 'text-slate',
  'staff-wanted': 'text-olive',
  'other': 'text-slate',
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
/*  Weekly Prompt Card                                                 */
/* ------------------------------------------------------------------ */

function WeeklyPromptCard({ thread }: { thread: ThreadWithMeta }) {
  return (
    <Link to={`/community/${thread.id}`} className="block bg-charcoal p-6 sm:p-8 relative overflow-hidden mb-8">
      <span
        className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 font-display text-[120px] leading-none text-white/[0.03] select-none pointer-events-none"
        aria-hidden="true"
      >
        CC
      </span>
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.28em] text-terracotta relative z-10">
        This week&rsquo;s question
      </p>
      <p
        className="font-display italic text-warm-white mt-3 leading-snug relative z-10"
        style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}
      >
        {thread.title}
      </p>
      <p className="font-body text-[13px] text-warm-white/50 mt-3 relative z-10">
        From this week&rsquo;s newsletter.
      </p>
      <p className="font-ui text-[11px] uppercase tracking-wider text-terracotta mt-4 relative z-10">
        {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'} &middot; Join the conversation &rarr;
      </p>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Tag Filter Bar                                                     */
/* ------------------------------------------------------------------ */

function TagFilterBar({ active, onChange }: { active: TagFilter; onChange: (t: TagFilter) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 mb-6">
      {TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={`shrink-0 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] px-4 py-2 transition-colors ${
            active === tag
              ? 'bg-ink text-warm-white'
              : 'border border-ink/20 text-slate hover:bg-ink/5'
          }`}
        >
          {tag === 'all' ? 'All' : tag.replace('-', ' ')}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Thread Card                                                        */
/* ------------------------------------------------------------------ */

function ThreadCard({ thread: t }: { thread: ThreadWithMeta }) {
  const { user } = useAuth()
  const { toggle } = useToggleReaction()
  const [reactions, setReactions] = useState(t.reactions ?? [])

  const sameHereCount = reactions.filter((r) => r.type === 'same-here').length
  const usefulCount = reactions.filter((r) => r.type === 'useful').length
  const userSameHere = user ? reactions.some((r) => r.type === 'same-here' && r.author_id === user.id) : false
  const userUseful = user ? reactions.some((r) => r.type === 'useful' && r.author_id === user.id) : false

  async function handleReaction(type: 'same-here' | 'useful') {
    if (!user) return
    const added = await toggle(t.id, user.id, type)
    if (added) {
      setReactions((prev) => [...prev, { id: crypto.randomUUID(), thread_id: t.id, author_id: user.id, type, created_at: new Date().toISOString() }])
    } else {
      setReactions((prev) => prev.filter((r) => !(r.type === type && r.author_id === user.id)))
    }
  }

  const authorName = t.author?.full_name ?? 'Anonymous'
  const shopName = t.author?.shop_name
  const region = t.author?.region

  return (
    <div className="bg-parchment border-b border-ink/8 py-5">
      <Link to={`/community/${t.id}`} className="block group">
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/profile/${t.author_id}`} onClick={(e) => e.stopPropagation()}>
            {t.author?.face_photo_url ? (
              <img
                src={t.author.face_photo_url}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <Avatar
                initials={t.author?.avatar_initials ?? '??'}
                color={mapAvatarColor(t.author?.avatar_colour ?? null)}
                size="sm"
              />
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/70 truncate">
              {authorName}
              {shopName && <> &middot; {shopName}</>}
              {region && <> &middot; {region}</>}
            </p>
          </div>
          {t.tags.length > 0 && (
            <div className="hidden sm:flex gap-1.5">
              {t.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="font-ui text-[10px] uppercase tracking-[0.15em] border border-ink/15 text-slate px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <h3 className="font-display italic text-[19px] text-ink leading-snug group-hover:text-sienna transition-colors duration-150">
          {t.is_pinned && <span className="font-ui text-[10px] uppercase tracking-[0.15em] text-olive not-italic mr-2">Pinned</span>}
          {t.is_locked && <span className="font-ui text-[10px] uppercase tracking-[0.15em] text-brass not-italic mr-2">Locked</span>}
          {t.title}
        </h3>
      </Link>

      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={() => handleReaction('same-here')}
          disabled={!user}
          className={`font-ui text-[11px] uppercase tracking-[0.15em] border py-1.5 px-3 transition-colors ${
            userSameHere
              ? 'bg-olive/10 text-olive border-olive/30'
              : 'border-ink/15 text-slate hover:border-olive/30'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Same here {sameHereCount > 0 && sameHereCount}
        </button>
        <button
          onClick={() => handleReaction('useful')}
          disabled={!user}
          className={`font-ui text-[11px] uppercase tracking-[0.15em] border py-1.5 px-3 transition-colors ${
            userUseful
              ? 'bg-brass/10 text-brass border-brass/30'
              : 'border-ink/15 text-slate hover:border-brass/30'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Useful {usefulCount > 0 && usefulCount}
        </button>
        <span className="font-ui text-[11px] uppercase tracking-wider text-ink/40 ml-auto">
          {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'} &middot; {timeAgo(t.created_at)}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  New Thread Form                                                    */
/* ------------------------------------------------------------------ */

const inputClass =
  'w-full font-body text-sm p-3 border border-ink/20 bg-parchment text-ink placeholder:text-ink/30 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none'

function NewThreadForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !title.trim()) return

    setSubmitting(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('threads')
      .insert({
        title: title.trim(),
        tags: selectedTags,
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
    <div className="bg-cream p-6 sm:p-8 mb-6">
      <h3 className="font-display font-bold text-lg mb-4">Start a new thread</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-ui text-xs font-semibold uppercase tracking-wider text-ink/60 block mb-1.5">
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
          <label className="font-ui text-xs font-semibold uppercase tracking-wider text-ink/60 block mb-1.5">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.filter((t) => t !== 'all').map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`font-ui text-[10px] font-semibold uppercase tracking-[0.22em] px-3 py-1.5 transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-ink text-warm-white'
                    : 'border border-ink/20 text-slate'
                }`}
              >
                {tag.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="font-body text-sm text-red-600">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? 'Posting...' : 'Post to the Counter'}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="font-ui text-xs font-semibold uppercase tracking-wider text-ink/50 hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  New Notice Form                                                    */
/* ------------------------------------------------------------------ */

function NewNoticeForm({ onClose, onPosted }: { onClose: () => void; onPosted: () => void }) {
  const { user } = useAuth()

  const [type, setType] = useState<Notice['type']>('supplier-rec')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [location, setLocation] = useState('')
  const [contactHint, setContactHint] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !title.trim() || !body.trim()) return

    setSubmitting(true)
    setError(null)

    const { error: err } = await supabase
      .from('notices')
      .insert({
        author_id: user.id,
        type,
        title: title.trim(),
        body: body.trim(),
        location: location.trim() || null,
        contact_hint: contactHint.trim() || null,
      })

    setSubmitting(false)

    if (err) {
      setError(err.message)
      return
    }

    onPosted()
    onClose()
  }

  return (
    <div className="bg-cream p-5 mb-4">
      <h4 className="font-display font-bold text-sm mb-3">Post a notice</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select value={type} onChange={(e) => setType(e.target.value as Notice['type'])} className={inputClass + ' text-xs'}>
          <option value="supplier-rec">Supplier Rec</option>
          <option value="equipment-for-sale">Equipment for Sale</option>
          <option value="staff-wanted">Staff Wanted</option>
          <option value="other">Other</option>
        </select>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className={inputClass + ' text-xs'} />
        <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details..." required className={inputClass + ' text-xs resize-y'} />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (optional)" className={inputClass + ' text-xs'} />
        <input type="text" value={contactHint} onChange={(e) => setContactHint(e.target.value)} placeholder="Contact hint (optional)" className={inputClass + ' text-xs'} />
        {error && <p className="font-body text-xs text-red-600">{error}</p>}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting || !title.trim() || !body.trim()} variant="primary">
            {submitting ? 'Posting...' : 'Post Notice'}
          </Button>
          <button type="button" onClick={onClose} className="font-ui text-[10px] uppercase tracking-wider text-ink/50 hover:text-ink">Cancel</button>
        </div>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Notice Card                                                        */
/* ------------------------------------------------------------------ */

function NoticeCard({ notice: n }: { notice: Notice }) {
  return (
    <div className="bg-cream py-4 border-b border-ink/6 last:border-b-0">
      <span className={`font-ui text-[10px] font-semibold uppercase tracking-[0.15em] ${noticeTypeColors[n.type] ?? 'text-slate'}`}>
        {noticeTypeLabels[n.type] ?? n.type}
      </span>
      <h4 className="font-body font-semibold text-sm text-ink mt-1 leading-snug">
        {n.title}
      </h4>
      <p className="font-body text-[13px] text-slate mt-1 leading-relaxed line-clamp-2">
        {n.body}
      </p>
      <div className="flex items-center gap-2 mt-2">
        {n.author?.face_photo_url ? (
          <img src={n.author.face_photo_url} alt="" className="w-5 h-5 rounded-full object-cover" loading="lazy" />
        ) : (
          <Avatar
            initials={n.author?.avatar_initials ?? '??'}
            color={mapAvatarColor(n.author?.avatar_colour ?? null)}
            size="sm"
            className="!w-5 !h-5 !text-[8px]"
          />
        )}
        <span className="font-ui text-[11px] uppercase tracking-wider text-ink/40">
          {n.author?.shop_name ?? n.author?.full_name}
          {n.location && <> &middot; {n.location}</>}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Notice Board Sidebar                                               */
/* ------------------------------------------------------------------ */

function NoticeBoard() {
  const [filter, setFilter] = useState<NoticeFilter>('all')
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { notices, loading } = useNotices(filter === 'all' ? undefined : filter as Notice['type'])
  const { user } = useAuth()

  // Force refresh on post
  void refreshKey

  return (
    <div>
      <Eyebrow>Notice Board</Eyebrow>

      <div className="flex gap-1.5 mt-3 mb-4 overflow-x-auto">
        {NOTICE_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 font-ui text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 transition-colors ${
              filter === t
                ? 'bg-ink text-warm-white'
                : 'border border-ink/20 text-slate'
            }`}
          >
            {noticeTypeLabels[t] ?? t}
          </button>
        ))}
      </div>

      {user && (
        showForm ? (
          <NewNoticeForm onClose={() => setShowForm(false)} onPosted={() => setRefreshKey((k) => k + 1)} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full font-ui text-xs font-semibold uppercase tracking-[0.2em] bg-warm-white border border-ink text-ink py-2.5 mb-4 hover:bg-cream transition-colors"
          >
            Post a notice
          </button>
        )
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-cream p-4">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-4 w-3/4 mt-2" />
              <div className="skeleton h-3 w-full mt-2" />
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <p className="font-body text-sm text-slate/60 italic">No notices yet.</p>
      ) : (
        <div>
          {notices.map((n) => (
            <NoticeCard key={n.id} notice={n} />
          ))}
        </div>
      )}
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
  const [tagFilter, setTagFilter] = useState<TagFilter>('all')
  const [showNewThread, setShowNewThread] = useState(false)

  // Weekly prompt — find the most recent one
  const weeklyPrompt = threads.find((t) => t.is_weekly_prompt)
  // Discussion threads (non-prompt), pinned first
  const discussionThreads = threads
    .filter((t) => !t.is_weekly_prompt)
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return 0
    })
  // Apply tag filter
  const filtered = tagFilter === 'all'
    ? discussionThreads
    : discussionThreads.filter((t) => t.tags.includes(tagFilter))

  return (
    <section className="py-16 sm:py-24">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <Eyebrow>05 &mdash; The Counter</Eyebrow>
        <h1 className="font-display font-bold text-4xl sm:text-5xl mt-2">The Counter</h1>
        <p className="font-display italic text-slate text-lg mt-2">Where the trade talks.</p>
        <div className="mt-4 flex flex-col gap-1">
          <div className="h-[3px] bg-ink" />
          <div className="h-px bg-ink/10" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Weekly prompt */}
            {weeklyPrompt && <WeeklyPromptCard thread={weeklyPrompt} />}

            {/* Tag filter */}
            <TagFilterBar active={tagFilter} onChange={setTagFilter} />

            {/* Start a thread */}
            {user ? (
              showNewThread ? (
                <NewThreadForm onClose={() => setShowNewThread(false)} />
              ) : (
                <div className="mb-6 hidden lg:block">
                  <Button onClick={() => setShowNewThread(true)}>
                    Start a thread
                  </Button>
                </div>
              )
            ) : (
              <div className="mb-6">
                <Link
                  to="/join"
                  className="inline-flex items-center justify-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-ink/10 text-ink/40 px-6 py-3 cursor-default"
                >
                  Join to post
                </Link>
              </div>
            )}

            {/* Thread list */}
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="py-5 border-b border-ink/8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="skeleton w-9 h-9 rounded-full" />
                      <div className="skeleton h-3 w-36" />
                    </div>
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-3 w-32 mt-3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-body text-ink/60">Nothing here yet. Start the first conversation.</p>
                {user && (
                  <button
                    onClick={() => setShowNewThread(true)}
                    className="font-ui text-sm font-semibold uppercase tracking-[0.2em] bg-ink text-warm-white px-6 py-3 mt-4 hover:bg-charcoal transition-colors"
                  >
                    Start a Thread
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filtered.map((t) => (
                  <ThreadCard key={t.id} thread={t} />
                ))}
              </div>
            )}
          </div>

          {/* Notice board sidebar */}
          <div className="w-full lg:w-[320px] lg:sticky lg:top-24 lg:self-start shrink-0">
            <NoticeBoard />
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      {user && !showNewThread && (
        <button
          onClick={() => setShowNewThread(true)}
          className="lg:hidden fixed bottom-6 right-5 z-50 bg-ink text-warm-white font-ui font-bold uppercase text-sm tracking-[0.15em] px-5 py-3.5 shadow-lg hover:bg-charcoal transition-colors"
          aria-label="Start a thread"
        >
          + Thread
        </button>
      )}
    </section>
  )
}
