import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Logo from '../ui/Logo'

const adminNav = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/homepage', label: 'Homepage' },
  { to: '/admin/community', label: 'Community' },
]

const linkBase =
  'block font-ui font-semibold uppercase text-xs tracking-[0.2em] py-2.5 px-4 border-l-2 transition-colors'
const linkIdle = `${linkBase} border-transparent text-warm-white/50 hover:text-warm-white/80`
const linkActive = `${linkBase} border-terracotta text-warm-white`

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-charcoal px-4 h-14">
        <Logo size="sm" variant="dark" />
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-warm-white/70"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <path d="M3 6h18M3 12h18M3 18h18" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-charcoal border-t border-warm-white/10 pb-4 px-4">
          <nav className="flex flex-col gap-1 mt-2">
            {adminNav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? linkActive : linkIdle}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block font-ui text-[10px] uppercase tracking-[0.2em] text-warm-white/30 hover:text-warm-white/50 transition-colors mt-4 px-4"
          >
            &larr; Back to site
          </Link>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-charcoal shrink-0 fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-warm-white/10">
          <Logo size="sm" variant="dark" />
          <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-warm-white/30 mt-2">
            Editorial
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-3 mt-2">
          {adminNav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => isActive ? linkActive : linkIdle}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-5 border-t border-warm-white/10">
          <Link
            to="/"
            className="font-ui text-[10px] uppercase tracking-[0.2em] text-warm-white/30 hover:text-warm-white/50 transition-colors"
          >
            &larr; Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56 bg-warm-white min-h-screen overflow-y-auto p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
