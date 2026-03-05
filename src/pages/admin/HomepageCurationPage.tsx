import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { Article, Thread } from '../../types/database'

interface SlotDef {
  key: string
  label: string
  description: string
  type: 'article' | 'thread'
}

const ARTICLE_SLOTS: SlotDef[] = [
  { key: 'lead', label: 'Lead Story', description: 'Main feature, top of page', type: 'article' },
  { key: 'image-feature-1', label: 'Image Feature 1', description: 'Left image card', type: 'article' },
  { key: 'image-feature-2', label: 'Image Feature 2', description: 'Right image card', type: 'article' },
  { key: 'newsletter-strip', label: 'Newsletter Strip', description: 'Dark newsletter band', type: 'article' },
  { key: 'trio-1', label: 'Trio 1', description: 'First of three columns', type: 'article' },
  { key: 'trio-2', label: 'Trio 2', description: 'Second of three columns', type: 'article' },
  { key: 'trio-3', label: 'Trio 3', description: 'Third of three columns', type: 'article' },
  { key: 'opinion-pullquote', label: 'Opinion Pullquote', description: 'Featured opinion quote', type: 'article' },
  { key: 'aside', label: 'Aside Card', description: 'Dark card beside pullquote', type: 'article' },
  { key: 'bottom-1', label: 'Bottom 1', description: 'Left bottom article', type: 'article' },
  { key: 'bottom-2', label: 'Bottom 2', description: 'Right bottom article', type: 'article' },
]

const THREAD_SLOTS: SlotDef[] = [
  { key: 'community-inline', label: 'Community Inline', description: 'Featured community thread', type: 'thread' },
  { key: 'community-strip', label: 'Community Strip', description: 'Cream community band', type: 'thread' },
]

export default function HomepageCurationPage() {
  usePageTitle('Homepage — Admin')

  const [articles, setArticles] = useState<Article[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [selectingSlot, setSelectingSlot] = useState<SlotDef | null>(null)

  const load = useCallback(async () => {
    const [artRes, thRes] = await Promise.all([
      supabase.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false }),
      supabase.from('threads').select('*').order('created_at', { ascending: false }),
    ])
    setArticles((artRes.data as Article[]) ?? [])
    setThreads((thRes.data as Thread[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function getArticleForSlot(slotKey: string): Article | undefined {
    return articles.find((a) => a.featured_position === slotKey)
  }

  function getThreadForSlot(slotKey: string): Thread | undefined {
    return threads.find((t) => t.featured_thread_position === slotKey)
  }

  async function assignArticle(slotKey: string, articleId: string) {
    // Clear the slot from any other article first
    await supabase.from('articles').update({ featured_position: null }).eq('featured_position', slotKey)
    // Assign
    await supabase.from('articles').update({ featured_position: slotKey }).eq('id', articleId)
    setSelectingSlot(null)
    load()
  }

  async function assignThread(slotKey: string, threadId: string) {
    await supabase.from('threads').update({ featured_thread_position: null }).eq('featured_thread_position', slotKey)
    await supabase.from('threads').update({ featured_thread_position: slotKey }).eq('id', threadId)
    setSelectingSlot(null)
    load()
  }

  async function clearSlot(slot: SlotDef) {
    if (slot.type === 'article') {
      await supabase.from('articles').update({ featured_position: null }).eq('featured_position', slot.key)
    } else {
      await supabase.from('threads').update({ featured_thread_position: null }).eq('featured_thread_position', slot.key)
    }
    load()
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display font-bold text-3xl text-ink">Homepage</h1>
        <div className="mt-8 space-y-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-20" />)}
        </div>
      </div>
    )
  }

  const filled = ARTICLE_SLOTS.filter((s) => getArticleForSlot(s.key)).length
    + THREAD_SLOTS.filter((s) => getThreadForSlot(s.key)).length
  const total = ARTICLE_SLOTS.length + THREAD_SLOTS.length

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-ink">Homepage Layout</h1>
      <div className="h-[2px] bg-terracotta w-12 mt-3" />
      <p className="font-body text-[14px] text-slate mt-4">
        {filled} of {total} slots filled. Click a slot to assign content.
      </p>

      {/* Article slots */}
      <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-slate mt-10 mb-4">
        Article Slots
      </h2>
      <div className="space-y-3">
        {ARTICLE_SLOTS.map((slot) => {
          const article = getArticleForSlot(slot.key)
          return (
            <SlotRow
              key={slot.key}
              slot={slot}
              filled={!!article}
              contentTitle={article?.title}
              onSelect={() => setSelectingSlot(slot)}
              onClear={() => clearSlot(slot)}
            />
          )
        })}
      </div>

      {/* Thread slots */}
      <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-slate mt-10 mb-4">
        Thread Slots
      </h2>
      <div className="space-y-3">
        {THREAD_SLOTS.map((slot) => {
          const thread = getThreadForSlot(slot.key)
          return (
            <SlotRow
              key={slot.key}
              slot={slot}
              filled={!!thread}
              contentTitle={thread?.title}
              onSelect={() => setSelectingSlot(slot)}
              onClear={() => clearSlot(slot)}
            />
          )
        })}
      </div>

      {/* Selection modal */}
      {selectingSlot && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => setSelectingSlot(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-6 max-w-lg w-full max-h-[70vh] overflow-y-auto">
            <h3 className="font-display font-bold text-xl">
              Assign: {selectingSlot.label}
            </h3>
            <p className="font-body text-[13px] text-slate mt-1">{selectingSlot.description}</p>
            <div className="mt-4 divide-y divide-ink/6">
              {selectingSlot.type === 'article' ? (
                articles.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => assignArticle(selectingSlot.key, a.id)}
                    className="w-full text-left py-3 px-2 hover:bg-cream transition-colors flex items-center gap-3"
                  >
                    <span className="font-display font-bold text-[14px] flex-1">{a.title}</span>
                    {a.featured_position && (
                      <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-terracotta border border-terracotta/30 px-2 py-0.5 shrink-0">
                        {a.featured_position}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => assignThread(selectingSlot.key, t.id)}
                    className="w-full text-left py-3 px-2 hover:bg-cream transition-colors"
                  >
                    <span className="font-display italic text-[14px]">&ldquo;{t.title}&rdquo;</span>
                    {t.featured_thread_position && (
                      <span className="ml-2 font-ui text-[9px] uppercase tracking-[0.15em] text-terracotta border border-terracotta/30 px-2 py-0.5">
                        {t.featured_thread_position}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SlotRow({
  slot,
  filled,
  contentTitle,
  onSelect,
  onClear,
}: {
  slot: SlotDef
  filled: boolean
  contentTitle?: string
  onSelect: () => void
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-4 bg-parchment border border-ink/8 p-4">
      <span
        className={`w-2 h-2 shrink-0 ${filled ? 'bg-olive' : 'bg-slate/20'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
          {slot.label}
        </p>
        {filled ? (
          <p className="font-display text-[14px] text-ink truncate mt-0.5">
            {contentTitle}
          </p>
        ) : (
          <p className="font-body text-[12px] text-slate/50 mt-0.5">
            {slot.description} — empty
          </p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onSelect}
          className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-terracotta hover:text-sienna transition-colors"
        >
          {filled ? 'Change' : 'Assign'}
        </button>
        {filled && (
          <button
            onClick={onClear}
            className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-slate/40 hover:text-slate transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
