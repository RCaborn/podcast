import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useThread, useToggleReaction } from '../hooks/useThreads'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { supabase } from '../lib/supabase'
import { mapAvatarColor } from '../lib/avatarColor'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import type { Profile, Reply, ThreadReaction } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const tradeTypeLabels: Record<string, string> = {
  deli: 'Deli',
  butcher: 'Butcher',
  cheesemonger: 'Cheesemonger',
  'farm-shop': 'Farm Shop',
  grocer: 'Grocer',
  other: 'Other',
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

function AuthorPhoto({ author, size = 36 }: { author: Profile | null; size?: number }) {
  if (!author) return null
  if (author.face_photo_url) {
    return (
      <img
        src={author.face_photo_url}
        alt=""
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    )
  }
  return (
    <Avatar
      initials={author.avatar_initials ?? '??'}
      color={mapAvatarColor(author.avatar_colour ?? null)}
      size={size >= 48 ? 'md' : 'sm'}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Reaction Bar                                                       */
/* ------------------------------------------------------------------ */

function ReactionBar({
  threadId,
  reactions: initialReactions,
}: {
  threadId: string
  reactions: ThreadReaction[]
}) {
  const { user } = useAuth()
  const { toggle } = useToggleReaction()
  const [reactions, setReactions] = useState(initialReactions)

  const sameHereCount = reactions.filter((r) => r.type === 'same-here').length
  const usefulCount = reactions.filter((r) => r.type === 'useful').length
  const userSameHere = user ? reactions.some((r) => r.type === 'same-here' && r.author_id === user.id) : false
  const userUseful = user ? reactions.some((r) => r.type === 'useful' && r.author_id === user.id) : false

  async function handleReaction(type: 'same-here' | 'useful') {
    if (!user) return
    const added = await toggle(threadId, user.id, type)
    if (added) {
      setReactions((prev) => [...prev, { id: crypto.randomUUID(), thread_id: threadId, author_id: user.id, type, created_at: new Date().toISOString() }])
    } else {
      setReactions((prev) => prev.filter((r) => !(r.type === type && r.author_id === user.id)))
    }
  }

  return (
    <div className="flex items-center gap-3 mt-8 mb-2">
      <button
        onClick={() => handleReaction('same-here')}
        disabled={!user}
        className={`font-ui text-[11px] uppercase tracking-[0.15em] border py-2 px-4 transition-colors ${
          userSameHere
            ? 'bg-olive/10 text-olive border-olive/30'
            : 'border-ink/15 text-slate hover:border-olive/30'
        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={!user ? 'Join to react' : undefined}
      >
        Same here {sameHereCount > 0 && `(${sameHereCount})`}
      </button>
      <button
        onClick={() => handleReaction('useful')}
        disabled={!user}
        className={`font-ui text-[11px] uppercase tracking-[0.15em] border py-2 px-4 transition-colors ${
          userUseful
            ? 'bg-brass/10 text-brass border-brass/30'
            : 'border-ink/15 text-slate hover:border-brass/30'
        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={!user ? 'Join to react' : undefined}
      >
        Useful {usefulCount > 0 && `(${usefulCount})`}
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const { thread, loading, error } = useThread(threadId)
  const { user, profile } = useAuth()

  const [replyContent, setReplyContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [optimisticReplies, setOptimisticReplies] = useState<(Reply & { author: Profile })[]>([])

  usePageTitle(thread?.title ?? 'Thread')

  if (loading) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <div className="skeleton h-4 w-32 mb-8" />
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-8 w-full mt-5" />
          <div className="skeleton h-8 w-2/3 mt-2" />
          <div className="flex items-center gap-3 mt-6">
            <div className="skeleton w-12 h-12 rounded-full" />
            <div className="skeleton h-3 w-40" />
          </div>
          <div className="w-full h-[2px] bg-stone mt-10" />
          <div className="mt-8 space-y-8">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="skeleton w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="skeleton h-3 w-36" />
                  <div className="skeleton h-4 w-full mt-2" />
                  <div className="skeleton h-4 w-3/4 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-display text-2xl">Thread not found</p>
        <Link to="/community" className="font-ui text-sm uppercase tracking-wider text-terracotta hover:text-sienna">
          Back to community
        </Link>
      </div>
    )
  }

  const author = thread.author
  const authorName = author?.full_name ?? 'Anonymous'
  const shopName = author?.shop_name
  const allReplies = [...thread.replies, ...optimisticReplies]

  async function handleReply(e: FormEvent) {
    e.preventDefault()
    if (!user || !profile || !replyContent.trim()) return

    setPosting(true)
    setReplyError(null)

    const { data, error: err } = await supabase
      .from('replies')
      .insert({
        thread_id: threadId,
        author_id: user.id,
        content: replyContent.trim(),
      })
      .select('*')
      .single()

    setPosting(false)

    if (err) {
      setReplyError(err.message)
      return
    }

    setOptimisticReplies((prev) => [
      ...prev,
      { ...(data as Reply), author: profile },
    ])
    setReplyContent('')
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[720px] px-4 sm:px-6">
        {/* Back link */}
        <Link
          to="/community"
          className="inline-block font-ui text-xs uppercase tracking-wider text-terracotta hover:text-sienna mb-8"
        >
          &larr; Back to The Counter
        </Link>

        {/* Thread header */}
        <div className="mb-10">
          {thread.tags.length > 0 && (
            <div className="flex gap-1.5 mb-3">
              {thread.tags.map((tag) => (
                <span key={tag} className="font-ui text-[10px] uppercase tracking-[0.15em] border border-ink/15 text-slate px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display italic text-2xl sm:text-3xl leading-snug">
            {thread.title}
          </h1>

          <Link to={`/profile/${thread.author_id}`} className="flex items-center gap-3 mt-6 group">
            <AuthorPhoto author={author} size={48} />
            <div>
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/70 group-hover:text-ink transition-colors">
                {authorName}
              </p>
              <p className="font-ui text-[11px] uppercase tracking-[0.15em] text-slate">
                {shopName && <>{shopName}</>}
                {author?.region && <> &middot; {author.region}</>}
                {author?.trade_type && <> &middot; {tradeTypeLabels[author.trade_type] ?? author.trade_type}</>}
                {author?.years_trading && <> &middot; {author.years_trading} yrs trading</>}
              </p>
              <p className="font-ui text-[11px] uppercase tracking-wider text-ink/40">
                {timeAgo(thread.created_at)}
              </p>
            </div>
          </Link>
        </div>

        {/* Reaction bar */}
        <ReactionBar threadId={thread.id} reactions={thread.reactions ?? []} />

        {/* Divider */}
        <div className="w-full h-[2px] bg-terracotta mt-4" />

        {/* Replies */}
        {allReplies.length > 0 ? (
          <div className="mt-8 space-y-0">
            {allReplies.map((reply) => {
              const rAuthor = reply.author
              const rName = rAuthor?.full_name ?? 'Anonymous'
              const rShop = rAuthor?.shop_name

              return (
                <div key={reply.id} className="flex gap-4 py-5 bg-cream px-4 border-b border-ink/8 last:border-b-0">
                  <Link to={`/profile/${reply.author_id}`} className="shrink-0 mt-1">
                    <AuthorPhoto author={rAuthor} size={36} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                      {rName}
                    </p>
                    {rShop && (
                      <p className="font-ui text-[11px] uppercase tracking-[0.15em] text-slate">
                        {rShop}
                        {rAuthor?.region && <> &middot; {rAuthor.region}</>}
                      </p>
                    )}
                    <p className="font-body text-sm text-slate mt-2 leading-relaxed" style={{ lineHeight: 1.7 }}>
                      {reply.content}
                    </p>
                    <p className="font-body text-[11px] text-slate/50 mt-2" style={{ fontWeight: 300 }}>
                      {timeAgo(reply.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="font-body text-ink/50 mt-8">No replies yet. Be the first to respond.</p>
        )}

        {/* Reply form */}
        <div className="mt-12 pt-8 border-t border-stone">
          <h3 className="font-ui text-xs font-semibold uppercase tracking-wider text-ink/50 mb-4">
            Reply
          </h3>

          {user ? (
            <form onSubmit={handleReply}>
              <textarea
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full font-body text-sm p-4 border border-ink/20 bg-cream text-ink placeholder:text-ink/30 resize-y focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none"
              />
              {replyError && (
                <p className="font-body text-sm text-red-600 mt-2">{replyError}</p>
              )}
              <div className="mt-3">
                <Button type="submit" disabled={posting || !replyContent.trim()}>
                  {posting ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <textarea
                disabled
                rows={4}
                placeholder="Join the community to reply"
                className="w-full font-body text-sm p-4 border border-ink/20 bg-cream text-ink placeholder:text-ink/30 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex items-center gap-4 mt-3">
                <Link
                  to="/join"
                  className="inline-flex items-center justify-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-ink text-warm-white px-6 py-3 hover:bg-charcoal transition-colors"
                >
                  Join the community to reply
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
