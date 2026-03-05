import { useState, type FormEvent } from 'react'
import { useSubscribe } from '../../hooks/useSubscribe'

interface SubscribeFormProps {
  source: string
  variant: 'inline' | 'stacked'
  showFirstName?: boolean
  dark?: boolean
}

/* Terracotta check-circle SVG, 20px */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SubscribeForm({
  source,
  variant,
  showFirstName = false,
  dark = false,
}: SubscribeFormProps) {
  const { subscribe, loading, result } = useSubscribe()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')

  const isInline = variant === 'inline'

  /* Colour tokens */
  const inputBorder = dark ? 'border-warm-white/20' : 'border-ink/20'
  const inputBg = dark ? 'bg-warm-white/10' : 'bg-parchment'
  const inputText = dark ? 'text-warm-white placeholder:text-warm-white/40' : 'text-ink placeholder:text-ink/30'
  const btnBg = dark ? 'bg-warm-white text-ink hover:bg-cream' : 'bg-ink text-warm-white hover:bg-charcoal'
  const consentColor = dark ? 'text-warm-white/40' : 'text-slate/60'
  const successText = dark ? 'text-warm-white' : 'text-ink'
  const errorText = dark ? 'text-warm-white/80' : 'text-sienna'

  const inputClass = `w-full font-body text-[14px] border ${inputBorder} ${inputBg} ${inputText} py-3 px-4 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none`

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await subscribe({ email, firstName: showFirstName ? firstName : undefined, source })
  }

  /* Success / already-subscribed state — replaces the form */
  if (result && (result.status === 'success' || result.status === 'already-subscribed')) {
    return (
      <div
        className="flex items-center gap-3 animate-[fadeIn_300ms_ease]"
        style={{ opacity: 1 }}
      >
        <CheckIcon className="text-terracotta shrink-0" />
        <p className={`font-body text-[14px] ${successText}`}>
          {result.status === 'success'
            ? "You're in. First issue lands next Thursday."
            : "You're already on the list — see you next issue."}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Inputs + button */}
      <div className={isInline
        ? 'flex flex-col sm:flex-row gap-3'
        : 'flex flex-col gap-3'
      }>
        {showFirstName && (
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name (optional)"
            className={inputClass}
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`${inputClass} ${isInline ? 'sm:flex-1' : ''}`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`font-ui text-[11px] font-semibold uppercase tracking-[0.2em] ${btnBg} py-3 px-6 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          } ${isInline ? 'sm:w-auto w-full' : 'w-full'}`}
        >
          {loading ? 'Subscribing\u2026' : 'Subscribe'}
        </button>
      </div>

      {/* Consent line */}
      <p className={`font-body font-light text-[11px] ${consentColor} mt-3 leading-relaxed`}>
        Weekly newsletter. Independent food retail, no noise. Unsubscribe any time.
      </p>

      {/* Error state — inline below form */}
      {result && result.status === 'error' && (
        <p className={`font-body text-[13px] ${errorText} mt-2`}>
          {result.message}
        </p>
      )}
    </form>
  )
}
