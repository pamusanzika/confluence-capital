import { useState, useEffect } from 'react'
import { Plus, Search, Star, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const ICON_LABELS = {
  wind: 'Wind',
  brain: 'Brain Circuit',
  activity: 'Activity',
  chart: 'Bar Chart',
  dollar: 'Dollar Sign',
  building: 'Building',
  leaf: 'Leaf',
  trend: 'Trend Up',
}

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

export default function OpportunityCardsList({ onCreate, onEdit, showToast, searchQuery, onSearchChange }) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchCards() }, [])

  async function fetchCards() {
    setLoading(true)
    const { data } = await supabase.from('opportunity_cards').select('*').order('created_at', { ascending: false })
    setCards(data || [])
    setLoading(false)
  }

  async function handleDelete(card) {
    const { error } = await supabase.from('opportunity_cards').delete().eq('id', card.id)
    if (error) { showToast('Error deleting card'); return }
    showToast('Card deleted')
    setDeleting(null)
    fetchCards()
  }

  async function toggleFeatured(e, card) {
    e.stopPropagation()
    if (!card.featured) {
      const featuredCount = cards.filter(c => c.featured).length
      if (featuredCount >= 3) {
        showToast('Maximum 3 featured cards allowed. Unfeature one first.')
        return
      }
    }
    const { error } = await supabase.from('opportunity_cards').update({ featured: !card.featured }).eq('id', card.id)
    if (error) { showToast('Error updating featured status'); return }
    showToast(card.featured ? 'Removed from featured' : 'Added to featured')
    fetchCards()
  }

  const featuredCount = cards.filter(c => c.featured).length

  const filtered = cards.filter(c => {
    const matchesSearch = !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'featured' && c.featured)
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Opportunity Cards</div>
          <div className="a-page-sub">
            Cards shown in the Sample Debt Report section. {cards.length} total · {featuredCount}/3 featured.
          </div>
        </div>
        <div className="a-actions">
          <button className="a-btn primary" onClick={() => onCreate(featuredCount)}>
            <Plus size={15} /> New card
          </button>
        </div>
      </div>

      <div className="a-panel">
        <div className="a-filters">
          <div className="a-field search">
            <Search size={14} />
            <input
              placeholder="Search by title or category…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
          <div className="a-chips" style={{ marginLeft: 'auto' }}>
            <button className={`a-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
              All <span className="a-cnt">{cards.length}</span>
            </button>
            <button className={`a-chip${filter === 'featured' ? ' active' : ''}`} onClick={() => setFilter('featured')}>
              Featured <span className="a-cnt">{featuredCount}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Loading cards…
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Title</th>
                  <th>Category</th>
                  <th>Icon</th>
                  <th>Metric 1</th>
                  <th>Metric 2</th>
                  <th style={{ width: 40 }} title="Featured on site">
                    <Star size={13} style={{ color: 'var(--muted)' }} />
                  </th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => onEdit(c, featuredCount)}>
                    <td>
                      <div className="a-row-title">{c.title}</div>
                      <div className="a-row-sub">
                        {c.description?.slice(0, 65)}{c.description?.length > 65 ? '…' : ''}
                      </div>
                    </td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{c.category}</td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{ICON_LABELS[c.icon] || c.icon}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.metric1_label}</div>
                      <div style={{ fontWeight: 500 }}>{c.metric1_value}</div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.metric2_label}</div>
                      <div style={{ fontWeight: 500 }}>{c.metric2_value}</div>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="a-iconbtn"
                        style={{ width: 30, height: 30, borderRadius: 7, color: c.featured ? '#d4af37' : 'var(--muted)' }}
                        onClick={e => toggleFeatured(e, c)}
                        title={c.featured ? 'Remove from featured' : 'Feature this card (max 3)'}
                      >
                        <Star size={13} fill={c.featured ? '#d4af37' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="a-iconbtn"
                          style={{ width: 30, height: 30, borderRadius: 7 }}
                          onClick={e => { e.stopPropagation(); onEdit(c, featuredCount) }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="a-iconbtn"
                          style={{ width: 30, height: 30, borderRadius: 7, color: 'var(--danger)' }}
                          onClick={e => { e.stopPropagation(); setDeleting(c) }}
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
                      No cards found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="a-pagination">
          <div>
            Showing <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> of{' '}
            <strong style={{ color: 'var(--ink)' }}>{cards.length}</strong>
          </div>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete card?"
          body={`"${deleting.title}" will be permanently removed. This cannot be undone.`}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
