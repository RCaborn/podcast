import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useThread } from '../hooks/useThreads'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { supabase } from '../lib/supabase'
import { mapAvatarColor } from '../lib/avatarColor'
import Tag from '../components/ui/Tag'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import type { Profile, Reply } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const categoryLabels: Record<string, string> = {
  delis: 'Delis',
  butchers: 'Butchers',
  cheesemongers: 'Cheesemongers',
  'farm-shops': 'Farm Shops',
  general: 'General',
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
            <div className="skeleton w-10 h-10 rounded-full" />
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

        {/* Original question */}
        <div className="mb-10">
          <Tag variant="outlined" contentType="Community">{categoryLabels[thread.category] ?? thread.category}</Tag>

          <h1 className="font-display italic text-2xl sm:text-3xl mt-5 leading-snug">
            {thread.title}
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <Avatar
              initials={author?.avatar_initials ?? '??'}
              color={mapAvatarColor(author?.avatar_colour ?? null)}
              size="md"
            />
            <div>
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                {authorName}
                {shopName && <> &middot; {shopName}</>}
              </p>
              <p className="font-ui text-[11px] uppercase tracking-wider text-charcoal/40">
                {timeAgo(thread.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[2px] bg-terracotta" />

        {/* Replies */}
        {allReplies.length > 0 ? (
          <div className="mt-8 space-y-8">
            {allReplies.map((reply) => {
              const rAuthor = reply.author
              const rName = rAuthor?.full_name ?? 'Anonymous'
              const rShop = rAuthor?.shop_name

              return (
                <div key={reply.id} className="flex gap-4">
                  <Avatar
                    initials={rAuthor?.avatar_initials ?? '??'}
                    color={mapAvatarColor(rAuthor?.avatar_colour ?? null)}
                    size="sm"
                    className="shrink-0 mt-1"
                  />
                  <div className="min-w-0 bg-cream p-4 flex-1">
                    <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
                      {rName}
                      {rShop && <> &middot; {rShop}</>}
                      <span className="font-normal text-charcoal/30 ml-2">{timeAgo(reply.created_at)}</span>
                    </p>
                    <p className="font-body text-sm text-charcoal/80 mt-2 leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="font-body text-charcoal/50 mt-8">No replies yet. Be the first to respond.</p>
        )}

        {/* Reply form */}
        <div className="mt-12 pt-8 border-t border-stone">
          <h3 className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-4">
            Reply
          </h3>

          {user ? (
            <form onSubmit={handleReply}>
              <textarea
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts…"
                className="w-full font-body text-sm p-4 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 resize-y focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none"
              />
              {replyError && (
                <p className="font-body text-sm text-red-600 mt-2">{replyError}</p>
              )}
              <div className="mt-3">
                <Button type="submit" disabled={posting || !replyContent.trim()}>
                  {posting ? 'Posting…' : 'Post Reply'}
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <textarea
                disabled
                rows={4}
                placeholder="Join the community to reply"
                className="w-full font-body text-sm p-4 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
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
