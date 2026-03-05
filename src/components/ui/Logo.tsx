interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
}

const sizeStyles = {
  sm: { counter: 'text-xl', culture: 'text-[0.6rem] tracking-[0.35em]', rule: 'my-0.5' },
  md: { counter: 'text-3xl', culture: 'text-xs tracking-[0.4em]', rule: 'my-1' },
  lg: { counter: 'text-5xl', culture: 'text-sm tracking-[0.45em]', rule: 'my-1.5' },
}

const variantStyles = {
  light: { text: 'text-charcoal', rule: 'bg-terracotta' },
  dark: { text: 'text-warm-white', rule: 'bg-terracotta' },
}

export default function Logo({ size = 'md', variant = 'light' }: LogoProps) {
  const s = sizeStyles[size]
  const v = variantStyles[variant]

  return (
    <div className="inline-flex flex-col items-center">
      <span className={`font-display font-black leading-none ${s.counter} ${v.text}`}>
        Counter
      </span>
      <div className={`w-full h-[2px] ${s.rule} ${v.rule}`} />
      <span className={`font-ui font-bold uppercase leading-none ${s.culture} ${v.text}`}>
        Culture
      </span>
    </div>
  )
}
