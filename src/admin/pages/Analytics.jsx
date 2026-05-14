import { useState, useEffect } from 'react'
import { Download, Eye, MessageSquare, BookOpen } from 'lucide-react'
import { supabase } from '../supabaseClient'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function buildTimeSeries(rows, dateField, days = 30) {
  const now = new Date()
  const points = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    points.push({ date: label, count: 0, _key: key })
  }
  rows.forEach(r => {
    const key = r[dateField]?.slice(0, 10)
    const pt = points.find(p => p._key === key)
    if (pt) pt.count++
  })
  return points.map(({ date, count }) => ({ date, count }))
}

function groupByField(rows, field, maxItems = 8) {
  const map = {}
  rows.forEach(r => {
    const k = r[field] || 'Unknown'
    map[k] = (map[k] || 0) + 1
  })
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxItems)
    .map(([name, count]) => ({
      name: name.length > 24 ? name.slice(0, 24) + '…' : name,
      count,
    }))
}

const TOOLTIP_STYLE = {
  contentStyle: {
    fontSize: 12,
    borderRadius: 8,
    border: '1px solid #E5E8EE',
    boxShadow: '0 6px 18px rgba(10,26,47,0.06)',
    padding: '8px 12px',
  },
  labelStyle: { color: '#0A1A2F', fontWeight: 600 },
  cursor: { fill: 'rgba(5,31,60,0.04)' },
}

function StatCard({ Icon, label, value, sub }) {
  return (
    <div className="a-stat">
      <div className="a-stat-label">
        <span style={{
          width: 26, height: 26, borderRadius: 7,
          background: '#0A1A2F', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={13} color="#fff" />
        </span>
        {label}
      </div>
      <div className="a-num">{value}</div>
      {sub && <div className="a-delta"><span>{sub}</span></div>}
    </div>
  )
}

function ChartPanel({ title, sub, children }) {
  return (
    <div className="a-panel">
      <div className="a-panel-head">
        <div>
          <div className="a-panel-title">{title}</div>
          {sub && <div className="a-panel-sub">{sub}</div>}
        </div>
      </div>
      <div style={{ padding: '20px 16px 12px' }}>{children}</div>
    </div>
  )
}

function EmptyChart({ message }) {
  return (
    <div style={{ padding: '44px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
      {message}
    </div>
  )
}

export default function Analytics() {
  const [downloads, setDownloads] = useState([])
  const [views, setViews] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: dl }, { data: bv }, { data: di }] = await Promise.all([
        supabase.from('pdf_downloads').select('*').order('downloaded_at', { ascending: true }),
        supabase.from('blog_views').select('*').order('viewed_at', { ascending: true }),
        supabase.from('deal_inquiries').select('*').order('submitted_at', { ascending: true }),
      ])
      setDownloads(dl || [])
      setViews(bv || [])
      setInquiries(di || [])
      setLoading(false)
    }
    load()
  }, [])

  const mostViewed = (() => {
    if (!views.length) return null
    const map = {}
    views.forEach(v => {
      const k = v.blog_title || 'Unknown'
      map[k] = (map[k] || 0) + 1
    })
    const [title, count] = Object.entries(map).sort(([, a], [, b]) => b - a)[0]
    return { title, count }
  })()

  const dlSeries = buildTimeSeries(downloads, 'downloaded_at')
  const viewSeries = buildTimeSeries(views, 'viewed_at')
  const dlPerDeal = groupByField(downloads, 'deal_title')
  const viewsPerPost = groupByField(views, 'blog_title')

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
        Loading analytics…
      </div>
    )
  }

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Analytics</div>
          <div className="a-page-sub">Track PDF downloads, blog views, and contact form submissions.</div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="a-stats">
        <StatCard
          Icon={Download}
          iconColor="#051F3C"
          label="PDF Downloads"
          value={downloads.length}
          sub="Total deal teaser downloads"
        />
        <StatCard
          Icon={Eye}
          iconColor="#2D5BE3"
          label="Blog Views"
          value={views.length}
          sub="Total blog post views"
        />
        <StatCard
          Icon={MessageSquare}
          iconColor="#C8A24B"
          label="Inquiries"
          value={inquiries.length}
          sub="Contact form submissions"
        />
        <StatCard
          Icon={BookOpen}
          iconColor="#1F8A5B"
          label="Top Blog Post"
          value={mostViewed ? mostViewed.count : 0}
          sub={
            mostViewed
              ? (mostViewed.title.length > 30 ? mostViewed.title.slice(0, 30) + '…' : mostViewed.title)
              : 'No views yet'
          }
        />
      </div>

      {/* Time-series area charts */}
      <div className="a-chart-grid">
        <ChartPanel title="PDF Downloads Over Time" sub="Last 30 days">
          {downloads.length === 0 ? (
            <EmptyChart message="No download data yet. Downloads will appear here once visitors open deal teasers." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dlSeries}>
                <defs>
                  <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#051F3C" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#051F3C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10.5, fill: '#6A788E' }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10.5, fill: '#6A788E' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Downloads"
                  stroke="#051F3C"
                  fill="url(#dlGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>

        <ChartPanel title="Blog Views Over Time" sub="Last 30 days">
          {views.length === 0 ? (
            <EmptyChart message="No view data yet. Views will appear here once visitors read blog posts." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={viewSeries}>
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D5BE3" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2D5BE3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10.5, fill: '#6A788E' }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10.5, fill: '#6A788E' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Views"
                  stroke="#2D5BE3"
                  fill="url(#viewGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>

      {/* Per-item breakdown bar charts */}
      <div className="a-chart-grid">
        <ChartPanel title="Downloads by Deal" sub="Top deals ranked by PDF download count">
          {dlPerDeal.length === 0 ? (
            <EmptyChart message="No download data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, dlPerDeal.length * 38)}>
              <BarChart
                data={dlPerDeal}
                layout="vertical"
                margin={{ left: 4, right: 20, top: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10.5, fill: '#6A788E' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10.5, fill: '#38465B' }}
                  tickLine={false}
                  axisLine={false}
                  width={128}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" name="Downloads" fill="#051F3C" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>

        <ChartPanel title="Views by Blog Post" sub="Top posts ranked by view count">
          {viewsPerPost.length === 0 ? (
            <EmptyChart message="No view data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, viewsPerPost.length * 38)}>
              <BarChart
                data={viewsPerPost}
                layout="vertical"
                margin={{ left: 4, right: 20, top: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10.5, fill: '#6A788E' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10.5, fill: '#38465B' }}
                  tickLine={false}
                  axisLine={false}
                  width={128}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" name="Views" fill="#2D5BE3" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>
    </>
  )
}
