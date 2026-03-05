interface TagProps {
  children: React.ReactNode
  variant?: 'filled' | 'outlined'
  contentType?: 'Newsletter' | 'Success Story' | 'Opinion' | 'Industry News' | 'Community'
  className?: string
}

const contentTypeColors: Record<string, { filled: string; outlined: string }> = {
  'Newsletter': {
    filled: 'bg-terracotta text-warm-white',
    outlined: 'border border-terracotta text-terracotta',
  },
  'Success Story': {
    filled: 'bg-olive text-warm-white',
    outlined: 'border border-olive text-olive',
  },
  'Opinion': {
    filled: 'bg-sienna text-warm-white',
    outlined: 'border border-sienna text-sienna',
  },
  'Industry News': {
    filled: 'bg-brass text-warm-white',
    outlined: 'border border-brass text-brass',
  },
  'Community': {
    filled: 'bg-olive text-warm-white',
    outlined: 'border border-olive text-olive',
  },
}

const defaultColors = {
  filled: 'bg-terracotta text-warm-white',
  outlined: 'border border-terracotta text-terracotta',
}

export default function Tag({ children, variant = 'filled', contentType, className = '' }: TagProps) {
  const base = 'inline-block font-ui text-xs font-semibold uppercase tracking-wider px-3 py-1'
  const colors = contentType ? (contentTypeColors[contentType] ?? defaultColors) : defaultColors

  return <span className={`${base} ${colors[variant]} ${className}`}>{children}</span>
}
