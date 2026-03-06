import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import SectionHeader from '../../components/ui/SectionHeader'
import Button from '../../components/ui/Button'
import { useAdminUser, useUserMutations } from '../../hooks/useAdminUsers'

const inputClass =
  'w-full font-body text-sm p-3 border border-charcoal/20 bg-cream text-charcoal placeholder:text-charcoal/30 focus:border-ochre-600 focus:ring-1 focus:ring-ochre-600 focus:outline-none'

const labelClass = 'font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/60 block mb-1.5'

export default function AdminUserEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  usePageTitle('Edit Member')

  const { user, loading: loadingUser } = useAdminUser(id)
  const { updateUser } = useUserMutations()

  const [fullName, setFullName] = useState('')
  const [shopName, setShopName] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [role, setRole] = useState<'member' | 'admin'>('member')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    setFullName(user.full_name)
    setShopName(user.shop_name ?? '')
    setLocation(user.location ?? '')
    setBio(user.bio ?? '')
    setRole(user.role)
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setError(null)
    setSubmitting(true)

    const { error: err } = await updateUser(id, {
      full_name: fullName,
      shop_name: shopName || null,
      location: location || null,
      bio: bio || null,
      role,
    })

    setSubmitting(false)

    if (err) {
      setError(err)
    } else {
      navigate('/admin/users')
    }
  }

  if (loadingUser) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="font-body text-charcoal/50">Loading…</p>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="font-body text-charcoal/50">Member not found.</p>
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
          <Link to="/admin/users" className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 hover:text-charcoal">
            Members
          </Link>
          <span className="text-charcoal/20">/</span>
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal">
            Edit
          </span>
        </nav>

        <SectionHeader eyebrow="Admin" title="Edit Member" />

        <form onSubmit={handleSubmit} className="space-y-5 mt-10">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Shop Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Optional"
              rows={4}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
              className={inputClass}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p className="font-body text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Saving…' : 'Update Member'}
          </Button>
        </form>
      </div>
    </section>
  )
}
