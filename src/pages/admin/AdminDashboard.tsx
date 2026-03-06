import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import SectionHeader from '../../components/ui/SectionHeader'
import { useAdminArticles } from '../../hooks/useAdminArticles'
import { useAdminUsers } from '../../hooks/useAdminUsers'

export default function AdminDashboard() {
  usePageTitle('Admin')

  const { articles, loading: loadingArticles } = useAdminArticles()
  const { users, loading: loadingUsers } = useAdminUsers()

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader eyebrow="Admin" title="Dashboard" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          <Link
            to="/admin/articles"
            className="block border border-charcoal/10 bg-cream p-8 hover:border-ochre-600 transition-colors group"
          >
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-ochre-600">
              Content
            </p>
            <h2 className="font-display font-bold text-2xl mt-2 group-hover:text-ochre-600 transition-colors">
              Articles
            </h2>
            <p className="font-body text-charcoal/60 mt-2">
              {loadingArticles ? '…' : `${articles.length} articles`}
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="block border border-charcoal/10 bg-cream p-8 hover:border-ochre-600 transition-colors group"
          >
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-ochre-600">
              Community
            </p>
            <h2 className="font-display font-bold text-2xl mt-2 group-hover:text-ochre-600 transition-colors">
              Members
            </h2>
            <p className="font-body text-charcoal/60 mt-2">
              {loadingUsers ? '…' : `${users.length} members`}
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
