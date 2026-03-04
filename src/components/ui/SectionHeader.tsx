import Eyebrow from './Eyebrow'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  className?: string
}

export default function SectionHeader({ eyebrow, title, className = '' }: SectionHeaderProps) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl font-bold text-charcoal mt-2">{title}</h2>
      <div className="w-16 h-[2px] bg-ochre-600 mt-4" />
    </div>
  )
}
