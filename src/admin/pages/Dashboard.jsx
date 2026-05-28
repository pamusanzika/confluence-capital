import { useState, useEffect } from 'react'
import { Plus, ArrowRight, BookOpen, Mail } from 'lucide-react'
import { supabase } from '../supabaseClient'

function normalizeStatus(deal) {
  const map = { Closed: 'Sold', Ongoing: 'Open' }
  return { ...deal, status: map[deal.status] ?? deal.status }
}

function searchable(value) {
  return String(value || '').toLowerCase()
}

export default function Dashboard({ onCreate, onOpenDeals, onOpenBlog, onOpenContact, searchQuery }) {
  const [deals, setDeals] = useState([])
  const [blogs, setBlogs] = useState([])
  const [contactSubmissions, setContactSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const [{ data: d }, { data: b }, { data: c }] = await Promise.all([
        supabase.from('deals').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('deal_inquiries').select('*').order('created_at', { ascending: false }),
      ])
      setDeals((d || []).map(normalizeStatus))
      setBlogs(b || [])
      setContactSubmissions(c || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const open = deals.filter(d => d.status === 'Open').length
  const sold = deals.filter(d => d.status === 'Sold').length

  const BLOG_CATEGORIES = ['Equity', 'Credit', 'Market Insights']

  const blogCategoryCounts = BLOG_CATEGORIES.map(cat => ({
    cat,
    count: blogs.filter(b => b.category === cat).length,
  }))

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Dashboard</div>
          <div className="a-page-sub">Overview of your Deal Book and Blog content.</div>
        </div>
      </div>

      <div className="a-stats three">
        <div className="a-stat">
          <div className="a-stat-label">Total Deals</div>
          <div className="a-num">{deals.length}</div>
          <div className="a-delta"><span>All deal listings</span></div>
        </div>
        <div className="a-stat">
          <div className="a-stat-label">Open</div>
          <div className="a-num">{open}</div>
          <div className="a-delta"><span className="up">Open</span></div>
        </div>
        <div className="a-stat">
          <div className="a-stat-label">Sold</div>
          <div className="a-num">{sold}</div>
          <div className="a-delta"><span style={{ color: '#4B5563' }}>Completed/Sold</span></div>
        </div>
      </div>

      {!loading && (
        <div className="a-stats four">
          <div className="a-stat">
            <div className="a-stat-label">Total Posts</div>
            <div className="a-num">{blogs.length}</div>
            <div className="a-delta"><span>All blog articles</span></div>
          </div>
          {blogCategoryCounts.map(({ cat, count }) => (
            <div className="a-stat" key={cat}>
              <div className="a-stat-label">{cat}</div>
              <div className="a-num">{count}</div>
              <div className="a-delta"><span>{count === 1 ? '1 post' : `${count} posts`}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="a-dash-grid">
        {/* Recent Deals */}
        <div className="a-panel">
          <div className="a-panel-head">
            <div>
              <div className="a-panel-title">Recent Deals</div>
              <div className="a-panel-sub">Latest deals added to the book</div>
            </div>
            <button className="a-btn sm ghost" onClick={onOpenDeals}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {loading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading…</div>
          ) : deals.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No deals yet. <button className="a-btn sm" style={{ marginLeft: 8 }} onClick={onCreate}><Plus size={13}/> Add one</button>
            </div>
          ) : (
            <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: '44%' }}>Deal</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Investment Range</th>
                </tr>
              </thead>
              <tbody>
                {deals
                  .filter(d => !searchQuery || d.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 6)
                  .map(d => (
                  <tr key={d.id} onClick={onOpenDeals}>
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
                    <td style={{ textAlign: 'right', fontSize: 12.5, color: 'var(--ink-2)', fontFamily: 'ui-monospace,monospace' }}>
                      {d.tags?.invRange || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className="a-panel">
          <div className="a-panel-head">
            <div>
              <div className="a-panel-title">Recent Blog Posts</div>
              <div className="a-panel-sub">Latest articles published</div>
            </div>
            <button className="a-btn sm ghost" onClick={onOpenBlog}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {loading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading…</div>
          ) : blogs.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No blog posts yet.
            </div>
          ) : (
            <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: '55%' }}>Title</th>
                  <th>Reading time</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {blogs
                  .filter(b => !searchQuery || b.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 6)
                  .map(b => (
                  <tr key={b.id} onClick={onOpenBlog}>
                    <td>
                      <div className="a-row-deal">
                        <div className="a-thumb" style={{ background: 'linear-gradient(135deg,#E8EDF5,#D0D8E8)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {b.image_url ? <img src={b.image_url} alt="" /> : <BookOpen size={16} style={{ color: 'var(--muted-2)' }} />}
                        </div>
                        <div>
                          <div className="a-row-title">{b.title}</div>
                          <div className="a-row-sub" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.short_description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{b.reading_time || '—'}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {b.updated_date ? new Date(b.updated_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Contact Us Form */}
        <div className="a-panel">
          <div className="a-panel-head">
            <div>
              <div className="a-panel-title">Contact Us Form</div>
              <div className="a-panel-sub">Latest messages from the public contact page</div>
            </div>
            <button className="a-btn sm ghost" onClick={onOpenContact}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {loading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading...</div>
          ) : contactSubmissions.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No contact submissions yet.
            </div>
          ) : (
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th style={{ width: '42%' }}>Contact</th>
                    <th>Interest</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {contactSubmissions
                    .filter(c =>
                      !searchQuery ||
                      searchable(c.name).includes(searchQuery.toLowerCase()) ||
                      searchable(c.email).includes(searchQuery.toLowerCase()) ||
                      searchable(c.subject).includes(searchQuery.toLowerCase()) ||
                      searchable(c.interest).includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 6)
                    .map(c => (
                      <tr key={c.id} onClick={onOpenContact}>
                        <td>
                          <div className="a-row-deal">
                            <div className="a-thumb" style={{ background: 'linear-gradient(135deg,#E8EDF5,#D0D8E8)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <Mail size={16} style={{ color: 'var(--muted-2)' }} />
                            </div>
                            <div>
                              <div className="a-row-title">{c.name || '-'}</div>
                              <div className="a-row-sub" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {c.email || c.message || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{c.subject || c.interest || '-'}</td>
                        <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                          {c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
