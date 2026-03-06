import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import SectionHeader from '../../components/ui/SectionHeader'
import Button from '../../components/ui/Button'
import { useAdminArticle, useArticleMutations } from '../../hooks/useAdminArticles'

const inputClass =
  'w-full font-body text-sm p-3 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 focus:border-ochre-600 focus:ring-1 focus:ring-ochre-600 focus:outline-none'

const labelClass = 'font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminArticleEdit() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()

  usePageTitle(isEditing ? 'Edit Article' : 'New Article')

  const { article, loading: loadingArticle } = useAdminArticle(id)
  const { createArticle, updateArticle } = useArticleMutations()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorSource, setAuthorSource] = useState('')
  const [readTime, setReadTime] = useState('')
  const [cardStyle, setCardStyle] = useState<string>('light')
  const [issueNumber, setIssueNumber] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (!article) return
    setTitle(article.title)
    setSlug(article.slug)
    setSlugTouched(true)
    setExcerpt(article.excerpt ?? '')
    setBody(article.body ?? '')
    setTag(article.tag ?? '')
    setAuthorName(article.author_name ?? '')
    setAuthorSource(article.author_source ?? '')
    setReadTime(article.read_time?.toString() ?? '')
    setCardStyle(article.card_style ?? 'light')
    setIssueNumber(article.issue_number?.toString() ?? '')
    setImageUrl(article.image_url ?? '')
    setIsFeatured(article.is_featured)
    setPublishedAt(article.published_at ? article.published_at.slice(0, 16) : '')
  }, [article])

  // Auto-generate slug from title on create
  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const fields = {
      title,
      slug,
      excerpt: excerpt || null,
      body: body || null,
      tag: tag || null,
      author_name: authorName || null,
      author_source: authorSource || null,
      read_time: readTime ? parseInt(readTime, 10) : null,
      card_style: (cardStyle || null) as 'light' | 'cream' | null,
      issue_number: issueNumber ? parseInt(issueNumber, 10) : null,
      image_url: imageUrl || null,
      is_featured: isFeatured,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    }

    const result = isEditing
      ? await updateArticle(id, fields)
      : await createArticle(fields)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      navigate('/admin/articles')
    }
  }

  if (isEditing && loadingArticle) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="font-body text-charcoal/50">Loading…</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <nav className="flex gap-4 mb-8">
          <Link to="/admin" className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 hover:text-charcoal">
            Dashboard
          </Link>
          <span className="text-charcoal/20">/</span>
          <Link to="/admin/articles" className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 hover:text-charcoal">
            Articles
          </Link>
          <span className="text-charcoal/20">/</span>
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal">
            {isEditing ? 'Edit' : 'New'}
          </span>
        </nav>

        <SectionHeader eyebrow="Admin" title={isEditing ? 'Edit Article' : 'New Article'} />

        <form onSubmit={handleSubmit} className="space-y-5 mt-10">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true) }}
              placeholder="article-slug"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary…"
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Article content…"
              rows={16}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Newsletter, Opinion"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Card Style</label>
              <select
                value={cardStyle}
                onChange={(e) => setCardStyle(e.target.value)}
                className={inputClass}
              >
                <option value="light">Light</option>
                <option value="cream">Cream</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is-featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-ochre-600"
            />
            <label htmlFor="is-featured" className={labelClass + ' !mb-0'}>
              Featured Article
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Author Source</label>
              <input
                type="text"
                value={authorSource}
                onChange={(e) => setAuthorSource(e.target.value)}
                placeholder="e.g. Counter Culture Editorial"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Read Time (min)</label>
              <input
                type="number"
                min="1"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Issue Number</label>
              <input
                type="number"
                min="1"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Published At</label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="font-body text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting
              ? (isEditing ? 'Saving…' : 'Creating…')
              : (isEditing ? 'Update Article' : 'Create Article')}
          </Button>
        </form>
      </div>
    </section>
  )
}
