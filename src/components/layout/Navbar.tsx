import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { mapAvatarColor } from '../../lib/avatarColor'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles/latest', label: 'Articles' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/community', label: 'Community' },
]

const linkClass =
  'font-ui font-semibold uppercase text-sm tracking-[0.2em] text-charcoal/70 hover:text-charcoal transition-colors'
const activeLinkClass =
  'font-ui font-semibold uppercase text-sm tracking-[0.2em] text-charcoal transition-colors'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, loading } = useAuth()

  const isLoggedIn = !loading && !!user

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 bg-[rgba(250,248,244,0.9)] backdrop-blur-[16px] border-b border-stone"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth area */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                className="font-ui font-semibold uppercase text-xs tracking-[0.2em] text-charcoal/70 hover:text-charcoal transition-colors"
              >
                My Profile
              </Link>
              <Link to={`/profile/${user.id}`}>
                <Avatar
                  initials={profile?.avatar_initials ?? '??'}
                  color={mapAvatarColor(profile?.avatar_colour ?? null)}
                  size="sm"
                />
              </Link>
            </>
          ) : (
            <Link
              to="/join"
              className="inline-flex items-center justify-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-charcoal text-warm-white px-5 py-2 hover:bg-ink transition-colors"
            >
              Join
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden p-2 text-charcoal"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/30 z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-warm-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="p-2 text-charcoal"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <Link
              to={`/profile/${user.id}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 mt-2"
            >
              <Avatar
                initials={profile?.avatar_initials ?? '??'}
                color={mapAvatarColor(profile?.avatar_colour ?? null)}
                size="sm"
              />
              <span className="font-ui font-semibold uppercase text-xs tracking-[0.2em] text-charcoal/70">
                My Profile
              </span>
            </Link>
          ) : (
            <Link
              to="/join"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center font-ui font-bold uppercase text-sm tracking-[0.2em] bg-charcoal text-warm-white px-5 py-3 hover:bg-ink transition-colors mt-2"
            >
              Join
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
