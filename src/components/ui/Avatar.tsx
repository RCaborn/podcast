interface AvatarProps {
  initials: string
  color?: 'olive' | 'terracotta' | 'charcoal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorStyles = {
  olive: 'bg-olive text-warm-white',
  terracotta: 'bg-terracotta text-warm-white',
  charcoal: 'bg-charcoal text-warm-white',
}

const sizeStyles = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
}

export default function Avatar({
  initials,
  color = 'olive',
  size = 'md',
  className = '',
}: AvatarProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-ui font-bold uppercase ${colorStyles[color]} ${sizeStyles[size]} ${className}`}
    >
      {initials.slice(0, 2)}
    </div>
  )
}
