import { useParams, Link } from 'react-router-dom'
import { useThread } from '../hooks/useThreads'
import Tag from '../components/ui/Tag'
import Avatar from '../components/ui/Avatar'

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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const { thread, loading, error } = useThread(threadId)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-ui text-sm uppercase tracking-wider text-charcoal/40">Loading…</p>
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-display text-2xl">Thread not found</p>
        <Link to="/community" className="font-ui text-sm uppercase tracking-wider text-ochre-600 hover:text-ochre-700">
          Back to community
        </Link>
      </div>
    )
  }

  const author = thread.author
  const authorName = author?.full_name ?? 'Anonymous'
  const shopName = author?.shop_name

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[720px] px-4 sm:px-6">
        {/* Back link */}
        <Link
          to="/community"
          className="inline-block font-ui text-xs uppercase tracking-wider text-ochre-600 hover:text-ochre-700 mb-8"
        >
          &larr; Back to The Counter
        </Link>

        {/* Original question */}
        <div className="mb-10">
          <Tag variant="outlined">{categoryLabels[thread.category] ?? thread.category}</Tag>

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
        <div className="w-full h-[2px] bg-ochre-600" />

        {/* Replies */}
        {thread.replies.length > 0 ? (
          <div className="mt-8 space-y-8">
            {thread.replies.map((reply) => {
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
                  <div className="min-w-0">
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

        {/* Reply form — disabled for logged-out users */}
        <div className="mt-12 pt-8 border-t border-sand">
          <h3 className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-4">
            Reply
          </h3>
          <textarea
            disabled
            rows={4}
            placeholder="Join the community to reply"
            className="w-full font-body text-sm p-4 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 resize-y focus:border-ochre-600 focus:ring-1 focus:ring-ochre-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex items-center gap-4 mt-3">
            <button
              disabled
              className="font-ui font-bold uppercase text-sm tracking-[0.2em] bg-forest-800 text-cream px-6 py-3 opacity-50 cursor-not-allowed"
            >
              Post Reply
            </button>
            <p className="font-ui text-[11px] uppercase tracking-wider text-charcoal/40">
              Join the community to reply
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
