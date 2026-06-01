import { createElement, useState, useEffect } from 'react'
import { ArrowLeft, Check, Copy, Download, Eye, Mail, MessageSquare, Phone, Search, Trash2 } from 'lucide-react'
import { supabase } from '../supabaseClient'

function formatDate(value, withTime = false) {
  if (!value) return '-'
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  if (withTime) {
    options.hour = 'numeric'
    options.minute = '2-digit'
  }
  return new Date(value).toLocaleString('en-US', options)
}

function getSubject(inquiry) {
  return inquiry.subject || inquiry.interest || '-'
}

function getPhone(inquiry) {
  return inquiry.phone || inquiry.phone_number || inquiry.mobile || '-'
}

function searchable(value) {
  return String(value || '').toLowerCase()
}

function buildCopyText(inquiry) {
  return [
    'Contact Us Submission',
    `Full Name: ${inquiry.name || '-'}`,
    `Email Address: ${inquiry.email || '-'}`,
    `Phone: ${getPhone(inquiry)}`,
    `Subject: ${getSubject(inquiry)}`,
    `Submitted: ${formatDate(inquiry.created_at, true)}`,
    '',
    'Message:',
    inquiry.message || '-',
  ].join('\n')
}

function ConfirmDialog({ inquiry, onConfirm, onCancel }) {
  return (
    <div className="a-overlay">
      <div className="a-dialog">
        <div className="a-dialog-title">Delete contact submission?</div>
        <div className="a-dialog-body">
          The message from <strong>{inquiry.name || inquiry.email}</strong> will be permanently removed.
        </div>
        <div className="a-dialog-foot">
          <button className="a-btn ghost" onClick={onCancel}>Cancel</button>
          <button className="a-btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function ContactUsList({ showToast, searchQuery, onSearchChange, onRefresh }) {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [selected, setSelected] = useState(null)
  const [copiedKey, setCopiedKey] = useState('')

  useEffect(() => { fetchInquiries() }, [])

  async function fetchInquiries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('deal_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      showToast(`Error loading contact submissions: ${error.message}`)
      setInquiries([])
    } else {
      setInquiries(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(inquiry) {
    const { error } = await supabase.from('deal_inquiries').delete().eq('id', inquiry.id)
    if (error) { showToast('Error deleting contact submission'); return }
    showToast('Contact submission removed')
    setDeleting(null)
    if (selected?.id === inquiry.id) setSelected(null)
    fetchInquiries()
    onRefresh?.()
  }

  function handleCopy(key, text) {
    navigator.clipboard.writeText(text || '-').then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 1500)
    })
  }

  function handleExport() {
    const rows = [
      ['Name', 'Email', 'Phone', 'Interest', 'Message', 'Submitted Date'],
      ...inquiries.map(i => [
        i.name || '',
        i.email || '',
        getPhone(i),
        i.interest || '',
        i.message || '',
        formatDate(i.created_at),
      ]),
    ]
    const csv = rows
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-submissions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const q = searchQuery.toLowerCase()
  const filtered = inquiries.filter(i =>
    !q ||
    searchable(i.name).includes(q) ||
    searchable(i.email).includes(q) ||
    searchable(i.subject).includes(q) ||
    searchable(i.interest).includes(q) ||
    searchable(i.phone).includes(q) ||
    searchable(i.phone_number).includes(q) ||
    searchable(i.message).includes(q)
  )

  if (selected) {
    const copyButton = (key, label, text, Icon = Copy) => (
      <button className="a-btn sm" style={{ minHeight: 34 }} onClick={() => handleCopy(key, text)}>
        {copiedKey === key ? <Check size={13} /> : createElement(Icon, { size: 13 })}
        {copiedKey === key ? 'Copied' : label}
      </button>
    )

    return (
      <>
        <div className="a-page-head">
          <div>
            <button className="a-btn ghost" style={{ marginBottom: 10, paddingLeft: 6 }} onClick={() => setSelected(null)}>
              <ArrowLeft size={15} /> Back to List
            </button>
            <div className="a-page-title">Contact Submission</div>
            <div className="a-page-sub">Submitted {formatDate(selected.created_at, true)}</div>
          </div>
          <div className="a-actions">
            <button className="a-btn ghost" onClick={() => setSelected(null)}>
              <ArrowLeft size={15} /> Back to List
            </button>
            <button className="a-btn danger" onClick={() => setDeleting(selected)}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

        <div
          className="a-panel"
          style={{
            maxWidth: 980,
            margin: '0 auto',
            padding: 0,
            overflow: 'hidden',
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 180ms ease, transform 180ms ease',
          }}
        >
          <div
            className="a-panel-head"
            style={{
              alignItems: 'flex-start',
              gap: 18,
              padding: '24px 28px',
              background: 'linear-gradient(180deg, var(--white), var(--bg-2))',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="a-panel-title" style={{ fontSize: 23, lineHeight: 1.25 }}>{selected.name || 'Unnamed contact'}</div>
              <div className="a-panel-sub" style={{ marginTop: 8, overflowWrap: 'anywhere' }}>{selected.email || '-'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
              {copyButton(`email-${selected.id}`, 'Copy Email', selected.email, Mail)}
              {copyButton(`phone-${selected.id}`, 'Copy Phone', getPhone(selected), Phone)}
            </div>
          </div>

          <div style={{ padding: '26px 28px 28px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
                marginBottom: 24,
              }}
            >
              {[
                ['Full Name', selected.name || '-'],
                ['Email Address', selected.email || '-'],
                ['Phone', getPhone(selected)],
                ['Subject', getSubject(selected)],
                ['Submitted Date & Time', formatDate(selected.created_at, true)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: 'var(--bg)',
                    borderRadius: 8,
                    padding: '15px 16px',
                    border: '1px solid var(--line-2)',
                    minHeight: 74,
                  }}
                >
                  <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 7 }}>{label}</div>
                  <div style={{ color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.45, overflowWrap: 'anywhere' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
                Full Message
              </div>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  color: 'var(--ink-2)',
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  padding: '18px 20px',
                  minHeight: 180,
                }}
              >
                {selected.message || '-'}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 18,
                borderTop: '1px solid var(--line-2)',
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {copyButton(`message-${selected.id}`, 'Copy Message', selected.message)}
                {copyButton(`full-${selected.id}`, 'Copy Full Submission', buildCopyText(selected))}
              </div>
              <button className="a-btn ghost" onClick={() => setSelected(null)}>
                <ArrowLeft size={15} /> Back to List
              </button>
            </div>
          </div>
        </div>

        {deleting && (
          <ConfirmDialog
            inquiry={deleting}
            onConfirm={() => handleDelete(deleting)}
            onCancel={() => setDeleting(null)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Contact Us Form</div>
          <div className="a-page-sub">Messages submitted from the public contact page. {inquiries.length} total.</div>
        </div>
        <div className="a-actions">
          <button className="a-btn" onClick={handleExport} disabled={inquiries.length === 0}>
            <Download size={15} /> Export all
          </button>
        </div>
      </div>

      <div className="a-panel">
        <div className="a-filters">
          <div className="a-field search">
            <Search size={14} />
            <input
              placeholder="Search by name, email, subject, phone, or message..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Loading contact submissions...
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: '24%' }}>Contact</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th style={{ width: '30%' }}>Message</th>
                  <th>Submitted</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id} onClick={() => setSelected(i)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          className="a-thumb"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg,#E8EDF5,#D0D8E8)',
                            flexShrink: 0,
                          }}
                        >
                          <Mail size={14} style={{ color: 'var(--muted-2)' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="a-row-title">{i.name || '-'}</div>
                          <div className="a-row-sub">{i.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13, whiteSpace: 'nowrap' }}>{getPhone(i)}</td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{getSubject(i)}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      <div style={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {i.message || '-'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(i.created_at, true)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="a-iconbtn"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 7,
                          }}
                          onClick={(e) => { e.stopPropagation(); setSelected(i) }}
                          title="View submission"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="a-iconbtn"
                          style={{ width: 30, height: 30, borderRadius: 7, color: 'var(--danger)' }}
                          onClick={(e) => { e.stopPropagation(); setDeleting(i) }}
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
                      {inquiries.length === 0 ? 'No contact submissions yet.' : 'No submissions match your search.'}
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
            <strong style={{ color: 'var(--ink)' }}>{inquiries.length}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
            <MessageSquare size={13} /> Public contact form
          </div>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          inquiry={deleting}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
