interface TagProps {
  children: React.ReactNode
  variant?: 'filled' | 'outlined'
  className?: string
}

export default function Tag({ children, variant = 'filled', className = '' }: TagProps) {
  const base = 'inline-block font-ui text-xs font-semibold uppercase tracking-wider px-3 py-1'

  const variants = {
    filled: 'bg-ochre-600 text-cream',
    outlined: 'border border-ochre-600 text-ochre-600',
  }

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
}
