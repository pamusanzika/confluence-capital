import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const BLOG_CATEGORIES = ['Equity', 'Credit', 'Market Insights']

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

export default function BlogList({ onCreate, onEdit, onRefresh, showToast, searchQuery, onSearchChange }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const [cat, setCat] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  async function handleDelete(post) {
    const { error } = await supabase.from('blogs').delete().eq('id', post.id)
    if (error) { showToast('Error deleting post'); return }
    showToast('Blog post deleted')
    setDeleting(null)
    fetchPosts()
    onRefresh()
  }

  const isPublished = p => !p.status || p.status === 'published'

  const filtered = posts.filter(p => {
    if (searchQuery && !p.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (cat !== 'all' && p.category !== cat) return false
    if (statusFilter === 'published' && !isPublished(p)) return false
    if (statusFilter === 'draft' && p.status !== 'draft') return false
    return true
  })

  const publishedCount = posts.filter(isPublished).length
  const draftCount = posts.filter(p => p.status === 'draft').length

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Blog</div>
          <div className="a-page-sub">Manage all blog posts. {posts.length} total.</div>
        </div>
        <div className="a-actions">
          <button className="a-btn primary" onClick={onCreate}>
            <Plus size={15} /> New post
          </button>
        </div>
      </div>

      <div className="a-panel">
        <div className="a-filters">
          <div className="a-field search">
            <Search size={14} />
            <input placeholder="Search by title…" value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
          </div>
          <div className="a-chips">
            {[
              { id: 'all',       label: 'All',       count: posts.length },
              { id: 'published', label: 'Published',  count: publishedCount },
              { id: 'draft',     label: 'Draft',      count: draftCount },
            ].map(({ id, label, count }) => (
              <button
                key={id}
                className={`a-chip${statusFilter === id ? ' active' : ''}`}
                onClick={() => setStatusFilter(id)}
              >
                {label} <span className="a-cnt">{count}</span>
              </button>
            ))}
          </div>
          <div className="a-chips" style={{ marginLeft: 'auto' }}>
            <button className={`a-chip${cat === 'all' ? ' active' : ''}`} onClick={() => setCat('all')}>
              All <span className="a-cnt">{posts.length}</span>
            </button>
            {BLOG_CATEGORIES.map(c => (
              <button
                key={c}
                className={`a-chip${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c} <span className="a-cnt">{posts.filter(p => p.category === c).length}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading posts…</div>
        ) : (
          <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Reading time</th>
                <th>Updated</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => onEdit(p)}>
                  <td>
                    <div className="a-row-deal">
                      <div className="a-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#E8EDF5,#D0D8E8)' }}>
                        {p.image_url
                          ? <img src={p.image_url} alt="" />
                          : <BookOpen size={15} style={{ color: 'var(--muted-2)' }} />
                        }
                      </div>
                      <div>
                        <div className="a-row-title">{p.title}</div>
                        <div className="a-row-sub">
                          {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {isPublished(p) ? (
                      <span className="a-badge open"><span className="a-dot" />Published</span>
                    ) : (
                      <span className="a-badge pending"><span className="a-dot" />Draft</span>
                    )}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--ink-2)' }}>{p.category || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--ink-2)' }}>{p.reading_time || '—'}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {p.updated_date
                      ? new Date(p.updated_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="a-iconbtn"
                        style={{ width: 30, height: 30, borderRadius: 7 }}
                        onClick={e => { e.stopPropagation(); onEdit(p) }}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="a-iconbtn"
                        style={{ width: 30, height: 30, borderRadius: 7, color: 'var(--danger)' }}
                        onClick={e => { e.stopPropagation(); setDeleting(p) }}
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
                  <td colSpan={5} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    {posts.length === 0 ? 'No blog posts yet. Create your first one!' : 'No posts match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}

        <div className="a-pagination">
          <div>Showing <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--ink)' }}>{posts.length}</strong></div>
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete post?"
          body={`"${deleting.title}" will be permanently removed. This cannot be undone.`}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
