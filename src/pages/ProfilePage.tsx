import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { mapAvatarColor } from '../lib/avatarColor'
import Avatar from '../components/ui/Avatar'
import Eyebrow from '../components/ui/Eyebrow'
import type { Profile } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const tradeTypeLabels: Record<string, string> = {
  deli: 'Deli',
  butcher: 'Butcher',
  cheesemonger: 'Cheesemonger',
  'farm-shop': 'Farm Shop',
  grocer: 'Grocer',
  other: 'Other',
}

const tradeTypeOptions: { value: Profile['trade_type']; label: string }[] = [
  { value: null, label: 'Select...' },
  { value: 'deli', label: 'Deli' },
  { value: 'butcher', label: 'Butcher' },
  { value: 'cheesemonger', label: 'Cheesemonger' },
  { value: 'farm-shop', label: 'Farm Shop' },
  { value: 'grocer', label: 'Grocer' },
  { value: 'other', label: 'Other' },
]

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const inputClass =
  'w-full font-body text-sm p-3 border border-ink/20 bg-parchment text-ink placeholder:text-ink/30 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none'

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

/* ------------------------------------------------------------------ */
/*  Face Photo                                                         */
/* ------------------------------------------------------------------ */

function FacePhoto({
  profile,
  isOwn,
  onUpload,
}: {
  profile: Profile
  isOwn: boolean
  onUpload?: (file: File) => Promise<unknown>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayUrl = preview ?? profile.face_photo_url

  async function handleFile(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be under 2MB')
      return
    }
    setError(null)
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      await onUpload?.(file)
    } catch {
      setError('Upload failed. Please try again.')
      setPreview(null)
    }
    setUploading(false)
  }

  const size = 'w-[72px] h-[72px] sm:w-[72px] sm:h-[72px]'
  const mobileSize = 'w-[56px] h-[56px] sm:w-[72px] sm:h-[72px]'

  return (
    <div className="relative -mt-9">
      {displayUrl ? (
        <img
          src={displayUrl}
          alt=""
          className={`${mobileSize} rounded-full object-cover ring-4 ring-parchment ${uploading ? 'opacity-50' : ''}`}
        />
      ) : (
        <Avatar
          initials={profile.avatar_initials ?? '??'}
          color={mapAvatarColor(profile.avatar_colour ?? null)}
          size="lg"
          className={`${size} ring-4 ring-parchment !text-[22px] font-ui ${uploading ? 'opacity-50' : ''}`}
        />
      )}
      {uploading && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-ui text-warm-white">
          ...
        </span>
      )}
      {isOwn && (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="block font-ui text-[11px] text-slate/50 underline mt-1 hover:text-slate"
          >
            Change photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </>
      )}
      {error && <p className="font-body text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shop Hero                                                          */
/* ------------------------------------------------------------------ */

function ShopHero({
  profile,
  isOwn,
  onUpload,
}: {
  profile: Profile
  isOwn: boolean
  onUpload?: (file: File) => Promise<unknown>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayUrl = preview ?? profile.shop_photo_url

  async function handleFile(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Shop photo must be under 5MB')
      return
    }
    setError(null)
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      await onUpload?.(file)
    } catch {
      setError('Upload failed. Please try again.')
      setPreview(null)
    }
    setUploading(false)
  }

  return (
    <div className="relative w-full h-[220px] sm:h-[320px]">
      {displayUrl ? (
        <>
          <img
            src={displayUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(44,36,22,0.5) 0%, transparent 50%)' }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
              <span className="font-ui text-sm text-warm-white uppercase tracking-wider">Uploading...</span>
            </div>
          )}
          {profile.shop_photo_caption && (
            <p className="absolute bottom-3 left-4 font-body text-xs text-warm-white/60" style={{ fontWeight: 300 }}>
              {profile.shop_photo_caption}
            </p>
          )}
          {isOwn && (
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-4 font-ui text-[11px] text-warm-white/60 underline hover:text-warm-white"
            >
              Change shop photo
            </button>
          )}
        </>
      ) : (
        <div className="grid-paper bg-stone w-full h-full flex items-center justify-center">
          <span className="font-ui text-sm uppercase tracking-wider text-slate/30">
            No shop photo yet
          </span>
          {isOwn && (
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 font-ui text-xs font-semibold uppercase tracking-[0.2em] bg-warm-white border border-ink text-ink px-5 py-2.5 hover:bg-cream transition-colors"
            >
              Add your shop photo
            </button>
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && (
        <p className="absolute bottom-14 left-4 font-body text-xs text-red-400 bg-ink/60 px-2 py-1">{error}</p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Edit Form                                                          */
/* ------------------------------------------------------------------ */

function EditForm({
  profile,
  onSave,
  onCancel,
}: {
  profile: Profile
  onSave: (fields: Partial<Omit<Profile, 'id' | 'created_at'>>) => Promise<{ error: string | null }>
  onCancel: () => void
}) {
  const [fullName, setFullName] = useState(profile.full_name)
  const [shopName, setShopName] = useState(profile.shop_name ?? '')
  const [tradeType, setTradeType] = useState(profile.trade_type ?? '')
  const [region, setRegion] = useState(profile.region ?? '')
  const [yearsTrading, setYearsTrading] = useState(profile.years_trading?.toString() ?? '')
  const [tagline, setTagline] = useState(profile.tagline ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [shopPhotoCaption, setShopPhotoCaption] = useState(profile.shop_photo_caption ?? '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('idle')

    const { error } = await onSave({
      full_name: fullName,
      shop_name: shopName || null,
      trade_type: (tradeType as Profile['trade_type']) || null,
      region: region || null,
      years_trading: yearsTrading ? parseInt(yearsTrading, 10) : null,
      tagline: tagline || null,
      bio: bio || null,
      shop_photo_caption: shopPhotoCaption || null,
    })

    setSaving(false)
    setStatus(error ? 'error' : 'saved')
  }

  // Auto-dismiss saved status
  useEffect(() => {
    if (status === 'saved') {
      const timer = setTimeout(() => setStatus('idle'), 2000)
      return () => clearTimeout(timer)
    }
  }, [status])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Full name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Shop name</label>
        <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Trade type</label>
        <select value={tradeType} onChange={(e) => setTradeType(e.target.value)} className={inputClass}>
          {tradeTypeOptions.map((opt) => (
            <option key={opt.value ?? ''} value={opt.value ?? ''}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Region</label>
        <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. South Yorkshire" className={inputClass} />
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Years trading</label>
        <input type="number" value={yearsTrading} onChange={(e) => setYearsTrading(e.target.value)} min={0} className={inputClass} />
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Tagline</label>
        <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value.slice(0, 100))} placeholder="One-line bio, max 100 chars" className={inputClass} />
        <p className="font-ui text-[10px] text-ink/30 mt-0.5 text-right">{tagline.length}/100</p>
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Bio</label>
        <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className={inputClass + ' resize-y'} />
      </div>
      <div>
        <label className="font-ui text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-1">Shop photo caption</label>
        <input type="text" value={shopPhotoCaption} onChange={(e) => setShopPhotoCaption(e.target.value)} placeholder="e.g. 'The counter at Westgate Deli, Bristol'" className={inputClass} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="font-ui font-bold uppercase text-sm tracking-[0.2em] bg-ink text-warm-white px-6 py-3 hover:bg-charcoal transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        <button type="button" onClick={onCancel} className="font-ui text-xs uppercase tracking-wider text-ink/50 hover:text-ink">
          Cancel
        </button>
        {status === 'saved' && <span className="font-ui text-[11px] text-olive">Saved.</span>}
        {status === 'error' && <span className="font-ui text-[11px] text-red-600">Something went wrong.</span>}
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { profile, threads, notices, loading, error, updateProfile, uploadFace, uploadShop } = useProfile(userId)
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  const isOwn = !!user && user.id === userId

  usePageTitle(profile?.full_name ?? 'Profile')

  if (loading) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="skeleton w-full h-[220px] sm:h-[320px]" />
          <div className="px-4 sm:px-6 mt-6">
            <div className="skeleton w-[72px] h-[72px] rounded-full -mt-9" />
            <div className="skeleton h-8 w-48 mt-4" />
            <div className="skeleton h-4 w-32 mt-2" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-display text-2xl">Profile not found</p>
        <Link to="/community" className="font-ui text-sm uppercase tracking-wider text-terracotta hover:text-sienna">
          Back to community
        </Link>
      </div>
    )
  }

  return (
    <section>
      {/* Shop hero */}
      <ShopHero profile={profile} isOwn={isOwn} onUpload={uploadShop} />

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left column — profile info */}
          <div className="flex-1 min-w-0">
            <FacePhoto profile={profile} isOwn={isOwn} onUpload={uploadFace} />

            {editing ? (
              <EditForm
                profile={profile}
                onSave={async (fields) => {
                  const result = await updateProfile(fields)
                  if (!result.error) setEditing(false)
                  return result
                }}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <div className="mt-4">
                <h1 className="font-display font-bold text-3xl">{profile.full_name}</h1>
                {profile.shop_name && (
                  <p className="font-ui text-sm uppercase tracking-[0.15em] text-sienna mt-1">
                    {profile.shop_name}
                  </p>
                )}

                <p className="font-ui text-[11px] uppercase tracking-[0.15em] text-slate mt-2">
                  {[
                    profile.region,
                    profile.trade_type ? tradeTypeLabels[profile.trade_type] : null,
                    profile.years_trading ? `${profile.years_trading} yrs trading` : null,
                  ].filter(Boolean).join(' \u00B7 ')}
                </p>

                {profile.tagline && (
                  <p className="font-display italic text-base text-slate mt-4">
                    {profile.tagline}
                  </p>
                )}

                {profile.bio && (
                  <p className="font-body text-sm text-slate mt-4" style={{ lineHeight: 1.7 }}>
                    {profile.bio}
                  </p>
                )}

                <p className="font-body text-[11px] text-slate/50 mt-6" style={{ fontWeight: 300 }}>
                  Member since {formatDate(profile.created_at)}
                </p>

                {isOwn && (
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 font-ui text-xs font-semibold uppercase tracking-[0.2em] bg-warm-white border border-ink text-ink px-5 py-2.5 hover:bg-cream transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right column — threads & notices */}
          <div className="w-full lg:w-[400px] shrink-0 pt-6 lg:pt-16">
            {/* Threads */}
            <Eyebrow>Threads</Eyebrow>
            {threads.length > 0 ? (
              <div className="mt-3 space-y-3">
                {threads.map((t) => (
                  <Link key={t.id} to={`/community/${t.id}`} className="block group">
                    <h4 className="font-body font-semibold text-sm text-ink group-hover:text-sienna transition-colors leading-snug">
                      {t.title}
                    </h4>
                    <p className="font-ui text-[11px] text-slate/50 mt-0.5">
                      {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'} &middot; {timeAgo(t.created_at)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-body text-[13px] text-slate/50 italic mt-3">No threads yet.</p>
            )}

            {/* Notices */}
            <div className="mt-8">
              <Eyebrow>Notice Board</Eyebrow>
              {notices.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {notices.map((n) => (
                    <div key={n.id}>
                      <h4 className="font-body font-semibold text-sm text-ink leading-snug">
                        {n.title}
                      </h4>
                      <p className="font-ui text-[11px] text-slate/50 mt-0.5">
                        {n.type.replace(/-/g, ' ')} &middot; {timeAgo(n.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-body text-[13px] text-slate/50 italic mt-3">No notices yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
