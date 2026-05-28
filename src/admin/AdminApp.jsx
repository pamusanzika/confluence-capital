import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Briefcase, BookOpen, Settings as SettingsIcon, LogOut,
  Search, ChevronRight, Menu, X, BarChart2, MessageSquare, TrendingUp, Mail, Layers,
} from 'lucide-react'
import { supabase } from './supabaseClient'
import './admin.css'
import logo from '../assets/logo2.png'

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import DealsList from './pages/deals/DealsList'
import DealForm from './pages/deals/DealForm'
import BlogList from './pages/blog/BlogList'
import BlogForm from './pages/blog/BlogForm'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import TestimonialsList from './pages/testimonials/TestimonialsList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import HomeStats from './pages/HomeStats'
import NewsletterList from './pages/NewsletterList'
import OpportunityCardsList from './pages/opportunities/OpportunityCardsList'
import OpportunityCardForm from './pages/opportunities/OpportunityCardForm'

const NAV = [
  { id: 'dashboard',     label: 'Dashboard',          Icon: LayoutDashboard },
  { id: 'deals',         label: 'Deals',               Icon: Briefcase },
  { id: 'blog',          label: 'Blog',                Icon: BookOpen },
  { id: 'testimonials',  label: 'Testimonials',        Icon: MessageSquare },
  { id: 'opportunities', label: 'Sample Debt Reports', Icon: Layers },
  { id: 'homestats',     label: 'Home Stats',          Icon: TrendingUp },
]
const NAV2 = [
  { id: 'analytics', label: 'Analytics', Icon: BarChart2 },
  { id: 'newsletter', label: 'Newsletter', Icon: Mail },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
]

/* ── Sidebar (plain <aside> — no fragment, no overlay here) ── */
function Sidebar({ active, onNav, counts, onLogout, user, isOpen, onClose }) {
  function handleNav(id) {
    onNav(id)
    onClose()
  }

  return (
    <aside className={`a-sidebar${isOpen ? ' open' : ''}`}>
      {/* Brand row with close button for mobile */}
      <div className="a-brand" style={{ flexDirection: 'column', paddingBottom: '16px' }}>
        <div className="a-brand-mark" style={{ background: '#051F3C', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '56px', marginBottom: '10px' }}>
          <img src={logo} alt="Logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
        </div>
        <div className="a-brand-text">
          <small style={{ fontSize: '12px', letterSpacing: '0.06em' }}>Admin Console</small>
        </div>
        {/* X close button — shown only on mobile/tablet via CSS */}
        <button
          className="a-sidebar-close-btn"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <div className="a-nav-label">Workspace</div>
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`a-nav-item${active === id ? ' active' : ''}`}
          onClick={() => handleNav(id)}
        >
          <span className="a-ico"><Icon size={17} /></span>
          <span>{label}</span>
          {id === 'deals' && counts.deals != null && (
            <span className="a-badge">{counts.deals}</span>
          )}
          {id === 'blog' && counts.blogs != null && (
            <span className="a-badge">{counts.blogs}</span>
          )}
          {id === 'testimonials' && counts.testimonials != null && (
            <span className="a-badge">{counts.testimonials}</span>
          )}
        </button>
      ))}

      <div className="a-nav-divider" />
      <div className="a-nav-label">System</div>
      {NAV2.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`a-nav-item${active === id ? ' active' : ''}`}
          onClick={() => handleNav(id)}
        >
          <span className="a-ico"><Icon size={17} /></span>
          <span>{label}</span>
        </button>
      ))}

      <div className="a-side-footer">
        <div className="a-avatar">{user?.email?.[0]?.toUpperCase() || 'A'}</div>
        <div className="a-who" style={{ minWidth: 0 }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#fff' }}>
            {user?.email || 'Admin'}
          </div>
          <small>Workspace admin</small>
        </div>
        <button className="a-logout-btn" title="Sign out" onClick={onLogout}>
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}

/* ── Top bar ── */
function TopBar({ crumbs, q, onSearch, onMenuOpen }) {
  return (
    <div className="a-topbar">
      {/* Hamburger — hidden on desktop, visible on tablet/mobile via CSS */}
      <button
        className="a-menu-btn"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="a-crumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <ChevronRight size={13} style={{ color: 'var(--muted-2)' }} />}
            <span className={i === crumbs.length - 1 ? 'a-cur' : ''}>{c}</span>
          </span>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="a-field search a-topbar-search" style={{ background: 'var(--bg)' }}>
          <Search size={14} />
          <input
            placeholder="Search…"
            value={q}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Main app ── */
export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState('dashboard')
  const [editingDeal, setEditingDeal] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [currentFeaturedCount, setCurrentFeaturedCount] = useState(0)
  const [counts, setCounts] = useState({ deals: null, blogs: null, testimonials: null })
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]')
    if (existing) {
      existing.setAttribute('content', 'noindex, nofollow')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'robots'
      meta.content = 'noindex, nofollow'
      document.head.appendChild(meta)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    fetchCounts()
  }, [session])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  async function fetchCounts() {
    const [{ count: dealCount }, { count: blogCount }, { count: testimonialCount }] = await Promise.all([
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    ])
    setCounts({ deals: dealCount ?? 0, blogs: blogCount ?? 0, testimonials: testimonialCount ?? 0 })
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function navTo(id) {
    setRoute(id)
    setEditingDeal(null)
    setEditingBlog(null)
    setEditingTestimonial(null)
    setEditingCard(null)
    setSearchQuery('')
  }

  function goCreateDeal() { setSearchQuery(''); setEditingDeal(null); setRoute('deal-form') }
  function goEditDeal(d) { setSearchQuery(''); setEditingDeal(d); setRoute('deal-form') }
  function goCreateBlog() { setSearchQuery(''); setEditingBlog(null); setRoute('blog-form') }
  function goEditBlog(b) { setSearchQuery(''); setEditingBlog(b); setRoute('blog-form') }
  function goCreateTestimonial() { setSearchQuery(''); setEditingTestimonial(null); setRoute('testimonial-form') }
  function goEditTestimonial(t) { setSearchQuery(''); setEditingTestimonial(t); setRoute('testimonial-form') }
  function goCreateCard(featuredCount) { setSearchQuery(''); setEditingCard(null); setCurrentFeaturedCount(featuredCount ?? 0); setRoute('opportunity-form') }
  function goEditCard(c, featuredCount) { setSearchQuery(''); setEditingCard(c); setCurrentFeaturedCount(featuredCount ?? 0); setRoute('opportunity-form') }

  function handleDealSaved() {
    showToast(`✓ Deal ${editingDeal ? 'updated' : 'published'} successfully`)
    fetchCounts()
    setRoute('deals')
  }

  function handleBlogSaved(status) {
    const action = status === 'draft' ? 'saved as draft' : editingBlog ? 'updated' : 'published'
    showToast(`✓ Blog post ${action} successfully`)
    fetchCounts()
    setRoute('blog')
  }

  function handleTestimonialSaved() {
    showToast(`✓ Testimonial ${editingTestimonial ? 'updated' : 'added'} successfully`)
    setRoute('testimonials')
  }

  function handleCardSaved() {
    showToast(`✓ Card ${editingCard ? 'updated' : 'created'} successfully`)
    setRoute('opportunities')
  }

  const crumbs = {
    dashboard: ['Workspace', 'Dashboard'],
    deals: ['Workspace', 'Deals'],
    'deal-form': ['Workspace', 'Deals', editingDeal ? 'Edit Deal' : 'New Deal'],
    blog: ['Workspace', 'Blog'],
    'blog-form': ['Workspace', 'Blog', editingBlog ? 'Edit Post' : 'New Post'],
    testimonials: ['Workspace', 'Testimonials'],
    'testimonial-form': ['Workspace', 'Testimonials', editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'],
    opportunities: ['Workspace', 'Sample Debt Reports'],
    'opportunity-form': ['Workspace', 'Sample Debt Reports', editingCard ? 'Edit Card' : 'New Card'],
    homestats: ['Workspace', 'Home Stats'],
    newsletter: ['Workspace', 'Newsletter Subscriptions'],
    settings: ['Workspace', 'Settings'],
    analytics: ['Workspace', 'Analytics'],
  }[route] || ['Workspace']

  const sidebarActive = route === 'deal-form' ? 'deals' : route === 'blog-form' ? 'blog' : route === 'testimonial-form' ? 'testimonials' : route === 'opportunity-form' ? 'opportunities' : route

  if (loading) {
    return (
      <div className="admin-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-wrap">
        <LoginPage onLogin={() => { }} />
      </div>
    )
  }

  return (
    <div className="admin-wrap">

      {/* ── Mobile/tablet overlay (lives OUTSIDE the grid so it never affects layout) ── */}
      {sidebarOpen && (
        <div
          className="a-sidebar-overlay open"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="a-app">
        {/* Sidebar is a plain grid child — no fragment wrapper */}
        <Sidebar
          active={sidebarActive}
          onNav={navTo}
          counts={counts}
          onLogout={handleLogout}
          user={session.user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="a-main">
          <TopBar
            crumbs={crumbs}
            q={searchQuery}
            onSearch={setSearchQuery}
            onMenuOpen={() => setSidebarOpen(true)}
          />
          <div className="a-content">
            {route === 'dashboard' && (
              <Dashboard
                onCreate={goCreateDeal}
                onOpenDeals={() => navTo('deals')}
                onOpenBlog={() => navTo('blog')}
                searchQuery={searchQuery}
              />
            )}
            {route === 'deals' && (
              <DealsList
                onCreate={goCreateDeal}
                onEdit={goEditDeal}
                onRefresh={fetchCounts}
                showToast={showToast}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            {route === 'deal-form' && (
              <DealForm
                deal={editingDeal}
                onBack={() => setRoute('deals')}
                onSave={handleDealSaved}
                showToast={showToast}
              />
            )}
            {route === 'blog' && (
              <BlogList
                onCreate={goCreateBlog}
                onEdit={goEditBlog}
                onRefresh={fetchCounts}
                showToast={showToast}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            {route === 'blog-form' && (
              <BlogForm
                post={editingBlog}
                onBack={() => setRoute('blog')}
                onSave={handleBlogSaved}
                showToast={showToast}
              />
            )}
            {route === 'testimonials' && (
              <TestimonialsList
                onCreate={goCreateTestimonial}
                onEdit={goEditTestimonial}
                onRefresh={fetchCounts}
                showToast={showToast}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            {route === 'testimonial-form' && (
              <TestimonialForm
                testimonial={editingTestimonial}
                onBack={() => setRoute('testimonials')}
                onSave={handleTestimonialSaved}
                showToast={showToast}
              />
            )}
            {route === 'opportunities' && (
              <OpportunityCardsList
                onCreate={goCreateCard}
                onEdit={goEditCard}
                showToast={showToast}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            {route === 'opportunity-form' && (
              <OpportunityCardForm
                card={editingCard}
                onBack={() => setRoute('opportunities')}
                onSave={handleCardSaved}
                showToast={showToast}
                currentFeaturedCount={currentFeaturedCount}
              />
            )}
            {route === 'homestats' && (
              <HomeStats showToast={showToast} />
            )}
            {route === 'newsletter' && (
              <NewsletterList
                showToast={showToast}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            {route === 'settings' && (
              <Settings user={session.user} showToast={showToast} />
            )}
            {route === 'analytics' && (
              <Analytics />
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="a-toast">{toast}</div>
      )}
    </div>
  )
}
