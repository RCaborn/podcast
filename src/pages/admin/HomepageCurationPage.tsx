import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../components/ui/Toast'
import type { Article, Thread } from '../../types/database'

interface SlotDef {
  key: string
  label: string
  description: string
  type: 'article' | 'thread'
  tagFilter?: string
}

const ARTICLE_SLOTS: SlotDef[] = [
  { key: 'lead', label: 'Lead Story', description: 'Main feature, top of page', type: 'article' },
  { key: 'image-feature-1', label: 'Image Feature 1', description: 'Left image card', type: 'article' },
  { key: 'image-feature-2', label: 'Image Feature 2', description: 'Right image card', type: 'article' },
  { key: 'newsletter-strip', label: 'Newsletter Strip', description: 'Dark newsletter band', type: 'article', tagFilter: 'Newsletter' },
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
  const toast = useToast()

  const [articles, setArticles] = useState<Article[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [selectingSlot, setSelectingSlot] = useState<SlotDef | null>(null)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    const [artRes, thRes] = await Promise.all([
      supabase.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false }),
      supabase.from('threads').select('*').eq('is_hidden', false).order('created_at', { ascending: false }),
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
    await supabase.from('articles').update({ featured_position: null }).eq('featured_position', slotKey)
    await supabase.from('articles').update({ featured_position: slotKey }).eq('id', articleId)
    setSelectingSlot(null)
    setSearch('')
    toast(`Assigned to ${slotKey}`)
    load()
  }

  async function assignThread(slotKey: string, threadId: string) {
    await supabase.from('threads').update({ featured_thread_position: null }).eq('featured_thread_position', slotKey)
    await supabase.from('threads').update({ featured_thread_position: slotKey }).eq('id', threadId)
    setSelectingSlot(null)
    setSearch('')
    toast(`Assigned to ${slotKey}`)
    load()
  }

  async function clearSlot(slot: SlotDef) {
    if (slot.type === 'article') {
      await supabase.from('articles').update({ featured_position: null }).eq('featured_position', slot.key)
    } else {
      await supabase.from('threads').update({ featured_thread_position: null }).eq('featured_thread_position', slot.key)
    }
    toast(`Cleared ${slot.label}`)
    load()
  }

  const sidebarArticles = articles
    .filter((a) => !a.featured_position)
    .slice(0, 3)

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

  const filteredArticles = selectingSlot?.type === 'article'
    ? articles.filter((a) => {
        if (selectingSlot.tagFilter && a.tag !== selectingSlot.tagFilter) return false
        if (!search) return true
        return a.title.toLowerCase().includes(search.toLowerCase())
      })
    : []

  const filteredThreads = selectingSlot?.type === 'thread'
    ? threads.filter((t) => {
        if (!search) return true
        return t.title.toLowerCase().includes(search.toLowerCase())
      })
    : []

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Homepage Layout</h1>
          <div className="h-[2px] bg-terracotta w-12 mt-3" />
        </div>
        <Link
          to="/"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta hover:text-sienna transition-colors"
        >
          View homepage &rarr;
        </Link>
      </div>
      <p className="font-body text-[14px] text-slate mt-4">
        {filled} of {total} slots filled. Click a slot to assign content.
      </p>

      {/* Visual wireframe layout */}
      <div className="mt-8 space-y-3">
        {/* Lead + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
          <SlotCard slot={ARTICLE_SLOTS[0]} article={getArticleForSlot('lead')} onSelect={() => setSelectingSlot(ARTICLE_SLOTS[0])} onClear={() => clearSlot(ARTICLE_SLOTS[0])} />
          <div className="bg-cream/50 border border-ink/6 p-4">
            <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-slate mb-2">
              Sidebar (Auto: 3 latest articles)
            </p>
            {sidebarArticles.length > 0 ? (
              <div className="space-y-2">
                {sidebarArticles.map((a) => (
                  <p key={a.id} className="font-body text-[12px] text-ink truncate">{a.title}</p>
                ))}
              </div>
            ) : (
              <p className="font-body text-[12px] text-slate/40 italic">No unfeatured articles</p>
            )}
          </div>
        </div>

        {/* Image Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ARTICLE_SLOTS.filter((s) => s.key.startsWith('image-feature')).map((slot) => (
            <SlotCard key={slot.key} slot={slot} article={getArticleForSlot(slot.key)} onSelect={() => setSelectingSlot(slot)} onClear={() => clearSlot(slot)} />
          ))}
        </div>

        {/* Newsletter Strip */}
        <SlotCard slot={ARTICLE_SLOTS[3]} article={getArticleForSlot('newsletter-strip')} onSelect={() => setSelectingSlot(ARTICLE_SLOTS[3])} onClear={() => clearSlot(ARTICLE_SLOTS[3])} dark />

        {/* Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ARTICLE_SLOTS.filter((s) => s.key.startsWith('trio')).map((slot) => (
            <SlotCard key={slot.key} slot={slot} article={getArticleForSlot(slot.key)} onSelect={() => setSelectingSlot(slot)} onClear={() => clearSlot(slot)} />
          ))}
        </div>

        {/* Community Inline */}
        <SlotCard slot={THREAD_SLOTS[0]} thread={getThreadForSlot('community-inline')} onSelect={() => setSelectingSlot(THREAD_SLOTS[0])} onClear={() => clearSlot(THREAD_SLOTS[0])} />

        {/* Opinion Pullquote + Aside */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
          <SlotCard slot={ARTICLE_SLOTS[7]} article={getArticleForSlot('opinion-pullquote')} onSelect={() => setSelectingSlot(ARTICLE_SLOTS[7])} onClear={() => clearSlot(ARTICLE_SLOTS[7])} />
          <SlotCard slot={ARTICLE_SLOTS[8]} article={getArticleForSlot('aside')} onSelect={() => setSelectingSlot(ARTICLE_SLOTS[8])} onClear={() => clearSlot(ARTICLE_SLOTS[8])} dark />
        </div>

        {/* Community Strip */}
        <SlotCard slot={THREAD_SLOTS[1]} thread={getThreadForSlot('community-strip')} onSelect={() => setSelectingSlot(THREAD_SLOTS[1])} onClear={() => clearSlot(THREAD_SLOTS[1])} />

        {/* Bottom Duo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ARTICLE_SLOTS.filter((s) => s.key.startsWith('bottom')).map((slot) => (
            <SlotCard key={slot.key} slot={slot} article={getArticleForSlot(slot.key)} onSelect={() => setSelectingSlot(slot)} onClear={() => clearSlot(slot)} />
          ))}
        </div>
      </div>

      {/* Selection modal */}
      {selectingSlot && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => { setSelectingSlot(null); setSearch('') }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-6 max-w-lg w-full max-h-[70vh] flex flex-col">
            <h3 className="font-display font-bold text-xl">
              Assign: {selectingSlot.label}
            </h3>
            <p className="font-body text-[13px] text-slate mt-1">{selectingSlot.description}</p>
            {selectingSlot.tagFilter && (
              <p className="font-ui text-[10px] uppercase tracking-[0.15em] text-terracotta mt-1">
                Filtered to: {selectingSlot.tagFilter}
              </p>
            )}

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="mt-3 w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
              autoFocus
            />

            <div className="mt-3 overflow-y-auto flex-1 divide-y divide-ink/6">
              {selectingSlot.type === 'article' ? (
                filteredArticles.length === 0 ? (
                  <p className="font-body text-[13px] text-slate py-4 text-center">No matching articles.</p>
                ) : (
                  filteredArticles.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => assignArticle(selectingSlot.key, a.id)}
                      className="w-full text-left py-3 px-2 hover:bg-cream transition-colors flex items-center gap-3"
                    >
                      <span className="font-display font-bold text-[14px] flex-1 truncate">{a.title}</span>
                      {a.tag && (
                        <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-slate shrink-0">
                          {a.tag}
                        </span>
                      )}
                      {a.featured_position && (
                        <span className="font-ui text-[9px] uppercase tracking-[0.15em] text-terracotta border border-terracotta/30 px-2 py-0.5 shrink-0">
                          {a.featured_position}
                        </span>
                      )}
                    </button>
                  ))
                )
              ) : (
                filteredThreads.length === 0 ? (
                  <p className="font-body text-[13px] text-slate py-4 text-center">No matching threads.</p>
                ) : (
                  filteredThreads.map((t) => (
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
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SlotCard({
  slot,
  article,
  thread,
  onSelect,
  onClear,
  dark,
}: {
  slot: SlotDef
  article?: Article
  thread?: Thread
  onSelect: () => void
  onClear: () => void
  dark?: boolean
}) {
  const filled = !!(article || thread)
  const title = article?.title ?? thread?.title

  return (
    <div className={`border p-4 transition-colors ${dark ? 'bg-charcoal border-charcoal' : 'bg-parchment border-ink/8'}`}>
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 shrink-0 mt-1.5 ${filled ? 'bg-olive' : 'bg-slate/20'}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-ui text-[10px] font-semibold uppercase tracking-[0.15em] ${dark ? 'text-warm-white/60' : 'text-slate'}`}>
            {slot.label}
          </p>
          {filled ? (
            <p className={`font-display text-[14px] truncate mt-0.5 ${dark ? 'text-warm-white' : 'text-ink'}`}>
              {thread ? `\u201C${title}\u201D` : title}
            </p>
          ) : (
            <p className={`font-body text-[12px] mt-0.5 ${dark ? 'text-warm-white/30' : 'text-slate/50'}`}>
              {slot.description} — empty
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onSelect}
            className={`font-ui text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${
              dark ? 'text-terracotta hover:text-warm-white' : 'text-terracotta hover:text-sienna'
            }`}
          >
            {filled ? 'Change' : 'Assign'}
          </button>
          {filled && (
            <button
              onClick={onClear}
              className={`font-ui text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                dark ? 'text-warm-white/30 hover:text-warm-white/60' : 'text-slate/40 hover:text-slate'
              }`}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
