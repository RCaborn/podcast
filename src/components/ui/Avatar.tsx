interface AvatarProps {
  initials: string
  color?: 'ochre' | 'forest' | 'charcoal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorStyles = {
  ochre: 'bg-ochre-600 text-cream',
  forest: 'bg-forest-800 text-cream',
  charcoal: 'bg-charcoal text-cream',
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
}

export default function Avatar({
  initials,
  color = 'forest',
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
