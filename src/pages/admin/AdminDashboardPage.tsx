import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

interface Stats {
  totalArticles: number
  published: number
  drafts: number
  totalThreads: number
  totalReplies: number
  homepageSlots: number
}

export default function AdminDashboardPage() {
  usePageTitle('Dashboard — Admin')
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      const [articles, threads, replies, featured] = await Promise.all([
        supabase.from('articles').select('id, status'),
        supabase.from('threads').select('id', { count: 'exact', head: true }),
        supabase.from('replies').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id').not('featured_position', 'is', null),
      ])

      const arts = (articles.data ?? []) as { id: string; status: string }[]

      setStats({
        totalArticles: arts.length,
        published: arts.filter((a) => a.status === 'published').length,
        drafts: arts.filter((a) => a.status === 'draft').length,
        totalThreads: threads.count ?? 0,
        totalReplies: replies.count ?? 0,
        homepageSlots: (featured.data ?? []).length,
      })
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-ink">Dashboard</h1>
      <div className="h-[2px] bg-terracotta w-12 mt-3" />

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StatCard
            number={stats.totalArticles}
            label="Articles"
            detail={`${stats.published} published · ${stats.drafts} drafts`}
          />
          <StatCard
            number={stats.totalThreads}
            label="Threads"
            detail={`${stats.totalReplies} total replies`}
          />
          <StatCard
            number={stats.homepageSlots}
            label="Homepage slots filled"
            detail="out of 11"
          />
        </div>
      )}

      {/* Quick actions */}
      <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-slate mt-12 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/articles/new"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-ink text-warm-white py-3 px-6 hover:bg-charcoal transition-colors"
        >
          Write new article
        </Link>
        <Link
          to="/admin/homepage"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-parchment text-ink border border-ink/8 py-3 px-6 hover:bg-cream transition-colors"
        >
          Curate homepage
        </Link>
        <Link
          to="/admin/community"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] bg-parchment text-ink border border-ink/8 py-3 px-6 hover:bg-cream transition-colors"
        >
          Moderate community
        </Link>
      </div>
    </div>
  )
}

function StatCard({ number, label, detail }: { number: number; label: string; detail: string }) {
  return (
    <div className="bg-parchment border border-ink/8 p-6">
      <p className="font-display font-bold text-[32px] text-ink">{number}</p>
      <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-slate mt-1">
        {label}
      </p>
      <p className="font-body text-[13px] text-slate/60 mt-2">{detail}</p>
    </div>
  )
}
