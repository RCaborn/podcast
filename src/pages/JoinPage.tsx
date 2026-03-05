import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import Button from '../components/ui/Button'

const inputClass =
  'w-full font-body text-sm p-3 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none'

export default function JoinPage() {
  usePageTitle('Join')

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [shopName, setShopName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: err } = await signUp(email, password, fullName, shopName || undefined)
    setSubmitting(false)

    if (err) {
      setError(err)
    } else {
      navigate('/community')
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl">
          Pull up a stool.
        </h1>
        <p className="font-body text-charcoal/60 mt-3 leading-relaxed">
          Join the community of independent food retailers who share what
          actually works.
        </p>

        <div className="w-16 h-[2px] bg-terracotta mt-6 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5">
              Full name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rosa Capaldi"
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5">
              Shop name <span className="font-normal text-charcoal/30">(optional)</span>
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Rosa's Deli, Edinburgh"
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rosa@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating account…' : 'Join Counter Culture'}
          </Button>
        </form>

        <p className="font-body text-sm text-charcoal/50 mt-6 text-center">
          Already a member?{' '}
          <Link to="/login" className="text-terracotta hover:text-sienna font-medium">
            Sign in.
          </Link>
        </p>
      </div>
    </section>
  )
}
