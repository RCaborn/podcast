import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../components/ui/Toast'
import Avatar from '../../components/ui/Avatar'
import { mapAvatarColor } from '../../lib/avatarColor'
import type { Profile } from '../../types/database'

interface ThreadData {
  id: string
  title: string
  category: string | null
  tags: string[]
  is_pinned: boolean
  is_locked: boolean
  is_hidden: boolean
  is_weekly_prompt: boolean
  created_at: string
  author: Profile
}

interface ReplyData {
  id: string
  content: string
  is_hidden: boolean
  created_at: string
  author: Profile
}

export default function ThreadModerationPage() {
  usePageTitle('Thread — Admin')
  const { threadId } = useParams<{ threadId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [thread, setThread] = useState<ThreadData | null>(null)
  const [replies, setReplies] = useState<ReplyData[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDeleteThread, setConfirmDeleteThread] = useState(false)
  const [confirmDeleteReply, setConfirmDeleteReply] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!threadId) return
    const [tRes, rRes] = await Promise.all([
      supabase.from('threads')
        .select('*, author:profiles!threads_author_id_fkey(*)')
        .eq('id', threadId)
        .single(),
      supabase.from('replies')
        .select('*, author:profiles!replies_author_id_fkey(*)')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true }),
    ])

    if (tRes.data) {
      setThread({
        ...tRes.data,
        author: tRes.data.author as Profile,
      } as ThreadData)
    }

    setReplies(
      (rRes.data ?? []).map((r: any) => ({
        ...r,
        author: r.author as Profile,
      }))
    )
    setLoading(false)
  }, [threadId])

  useEffect(() => { load() }, [load])

  async function toggleThreadFlag(field: 'is_pinned' | 'is_locked' | 'is_hidden') {
    if (!thread) return
    await supabase.from('threads').update({ [field]: !thread[field] }).eq('id', thread.id)
    const label = field.replace('is_', '')
    toast(`Thread ${!thread[field] ? label : 'un' + label}${!thread[field] ? 'ed' : 'ed'}`)
    load()
  }

  async function toggleReplyHidden(replyId: string, current: boolean) {
    await supabase.from('replies').update({ is_hidden: !current }).eq('id', replyId)
    toast(current ? 'Reply shown' : 'Reply hidden')
    load()
  }

  async function deleteReply(replyId: string) {
    await supabase.from('replies').delete().eq('id', replyId)
    setConfirmDeleteReply(null)
    toast('Reply deleted')
    load()
  }

  async function deleteThread() {
    if (!thread) return
    await supabase.from('replies').delete().eq('thread_id', thread.id)
    await supabase.from('thread_reactions').delete().eq('thread_id', thread.id)
    await supabase.from('threads').delete().eq('id', thread.id)
    toast('Thread deleted')
    navigate('/admin/community')
  }

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-48 mt-4" />
      </div>
    )
  }

  if (!thread) {
    return <p className="font-body text-slate">Thread not found.</p>
  }

  return (
    <div>
      <Link
        to="/admin/community"
        className="font-ui text-[11px] uppercase tracking-[0.2em] text-slate/50 hover:text-slate transition-colors"
      >
        &larr; Back to community
      </Link>

      <h1 className="font-display font-bold text-2xl text-ink mt-4">{thread.title}</h1>
      <div className="h-[2px] bg-terracotta w-12 mt-3" />

      {/* Thread meta */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <Avatar
          initials={thread.author?.avatar_initials ?? '??'}
          color={mapAvatarColor(thread.author?.avatar_colour ?? null)}
          size="sm"
        />
        <span className="font-body text-[13px] text-slate">
          {thread.author?.full_name}
        </span>
        <span className="font-body text-[12px] text-slate/40">
          {new Date(thread.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Locked banner */}
      {thread.is_locked && (
        <div className="bg-brass/10 border border-brass/30 p-3 mt-4">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-brass">
            This thread is locked — no new replies can be posted.
          </p>
        </div>
      )}

      {/* Moderation controls */}
      <div className="flex gap-2 mt-6">
        <ToggleBtn label={thread.is_pinned ? 'Unpin' : 'Pin'} active={thread.is_pinned} onClick={() => toggleThreadFlag('is_pinned')} />
        <ToggleBtn label={thread.is_locked ? 'Unlock' : 'Lock'} active={thread.is_locked} onClick={() => toggleThreadFlag('is_locked')} />
        <ToggleBtn label={thread.is_hidden ? 'Unhide' : 'Hide'} active={thread.is_hidden} onClick={() => toggleThreadFlag('is_hidden')} />
        <button
          onClick={() => setConfirmDeleteThread(true)}
          className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] py-2 px-3 text-sienna/60 hover:text-sienna border border-ink/6 transition-colors"
        >
          Delete Thread
        </button>
      </div>

      {/* Replies */}
      <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-slate mt-10 mb-4">
        Replies ({replies.length})
      </h2>

      <div className="space-y-4">
        {replies.map((r) => (
          <div
            key={r.id}
            className={`bg-parchment border border-ink/6 p-4 ${r.is_hidden ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-3">
              <Avatar
                initials={r.author?.avatar_initials ?? '??'}
                color={mapAvatarColor(r.author?.avatar_colour ?? null)}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
                    {r.author?.full_name}
                  </span>
                  <span className="font-body text-[11px] text-slate/40">
                    {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  {r.is_hidden && (
                    <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-slate border border-slate/30 px-2 py-0.5">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="font-body text-[14px] text-charcoal/70 mt-2 leading-relaxed">
                  {r.content}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 ml-10">
              <button
                onClick={() => toggleReplyHidden(r.id, r.is_hidden)}
                className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-slate/50 hover:text-slate transition-colors"
              >
                {r.is_hidden ? 'Show' : 'Hide'}
              </button>
              <button
                onClick={() => setConfirmDeleteReply(r.id)}
                className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-sienna/60 hover:text-sienna transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {replies.length === 0 && (
          <p className="font-body text-slate text-center py-6">No replies yet.</p>
        )}
      </div>

      {/* Delete thread confirmation */}
      {confirmDeleteThread && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => setConfirmDeleteThread(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-8 max-w-sm w-full">
            <h3 className="font-display font-bold text-xl">Delete thread?</h3>
            <p className="font-body text-[14px] text-slate mt-2">
              This will permanently delete the thread and all its replies.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDeleteThread(false)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] border border-ink/10 py-2.5 px-5 hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteThread}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-sienna text-warm-white py-2.5 px-5 hover:bg-terracotta transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete reply confirmation */}
      {confirmDeleteReply && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => setConfirmDeleteReply(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-8 max-w-sm w-full">
            <h3 className="font-display font-bold text-xl">Delete reply?</h3>
            <p className="font-body text-[14px] text-slate mt-2">
              This reply will be permanently removed.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDeleteReply(null)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] border border-ink/10 py-2.5 px-5 hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteReply(confirmDeleteReply)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-sienna text-warm-white py-2.5 px-5 hover:bg-terracotta transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-ui text-[10px] font-semibold uppercase tracking-[0.15em] py-2 px-3 transition-colors ${
        active
          ? 'bg-ink text-warm-white'
          : 'text-slate/50 hover:text-slate border border-ink/6'
      }`}
    >
      {label}
    </button>
  )
}
