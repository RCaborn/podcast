import SubscribeForm from '../ui/SubscribeForm'

export default function NewsletterSubscribePanel() {
  return (
    <section className="bg-charcoal relative overflow-hidden mx-[-16px] sm:mx-[-24px] lg:mx-[-32px]">
      {/* Decorative CC watermark */}
      <span
        className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 font-display text-[180px] leading-none text-white/[0.03] select-none pointer-events-none"
        aria-hidden="true"
      >
        CC
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-brass">
              The Counter Culture Weekly
            </p>

            <h2
              className="font-display font-bold text-warm-white mt-4 leading-snug"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              In your inbox. Every week.
            </h2>

            <p className="font-body text-[14px] text-warm-white/70 mt-4 max-w-[380px] leading-relaxed">
              No filler. No corporate speak. Just the news, the stories, and
              the conversations that matter to independents.
            </p>
          </div>

          {/* Right — form */}
          <div>
            <SubscribeForm
              variant="stacked"
              dark={true}
              source="newsletter-page"
              showFirstName={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
