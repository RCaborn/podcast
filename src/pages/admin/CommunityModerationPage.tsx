import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../components/ui/Toast'
import type { Profile } from '../../types/database'

interface ThreadRow {
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
  reply_count: number
}

export default function CommunityModerationPage() {
  usePageTitle('Community — Admin')
  const toast = useToast()
  const [threads, setThreads] = useState<ThreadRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showHidden, setShowHidden] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('threads')
      .select('*, author:profiles!threads_author_id_fkey(*), replies(count)')
      .order('created_at', { ascending: false })

    const rows = (data ?? []).map((t: any) => ({
      ...t,
      author: t.author as Profile,
      reply_count: t.replies?.[0]?.count ?? 0,
    }))
    setThreads(rows)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleFlag(id: string, field: 'is_pinned' | 'is_locked' | 'is_hidden', current: boolean) {
    await supabase.from('threads').update({ [field]: !current }).eq('id', id)
    const label = field.replace('is_', '')
    toast(`Thread ${!current ? label : 'un' + label}`)
    load()
  }

  async function deleteThread(id: string) {
    await supabase.from('replies').delete().eq('thread_id', id)
    await supabase.from('thread_reactions').delete().eq('thread_id', id)
    await supabase.from('threads').delete().eq('id', id)
    setConfirmDelete(null)
    toast('Thread deleted')
    load()
  }

  const visible = showHidden ? threads : threads.filter((t) => !t.is_hidden)

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-ink">Community</h1>
      <div className="h-[2px] bg-terracotta w-12 mt-3" />

      <div className="flex items-center gap-4 mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
            className="accent-terracotta"
          />
          <span className="font-body text-[13px] text-slate">Show hidden threads</span>
        </label>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-14" />)}
        </div>
      ) : (
        <div className="mt-6 divide-y divide-ink/6">
          {visible.map((t) => (
            <div
              key={t.id}
              className={`py-4 px-3 hover:bg-cream transition-colors ${t.is_hidden ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/admin/community/${t.id}`}
                    className="font-display font-bold text-[16px] text-ink hover:text-sienna transition-colors"
                  >
                    {t.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="font-body text-[12px] text-slate/60">
                      {t.author?.full_name}
                    </span>
                    <span className="font-body text-[12px] text-slate/40">
                      {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'}
                    </span>
                    <span className="font-body text-[12px] text-slate/40">
                      {new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    {/* Flags */}
                    {t.is_pinned && (
                      <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-olive border border-olive/30 px-2 py-0.5">
                        Pinned
                      </span>
                    )}
                    {t.is_locked && (
                      <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-brass border border-brass/30 px-2 py-0.5">
                        Locked
                      </span>
                    )}
                    {t.is_hidden && (
                      <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-slate border border-slate/30 px-2 py-0.5">
                        Hidden
                      </span>
                    )}
                    {t.is_weekly_prompt && (
                      <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-terracotta border border-terracotta/30 px-2 py-0.5">
                        Weekly Prompt
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick action buttons */}
                <div className="flex gap-2 shrink-0">
                  <FlagButton
                    label={t.is_pinned ? 'Unpin' : 'Pin'}
                    active={t.is_pinned}
                    onClick={() => toggleFlag(t.id, 'is_pinned', t.is_pinned)}
                  />
                  <FlagButton
                    label={t.is_locked ? 'Unlock' : 'Lock'}
                    active={t.is_locked}
                    onClick={() => toggleFlag(t.id, 'is_locked', t.is_locked)}
                  />
                  <FlagButton
                    label={t.is_hidden ? 'Show' : 'Hide'}
                    active={t.is_hidden}
                    onClick={() => toggleFlag(t.id, 'is_hidden', t.is_hidden)}
                  />
                  <button
                    onClick={() => setConfirmDelete(t.id)}
                    className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] py-1.5 px-2.5 text-sienna/60 hover:text-sienna border border-ink/6 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <p className="font-body text-slate py-8 text-center">No threads found.</p>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => setConfirmDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-8 max-w-sm w-full">
            <h3 className="font-display font-bold text-xl">Delete thread?</h3>
            <p className="font-body text-[14px] text-slate mt-2">
              This will permanently delete the thread and all its replies.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] border border-ink/10 py-2.5 px-5 hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteThread(confirmDelete)}
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

function FlagButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-ui text-[10px] font-semibold uppercase tracking-[0.15em] py-1.5 px-2.5 transition-colors ${
        active
          ? 'bg-ink text-warm-white'
          : 'text-slate/50 hover:text-slate border border-ink/6'
      }`}
    >
      {label}
    </button>
  )
}
