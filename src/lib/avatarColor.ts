export function mapAvatarColor(c: string | null): 'olive' | 'terracotta' | 'charcoal' {
  if (c === 'olive' || c === 'olive-muted') return 'olive'
  if (c === 'terracotta') return 'terracotta'
  return 'charcoal'
}
