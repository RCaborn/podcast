import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import SectionHeader from '../../components/ui/SectionHeader'
import Tag from '../../components/ui/Tag'
import Avatar from '../../components/ui/Avatar'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import { mapAvatarColor } from '../../lib/avatarColor'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminUsers() {
  usePageTitle('Admin — Members')

  const { users, loading, error } = useAdminUsers()

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="flex gap-4 mb-8">
          <Link to="/admin" className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal/50 hover:text-charcoal">
            Dashboard
          </Link>
          <span className="text-charcoal/20">/</span>
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-charcoal">
            Members
          </span>
        </nav>

        <SectionHeader eyebrow="Admin" title="Members" />

        {loading && (
          <p className="font-body text-charcoal/50 mt-8">Loading…</p>
        )}

        {error && (
          <p className="font-body text-sm text-red-600 mt-8">{error}</p>
        )}

        {!loading && !error && (
          <div className="mt-10 divide-y divide-charcoal/10">
            {users.map((u) => (
              <div key={u.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar
                    initials={u.avatar_initials ?? '??'}
                    color={mapAvatarColor(u.avatar_colour)}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-body font-medium text-charcoal truncate">
                        {u.full_name}
                      </h3>
                      <Tag variant={u.role === 'admin' ? 'filled' : 'outlined'}>
                        {u.role}
                      </Tag>
                    </div>
                    <p className="font-ui text-xs text-charcoal/40 mt-0.5">
                      {u.shop_name && `${u.shop_name} · `}Joined {formatDate(u.created_at)}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/admin/users/${u.id}`}
                  className="font-ui text-xs font-semibold uppercase tracking-wider text-ochre-600 hover:text-ochre-700 shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}

            {users.length === 0 && (
              <p className="font-body text-charcoal/50 py-8 text-center">
                No members yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
