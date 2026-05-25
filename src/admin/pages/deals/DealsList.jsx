import { useState, useEffect } from 'react'
import { Plus, Search, Briefcase, Trash2, Edit2, Star } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const CATEGORIES = [
  'Food & Beverage', 'Hospitality', 'Manufacturing', 'Retail',
  'Technology', 'Real Estate', 'Agriculture', 'Healthcare',
]

function ConfirmDialog({ title, body, onConfirm, onCancel }) {
  return (
    <div className="a-overlay">
      <div className="a-dialog">
        <div className="a-dialog-title">{title}</div>
        <div className="a-dialog-body">{body}</div>
        <div className="a-dialog-foot">
          <button className="a-btn ghost" onClick={onCancel}>Cancel</button>
          <button className="a-btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function DealsList({ onCreate, onEdit, onRefresh, showToast, searchQuery, onSearchChange }) {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  const [cat, setCat] = useState('All categories')
  const [status, setStatus] = useState('all')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchDeals() }, [])

  function normalizeStatus(deal) {
    const map = { Closed: 'Sold', Ongoing: 'Open' }
    return { ...deal, status: map[deal.status] ?? deal.status }
  }

  async function fetchDeals() {
    setLoading(true)
    const { data } = await supabase.from('deals').select('*').order('created_at', { ascending: false })
    setDeals((data || []).map(normalizeStatus))
    setLoading(false)
  }

  async function handleDelete(deal) {
    const { error } = await supabase.from('deals').delete().eq('id', deal.id)
    if (error) { showToast('Error deleting deal'); return }
    showToast('Deal deleted')
    setDeleting(null)
    fetchDeals()
    onRefresh()
  }

  async function toggleFeatured(e, deal) {
    e.stopPropagation()
    if (!deal.featured) {
      const featuredCount = deals.filter(d => d.featured).length
      if (featuredCount >= 3) {
        showToast('Maximum 3 featured deals allowed. Unfeature one first.')
        return
      }
    }
    const { error } = await supabase.from('deals').update({ featured: !deal.featured }).eq('id', deal.id)
    if (error) { showToast('Error updating featured status'); return }
    showToast(deal.featured ? 'Removed from featured' : 'Added to featured homepage')
    fetchDeals()
    onRefresh()
  }

  const filtered = deals.filter(d => {
    if (searchQuery && !(d.title?.toLowerCase().includes(searchQuery.toLowerCase()))) return false
    if (cat !== 'All categories' && d.category !== cat) return false
    if (status !== 'all' && d.status?.toLowerCase() !== status) return false
    return true
  })

  const openN = deals.filter(d => d.status === 'Open').length
  const sldN = deals.filter(d => d.status === 'Sold').length

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Deals</div>
          <div className="a-page-sub">All listings in the Deal Book. {deals.length} total.</div>
        </div>
        <div className="a-actions">
          <button className="a-btn primary" onClick={onCreate}>
            <Plus size={15} /> New deal
          </button>
        </div>
      </div>

      <div className="a-panel">
        <div className="a-filters">
          <div className="a-field search">
            <Search size={14} />
            <input placeholder="Search by title…" value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
          </div>
          <div className="a-field select">
            <Briefcase size={14} />
            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option>All categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="a-chips" style={{ marginLeft: 'auto' }}>
            <button className={`a-chip${status === 'all' ? ' active' : ''}`} onClick={() => setStatus('all')}>
              All <span className="a-cnt">{deals.length}</span>
            </button>
            <button className={`a-chip${status === 'open' ? ' active' : ''}`} onClick={() => setStatus('open')}>
              Open <span className="a-cnt">{openN}</span>
            </button>
            <button className={`a-chip${status === 'sold' ? ' active' : ''}`} onClick={() => setStatus('sold')}>
              Sold <span className="a-cnt">{sldN}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading deals…</div>
        ) : (
          <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Deal</th>
                <th>Category</th>
                <th>Status</th>
                <th>Investment Range</th>
                <th>Added</th>
                <th style={{ width: 40 }} title="Featured on homepage">
                  <Star size={13} style={{ color: 'var(--muted)' }} />
                </th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} onClick={() => onEdit(d)}>
                  <td>
                    <div className="a-row-deal">
                      <div className="a-thumb">
                        {d.image_url && <img src={d.image_url} alt="" />}
                      </div>
                      <div>
                        <div className="a-row-title">{d.title}</div>
                        <div className="a-row-sub">
                          {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{d.category}</td>
                  <td>
                    <span className={`a-badge ${d.status?.toLowerCase()}`}>
                      <span className="a-dot" />{d.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)', fontFamily: 'ui-monospace,monospace' }}>
                    {d.tags?.invRange || '—'}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      className="a-iconbtn"
                      style={{ width: 30, height: 30, borderRadius: 7, color: d.featured ? '#d4af37' : 'var(--muted)' }}
                      onClick={e => toggleFeatured(e, d)}
                      title={d.featured ? 'Remove from homepage' : 'Feature on homepage (max 3)'}
                    >
                      <Star size={13} fill={d.featured ? '#d4af37' : 'none'} />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="a-iconbtn"
                        style={{ width: 30, height: 30, borderRadius: 7 }}
                        onClick={e => { e.stopPropagation(); onEdit(d) }}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="a-iconbtn"
                        style={{ width: 30, height: 30, borderRadius: 7, color: 'var(--danger)' }}
                        onClick={e => { e.stopPropagation(); setDeleting(d) }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    No deals match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}

        <div className="a-pagination">
          <div>Showing <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--ink)' }}>{deals.length}</strong></div>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete deal?"
          body={`"${deleting.title}" will be permanently removed. This cannot be undone.`}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
