interface EyebrowProps {
  children: React.ReactNode
  rule?: boolean
  className?: string
}

export default function Eyebrow({ children, rule = false, className = '' }: EyebrowProps) {
  if (rule) {
    return (
      <span className={`inline-flex items-center gap-3 font-ui text-xs font-semibold uppercase tracking-[0.15em] text-terracotta ${className}`}>
        {children}
        <span className="flex-1 h-px bg-terracotta/25" />
      </span>
    )
  }

  return (
    <span
      className={`font-ui text-xs font-semibold uppercase tracking-[0.15em] text-terracotta ${className}`}
    >
      {children}
    </span>
  )
}
