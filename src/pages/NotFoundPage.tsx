import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Page Not Found')

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-ochre-600">
        404
      </p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl mt-4">
        Lost behind the counter?
      </h1>
      <p className="font-body text-charcoal/60 mt-3 max-w-md leading-relaxed">
        The page you&rsquo;re looking for doesn&rsquo;t exist. It may have been
        moved, or you might have mistyped the address.
      </p>
      <div className="w-16 h-[2px] bg-ochre-600 mt-6 mb-6" />
      <Link
        to="/"
        className="font-ui font-bold uppercase text-sm tracking-[0.2em] text-ochre-600 hover:text-ochre-700 transition-colors"
      >
        Back to home &rarr;
      </Link>
    </section>
  )
}
