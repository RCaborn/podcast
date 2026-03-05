import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMemberDirectory } from '../hooks/useMemberDirectory'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import Eyebrow from '../components/ui/Eyebrow'
import type { Profile } from '../types/database'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TRADE_TYPES = [
  { value: '', label: 'All' },
  { value: 'deli', label: 'Deli' },
  { value: 'butcher', label: 'Butcher' },
  { value: 'cheesemonger', label: 'Cheesemonger' },
  { value: 'farm-shop', label: 'Farm Shop' },
  { value: 'grocer', label: 'Grocer' },
] as const

const tradeTypeLabels: Record<string, string> = {
  deli: 'Deli',
  butcher: 'Butcher',
  cheesemonger: 'Cheesemonger',
  'farm-shop': 'Farm Shop',
  grocer: 'Grocer',
  other: 'Other',
}

/* ------------------------------------------------------------------ */
/*  Member Card                                                        */
/* ------------------------------------------------------------------ */

function MemberCard({ member }: { member: Profile }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link
      to={`/profile/${member.id}`}
      className="group relative block aspect-square overflow-hidden cursor-pointer"
    >
      {/* Placeholder bg while loading */}
      <div className="absolute inset-0 bg-stone" />

      <img
        src={member.shop_photo_url ?? ''}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 group-hover:scale-[1.02] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(44,36,22,0.92) 0%, rgba(44,36,22,0.4) 50%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {member.trade_type && (
          <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-brass">
            {tradeTypeLabels[member.trade_type] ?? member.trade_type}
          </span>
        )}
        <p className="font-body font-semibold text-sm text-warm-white leading-snug mt-0.5">
          {member.shop_name ?? member.full_name}
        </p>
        {member.region && (
          <p className="font-ui text-[11px] text-warm-white/60 mt-0.5">
            {member.region}
          </p>
        )}
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DirectoryPage() {
  usePageTitle('The Directory')

  const { user } = useAuth()
  const [tradeType, setTradeType] = useState('')
  const [regionInput, setRegionInput] = useState('')
  const [debouncedRegion, setDebouncedRegion] = useState('')

  // Debounce region input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedRegion(regionInput), 300)
    return () => clearTimeout(timer)
  }, [regionInput])

  const { members, loading } = useMemberDirectory(
    tradeType || undefined,
    debouncedRegion || undefined,
  )

  return (
    <section className="py-16 sm:py-24">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <Eyebrow>Counter Culture Members</Eyebrow>
        <h1 className="font-display font-bold text-4xl sm:text-5xl mt-2">The Directory</h1>
        <p className="font-display italic text-slate text-lg mt-2">The independents behind the counter.</p>
        <div className="mt-4 flex flex-col gap-1">
          <div className="h-[3px] bg-ink" />
          <div className="h-px bg-ink/10" />
        </div>
      </header>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Trade type pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
            {TRADE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTradeType(t.value)}
                className={`shrink-0 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] px-4 py-2 transition-colors ${
                  tradeType === t.value
                    ? 'bg-ink text-warm-white'
                    : 'border border-ink/20 text-slate hover:bg-ink/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Region search */}
          <div className="flex items-center gap-3 ml-auto">
            <input
              type="text"
              value={regionInput}
              onChange={(e) => setRegionInput(e.target.value)}
              placeholder="Filter by region..."
              className="font-body text-sm p-2 border border-ink/20 bg-parchment text-ink placeholder:text-ink/30 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none w-48"
            />
            <span className="font-ui text-[11px] text-slate/50 shrink-0">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square skeleton" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-ink/60 italic">
              The directory is empty &mdash; be the first to add your shop photo.
            </p>
            {user ? (
              <Link
                to={`/profile/${user.id}`}
                className="inline-block font-ui text-sm font-semibold uppercase tracking-[0.2em] bg-ink text-warm-white px-6 py-3 mt-4 hover:bg-charcoal transition-colors"
              >
                Go to your profile
              </Link>
            ) : (
              <Link
                to="/join"
                className="inline-block font-ui text-sm font-semibold uppercase tracking-[0.2em] bg-ink text-warm-white px-6 py-3 mt-4 hover:bg-charcoal transition-colors"
              >
                Join Counter Culture
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>

      {/* CTA below grid */}
      {members.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 text-center">
          <p className="font-body italic text-sm text-slate/60">
            Not in the directory yet?{' '}
            {user ? (
              <Link to={`/profile/${user.id}`} className="text-terracotta hover:text-sienna underline">
                Add your shop photo to appear here &rarr;
              </Link>
            ) : (
              <Link to="/join" className="text-terracotta hover:text-sienna underline">
                Join to add your shop photo &rarr;
              </Link>
            )}
          </p>
        </div>
      )}
    </section>
  )
}
