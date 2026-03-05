import Logo from '../ui/Logo'

export default function Footer() {
  return (
    <footer className="border-t-2 border-terracotta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap items-center justify-between gap-4">
        <Logo size="sm" />
        <div className="font-ui text-sm text-charcoal/50 text-right">
          <p>Brand Identity System &middot; 2026</p>
          <p>For independents who give a damn.</p>
        </div>
      </div>
    </footer>
  )
}
