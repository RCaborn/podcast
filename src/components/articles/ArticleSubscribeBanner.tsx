import Eyebrow from '../ui/Eyebrow'
import SubscribeForm from '../ui/SubscribeForm'

export default function ArticleSubscribeBanner() {
  return (
    <div className="mx-auto max-w-[680px] px-4 sm:px-6 mt-16">
      <div className="bg-stone border-t border-terracotta/30 py-10 px-8">
        <Eyebrow>Never miss an issue</Eyebrow>

        <h3 className="font-display font-bold text-[26px] mt-4 leading-snug">
          The Counter Culture Weekly.
        </h3>

        <p className="font-body text-[14px] text-slate mt-3 max-w-[420px] leading-relaxed">
          Every week: the news independents actually need, stories from the
          trade, and one thing worth arguing about.
        </p>

        <div className="mt-6">
          <SubscribeForm
            variant="stacked"
            dark={false}
            source="article-footer"
            showFirstName={false}
          />
        </div>
      </div>
    </div>
  )
}
