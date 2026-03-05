import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const TAGS = ['Newsletter', 'Success Story', 'Opinion', 'Industry News']

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [pullquote, setPullquote] = useState('')
  const [tag, setTag] = useState('Newsletter')
  const [authorName, setAuthorName] = useState('')
  const [authorSource, setAuthorSource] = useState('')
  const [readTime, setReadTime] = useState<number | ''>('')
  const [issueNumber, setIssueNumber] = useState<number | ''>('')
  const [imageUrl, setImageUrl] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  usePageTitle(isNew ? 'New Article — Admin' : 'Edit Article — Admin')

  useEffect(() => {
    if (!id) return
    supabase.from('articles').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) return
      setTitle(data.title ?? '')
      setExcerpt(data.excerpt ?? '')
      setBody(data.body ?? '')
      setPullquote(data.pullquote ?? '')
      setTag(data.tag ?? 'Newsletter')
      setAuthorName(data.author_name ?? '')
      setAuthorSource(data.author_source ?? '')
      setReadTime(data.read_time ?? '')
      setIssueNumber(data.issue_number ?? '')
      setImageUrl(data.image_url ?? '')
      setPublishedAt(data.published_at ? data.published_at.slice(0, 10) : '')
      setStatus(data.status ?? 'draft')
    })
  }, [id])

  async function save(targetStatus: 'draft' | 'published' | 'archived') {
    setSaving(true)
    const row: Record<string, unknown> = {
      title,
      slug: slugify(title),
      excerpt: excerpt || null,
      body: body || null,
      pullquote: pullquote || null,
      tag,
      author_name: authorName || null,
      author_source: authorSource || null,
      read_time: readTime || null,
      issue_number: (tag === 'Newsletter' && issueNumber) ? issueNumber : null,
      image_url: imageUrl || null,
      status: targetStatus,
    }

    if (publishedAt) {
      row.published_at = new Date(publishedAt).toISOString()
    } else if (targetStatus === 'published') {
      row.published_at = new Date().toISOString()
    }

    if (isNew) {
      await supabase.from('articles').insert(row)
    } else {
      await supabase.from('articles').update(row).eq('id', id)
    }

    setSaving(false)
    navigate('/admin/articles')
  }

  async function handleDelete() {
    await supabase.from('articles').delete().eq('id', id)
    navigate('/admin/articles')
  }

  const statusButtons: { key: 'draft' | 'published' | 'archived'; label: string }[] = [
    { key: 'draft', label: 'Draft' },
    { key: 'published', label: 'Published' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink">
        {isNew ? 'New Article' : 'Edit Article'}
      </h1>
      <div className="h-[2px] bg-terracotta w-12 mt-3" />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 mt-8">
        {/* Main column */}
        <div className="space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full font-display font-bold text-ink bg-transparent border-b border-ink/10 focus:border-terracotta focus:outline-none pb-2 placeholder:text-ink/20"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
          />

          {/* Excerpt */}
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a one-line summary..."
            className="w-full font-body text-[16px] text-ink bg-transparent border-b border-ink/10 focus:border-terracotta focus:outline-none pb-2 placeholder:text-ink/20"
          />

          {/* Body — edit/preview toggle */}
          <div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setPreview(false)}
                className={`font-ui text-[11px] uppercase tracking-[0.2em] py-1.5 px-3 transition-colors ${
                  !preview ? 'bg-ink text-warm-white' : 'text-slate hover:text-ink'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setPreview(true)}
                className={`font-ui text-[11px] uppercase tracking-[0.2em] py-1.5 px-3 transition-colors ${
                  preview ? 'bg-ink text-warm-white' : 'text-slate hover:text-ink'
                }`}
              >
                Preview
              </button>
            </div>

            {preview ? (
              <div className="border border-ink/10 p-6 min-h-[400px] prose-article bg-parchment">
                <Markdown>{body}</Markdown>
              </div>
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write in markdown. **Bold**, *italic*, > blockquotes, ## headings all work."
                className="w-full font-body text-[16px] text-ink border border-ink/10 bg-parchment p-4 min-h-[400px] resize-y focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none placeholder:text-ink/20"
              />
            )}
          </div>

          {/* Pullquote */}
          <textarea
            value={pullquote}
            onChange={(e) => setPullquote(e.target.value)}
            placeholder="Optional: a standout quote for the homepage..."
            className="w-full font-display italic text-[18px] text-ink border border-ink/10 bg-parchment p-4 min-h-[80px] resize-y focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none placeholder:text-ink/20"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Status
            </label>
            <div className="flex gap-1">
              {statusButtons.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatus(s.key)}
                  className={`font-ui text-[11px] font-semibold uppercase tracking-[0.15em] py-2 px-3 transition-colors ${
                    status === s.key
                      ? 'bg-ink text-warm-white'
                      : 'border border-ink/10 text-slate hover:text-ink'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Tag
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
            >
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Author Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
            />
          </div>

          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Author Source
            </label>
            <input
              type="text"
              value={authorSource}
              onChange={(e) => setAuthorSource(e.target.value)}
              placeholder="e.g. Tempo Deli"
              className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
            />
          </div>

          {/* Read time */}
          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Read Time (min)
            </label>
            <input
              type="number"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value ? Number(e.target.value) : '')}
              min={1}
              className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
            />
          </div>

          {/* Issue number — only for Newsletter */}
          {tag === 'Newsletter' && (
            <div>
              <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
                Issue Number
              </label>
              <input
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value ? Number(e.target.value) : '')}
                min={1}
                className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
              />
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt=""
                className="mt-2 w-full aspect-[4/3] object-cover border border-ink/6"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>

          {/* Published date */}
          <div>
            <label className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-slate block mb-2">
              Published Date
            </label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full font-body text-[14px] border border-ink/10 bg-parchment py-2.5 px-3 focus:border-terracotta focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="border-t border-ink/10 pt-6 space-y-3">
            <button
              onClick={() => save('draft')}
              disabled={saving || !title.trim()}
              className="w-full font-ui text-[11px] font-semibold uppercase tracking-[0.2em] border border-ink/10 py-3 px-5 hover:bg-cream transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving\u2026' : 'Save Draft'}
            </button>
            <button
              onClick={() => save('published')}
              disabled={saving || !title.trim()}
              className="w-full font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-ink text-warm-white py-3 px-5 hover:bg-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing\u2026' : 'Publish'}
            </button>
            {!isNew && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-sienna py-2 hover:text-terracotta transition-colors"
              >
                Delete Article
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-50" onClick={() => setConfirmDelete(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment border border-ink/10 shadow-xl p-8 max-w-sm w-full">
            <h3 className="font-display font-bold text-xl">Delete article?</h3>
            <p className="font-body text-[14px] text-slate mt-2">
              This can&rsquo;t be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(false)}
                className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] border border-ink/10 py-2.5 px-5 hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
