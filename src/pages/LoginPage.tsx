import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

const inputClass =
  'w-full font-body text-sm p-3 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 focus:border-ochre-600 focus:ring-1 focus:ring-ochre-600 focus:outline-none'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: err } = await signIn(email, password)
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
          Welcome back.
        </h1>

        <div className="w-16 h-[2px] bg-ochre-600 mt-6 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="font-body text-sm text-charcoal/50 mt-6 text-center">
          Not a member yet?{' '}
          <Link to="/join" className="text-ochre-600 hover:text-ochre-700 font-medium">
            Join us.
          </Link>
        </p>
      </div>
    </section>
  )
}
