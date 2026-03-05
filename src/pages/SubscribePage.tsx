import { Link } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import SubscribeForm from '../components/ui/SubscribeForm'
import { usePageTitle } from '../hooks/usePageTitle'

export default function SubscribePage() {
  usePageTitle('Subscribe')

  return (
    <section
      className="min-h-screen grid-paper relative"
      style={{
        background: 'linear-gradient(160deg, #faf8f4 0%, #f0ece4 50%, #e8f0e5 100%)',
      }}
    >
      <div className="mx-auto max-w-[520px] px-4 sm:px-6 py-24 relative z-10">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        {/* Tagline */}
        <p className="font-display italic text-slate text-[20px] text-center mt-6 mb-10">
          For independents who give a damn.
        </p>

        {/* Rule */}
        <div className="h-px bg-terracotta/30 mb-10" />

        {/* Heading */}
        <h1
          className="font-display font-bold text-ink text-center leading-snug"
          style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
        >
          The Counter Culture Weekly.
        </h1>

        {/* Subtext */}
        <div className="mt-6 space-y-4 text-center">
          <p className="font-body text-[16px] text-slate leading-[1.7]">
            One email, every week.
          </p>
          <p className="font-body text-[16px] text-slate leading-[1.7]">
            Independent food retail news, real stories from the trade, and
            the conversations your suppliers don&rsquo;t want you having.
          </p>
          <p className="font-body text-[16px] text-slate leading-[1.7]">
            Join the independents who give a damn.
          </p>
        </div>

        {/* Form */}
        <div className="mt-10">
          <SubscribeForm
            variant="stacked"
            dark={false}
            source="subscribe-page"
            showFirstName={true}
          />
        </div>

        {/* Sign-in link */}
        <p className="text-center mt-8">
          <Link
            to="/login"
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-slate/50 hover:text-slate transition-colors"
          >
            Already a member of Counter Culture? Sign in &rarr;
          </Link>
        </p>
      </div>
    </section>
  )
}
