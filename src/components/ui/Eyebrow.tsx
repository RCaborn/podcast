interface EyebrowProps {
  children: React.ReactNode
  className?: string
}

export default function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <span
      className={`font-ui text-xs font-semibold uppercase tracking-[0.15em] text-ochre-600 ${className}`}
    >
      {children}
    </span>
  )
}
