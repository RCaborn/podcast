import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function AdminGuard() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="skeleton h-8 w-48" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="font-display font-bold text-3xl text-ink">
            Access denied
          </h1>
          <p className="font-body text-slate mt-4 leading-relaxed">
            This area is restricted to Counter Culture editors. If you believe
            you should have access, get in touch with the team.
          </p>
          <Link
            to="/"
            className="inline-block font-ui text-sm font-semibold uppercase tracking-[0.2em] text-terracotta mt-6 hover:text-sienna transition-colors"
          >
            &larr; Back to Counter Culture
          </Link>
        </div>
      </div>
    )
  }

  return <Outlet />
}
