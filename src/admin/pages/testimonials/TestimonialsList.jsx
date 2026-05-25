import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Star } from 'lucide-react'
import { supabase } from '../../supabaseClient'

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

export default function TestimonialsList({ onCreate, onEdit, onRefresh, showToast, searchQuery, onSearchChange }) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchTestimonials() }, [])

  async function fetchTestimonials() {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  async function handleDelete(t) {
    const { error } = await supabase.from('testimonials').delete().eq('id', t.id)
    if (error) { showToast('Error deleting testimonial'); return }
    showToast('Testimonial deleted')
    setDeleting(null)
    fetchTestimonials()
    onRefresh()
  }

  async function toggleFeatured(e, t) {
    e.stopPropagation()
    if (!t.featured) {
      const featuredCount = testimonials.filter(x => x.featured).length
      if (featuredCount >= 5) {
        showToast('Maximum 5 featured testimonials allowed. Unfeature one first.')
        return
      }
    }
    const { error } = await supabase.from('testimonials').update({ featured: !t.featured }).eq('id', t.id)
    if (error) { showToast('Error updating featured status'); return }
    showToast(t.featured ? 'Removed from featured' : 'Added to featured homepage')
    fetchTestimonials()
    onRefresh()
  }

  const filtered = testimonials.filter(t => {
    if (searchQuery && !(
      t.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company?.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false
    if (filter === 'featured' && !t.featured) return false
    return true
  })

  const featuredCount = testimonials.filter(t => t.featured).length

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Testimonials</div>
          <div className="a-page-sub">Manage customer testimonials. {testimonials.length} total · {featuredCount}/5 featured.</div>
        </div>
        <div className="a-actions">
          <button className="a-btn primary" onClick={onCreate}>
            <Plus size={15} /> New testimonial
          </button>
        </div>
      </div>

      <div className="a-panel">
        <div className="a-filters">
          <div className="a-field search">
            <Search size={14} />
            <input placeholder="Search by name or company…" value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
          </div>
          <div className="a-chips" style={{ marginLeft: 'auto' }}>
            <button className={`a-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
              All <span className="a-cnt">{testimonials.length}</span>
            </button>
            <button className={`a-chip${filter === 'featured' ? ' active' : ''}`} onClick={() => setFilter('featured')}>
              Featured <span className="a-cnt">{featuredCount}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading testimonials…</div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Customer</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Quote</th>
                  <th>Added</th>
                  <th style={{ width: 40 }} title="Featured on homepage">
                    <Star size={13} style={{ color: 'var(--muted)' }} />
                  </th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} onClick={() => onEdit(t)}>
                    <td>
                      <div className="a-row-title">{t.customer_name}</div>
                    </td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{t.company || '—'}</td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{t.position || '—'}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12.5, maxWidth: 280 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.quote ? `"${t.quote}"` : '—'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="a-iconbtn"
                        style={{ width: 30, height: 30, borderRadius: 7, color: t.featured ? '#d4af37' : 'var(--muted)' }}
                        onClick={e => toggleFeatured(e, t)}
                        title={t.featured ? 'Remove from homepage' : 'Feature on homepage (max 5)'}
                      >
                        <Star size={13} fill={t.featured ? '#d4af37' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="a-iconbtn"
                          style={{ width: 30, height: 30, borderRadius: 7 }}
                          onClick={e => { e.stopPropagation(); onEdit(t) }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="a-iconbtn"
                          style={{ width: 30, height: 30, borderRadius: 7, color: 'var(--danger)' }}
                          onClick={e => { e.stopPropagation(); setDeleting(t) }}
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
                    <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                      {testimonials.length === 0 ? 'No testimonials yet. Add your first one!' : 'No testimonials match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="a-pagination">
          <div>Showing <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--ink)' }}>{testimonials.length}</strong></div>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete testimonial?"
          body={`"${deleting.customer_name}" will be permanently removed. This cannot be undone.`}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
