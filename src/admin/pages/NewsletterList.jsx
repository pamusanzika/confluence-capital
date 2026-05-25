import { useState, useEffect } from 'react'
import { Copy, Check, Trash2, Search, Mail, Download } from 'lucide-react'
import { supabase } from '../supabaseClient'

function ConfirmDialog({ email, onConfirm, onCancel }) {
  return (
    <div className="a-overlay">
      <div className="a-dialog">
        <div className="a-dialog-title">Delete subscription?</div>
        <div className="a-dialog-body">
          <strong>{email}</strong> will be permanently removed from the newsletter list. This cannot be undone.
        </div>
        <div className="a-dialog-foot">
          <button className="a-btn ghost" onClick={onCancel}>Cancel</button>
          <button className="a-btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function NewsletterList({ showToast, searchQuery, onSearchChange }) {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => { fetchSubs() }, [])

  async function fetchSubs() {
    setLoading(true)
    const { data } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false })
    setSubs(data || [])
    setLoading(false)
  }

  async function handleDelete(sub) {
    const { error } = await supabase.from('newsletter_subscriptions').delete().eq('id', sub.id)
    if (error) { showToast('Error deleting subscription'); return }
    showToast('Subscription removed')
    setDeleting(null)
    fetchSubs()
  }

  function handleCopy(sub) {
    navigator.clipboard.writeText(sub.email).then(() => {
      setCopiedId(sub.id)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }

  const filtered = subs.filter(s =>
    !searchQuery || s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleExport() {
    const rows = [
      ['Email Address', 'Subscribed Date'],
      ...subs.map(s => [
        s.email,
        new Date(s.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Newsletter Subscriptions</div>
          <div className="a-page-sub">All subscribed email addresses. {subs.length} total.</div>
        </div>
        <div className="a-actions">
          <button className="a-btn" onClick={handleExport} disabled={subs.length === 0}>
            <Download size={15} /> Export all
          </button>
        </div>
      </div>

      <div className="a-panel">
        <div className="a-filters">
          <div className="a-field search">
            <Search size={14} />
            <input
              placeholder="Search by email…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Loading subscriptions…
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Subscribed Date</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          className="a-thumb"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'linear-gradient(135deg,#E8EDF5,#D0D8E8)',
                            flexShrink: 0,
                          }}
                        >
                          <Mail size={14} style={{ color: 'var(--muted-2)' }} />
                        </div>
                        <span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{s.email}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {new Date(s.subscribed_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="a-iconbtn"
                          style={{
                            width: 30, height: 30, borderRadius: 7,
                            color: copiedId === s.id ? 'var(--ok)' : undefined,
                          }}
                          onClick={() => handleCopy(s)}
                          title="Copy email"
                        >
                          {copiedId === s.id ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                        <button
                          className="a-iconbtn"
                          style={{ width: 30, height: 30, borderRadius: 7, color: 'var(--danger)' }}
                          onClick={() => setDeleting(s)}
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
                    <td colSpan={3} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                      {subs.length === 0 ? 'No subscriptions yet.' : 'No emails match your search.'}
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
            <strong style={{ color: 'var(--ink)' }}>{subs.length}</strong>
          </div>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          email={deleting.email}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
