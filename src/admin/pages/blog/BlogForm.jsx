import { useState, useRef } from 'react'
import { ArrowLeft, Check, Upload, Trash2, User } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const BLOG_CATEGORIES = ['Equity', 'Credit', 'Market Insights']

export default function BlogForm({ post, onBack, onSave, showToast }) {
  const isEdit = !!post
  const [title, setTitle] = useState(post?.title || '')
  const [shortDesc, setShortDesc] = useState(post?.short_description || '')
  const [category, setCategory] = useState(post?.category || BLOG_CATEGORIES[0])
  const [description, setDescription] = useState(post?.description || '')
  const [readingTime, setReadingTime] = useState(post?.reading_time || '')
  const [updatedDate, setUpdatedDate] = useState(
    post?.updated_date ? post.updated_date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.image_url || null)
  // Author fields
  const [authorName, setAuthorName] = useState(post?.author_name || '')
  const [authorPosition, setAuthorPosition] = useState(post?.author_position || '')
  const [authorImageFile, setAuthorImageFile] = useState(null)
  const [authorImagePreview, setAuthorImagePreview] = useState(post?.author_image_url || null)
  const [saving, setSaving] = useState(false)
  const imageRef = useRef(null)
  const authorImageRef = useRef(null)

  function onImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function onAuthorImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAuthorImageFile(file)
    setAuthorImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!title.trim()) { showToast('Please enter a title'); return }
    setSaving(true)
    try {
      let image_url = post?.image_url || null
      let author_image_url = post?.author_image_url || null

      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name}`
        const { data, error } = await supabase.storage.from('blog-images').upload(path, imageFile, { upsert: true })
        if (error) throw error

        const publicResult = supabase.storage.from('blog-images').getPublicUrl(data.path)
        image_url = publicResult?.data?.publicUrl || publicResult?.publicUrl || (
          `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/blog-images/${data.path}`
        )

        // Debug output to inspect getPublicUrl result and final URL in browser console
        console.log('supabase.storage.getPublicUrl (blog-images)', { path: data.path, publicResult, image_url })
      }

      if (authorImageFile) {
        const path = `authors/${Date.now()}-${authorImageFile.name}`
        const { data, error } = await supabase.storage.from('blog-images').upload(path, authorImageFile, { upsert: true })
        if (error) throw error

        const publicResult = supabase.storage.from('blog-images').getPublicUrl(data.path)
        author_image_url = publicResult?.data?.publicUrl || publicResult?.publicUrl || (
          `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/blog-images/${data.path}`
        )
      }

      const payload = {
        title: title.trim(),
        short_description: shortDesc.trim(),
        category,
        description: description.trim(),
        image_url,
        reading_time: readingTime.trim(),
        updated_date: updatedDate || null,
        author_name: authorName.trim() || null,
        author_position: authorPosition.trim() || null,
        author_image_url,
      }

      if (isEdit) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', post.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('blogs').insert(payload)
        if (error) throw error
      }

      onSave()
    } catch (err) {
      showToast(`Error: ${err.message}`)
    }
    setSaving(false)
  }

  return (
    <>
      <div className="a-page-head">
        <div>
          <button className="a-btn ghost" style={{ marginBottom: 10, paddingLeft: 6 }} onClick={onBack}>
            <ArrowLeft size={15} /> Back to blog
          </button>
          <div className="a-page-title">{isEdit ? 'Edit post' : 'Create a new post'}</div>
          <div className="a-page-sub">
            {isEdit ? `Editing · "${post.title}"` : 'Fill in the post details below.'}
          </div>
        </div>
        <div className="a-actions">
          <button className="a-btn ghost" onClick={onBack}>Cancel</button>
          <button className="a-btn primary" onClick={handleSave} disabled={saving}>
            <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
          </button>
        </div>
      </div>

      <div className="a-form-grid">
        {/* Left: image */}
        <div>
          <div className="a-form-section">
            <h3>Cover image</h3>
            <div className="a-sec-sub">Main image displayed on the blog card and post.</div>

            <div
              className={`a-upload${imagePreview ? ' has-file' : ''}`}
              onClick={() => imageRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Cover" className="a-upload-preview" />
                  <div className="a-upload-text" style={{ fontSize: 12 }}>Click to replace</div>
                </>
              ) : (
                <>
                  <div className="a-upload-icon"><Upload size={22} /></div>
                  <div className="a-upload-text"><strong>Click to upload</strong> or drag & drop</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>PNG, JPG up to 8MB</div>
                </>
              )}
            </div>
            <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
            {imagePreview && (
              <button
                className="a-btn sm danger"
                style={{ marginTop: 10 }}
                onClick={() => { setImageFile(null); setImagePreview(null) }}
              >
                <Trash2 size={13} /> Remove image
              </button>
            )}
          </div>

          {/* Author */}
          <div className="a-form-section">
            <h3>Author</h3>
            <div className="a-sec-sub">Who wrote this post — displayed on the blog detail page.</div>

            {/* Author photo */}
            <div className="a-field-group">
              <label className="a-lbl">Author photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Avatar preview circle */}
                <div
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--surface-2)',
                    border: '2px dashed var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
                  }}
                  onClick={() => authorImageRef.current?.click()}
                >
                  {authorImagePreview
                    ? <img src={authorImagePreview} alt="Author" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <User size={28} style={{ color: 'var(--muted)' }} />
                  }
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button
                    className="a-btn sm"
                    type="button"
                    onClick={() => authorImageRef.current?.click()}
                  >
                    <Upload size={13} /> {authorImagePreview ? 'Replace photo' : 'Upload photo'}
                  </button>
                  {authorImagePreview && (
                    <button
                      className="a-btn sm danger"
                      type="button"
                      onClick={() => { setAuthorImageFile(null); setAuthorImagePreview(null) }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={authorImageRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onAuthorImageChange}
              />
              <div className="a-hint">Square photo recommended. PNG, JPG up to 4MB.</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Author name</label>
              <input
                className="a-inp"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="e.g. Sarah Chen"
              />
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Author position / title</label>
              <input
                className="a-inp"
                value={authorPosition}
                onChange={e => setAuthorPosition(e.target.value)}
                placeholder="e.g. Senior Portfolio Analyst"
              />
            </div>
          </div>

          {/* Meta */}
          <div className="a-form-section">
            <h3>Post metadata</h3>
            <div className="a-sec-sub">Reading time and publication date.</div>

            <div className="a-field-group">
              <label className="a-lbl">Reading time</label>
              <input
                className="a-inp"
                value={readingTime}
                onChange={e => setReadingTime(e.target.value)}
                placeholder="e.g. 5 min read"
              />
              <div className="a-hint">Shown on the blog card.</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Updated date</label>
              <input
                className="a-inp"
                type="date"
                value={updatedDate}
                onChange={e => setUpdatedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right: content */}
        <div>
          <div className="a-form-section">
            <h3>Post content</h3>
            <div className="a-sec-sub">Title, summary and full article body.</div>

            <div className="a-field-group">
              <label className="a-lbl">Category <span className="req">*</span></label>
              <select className="a-sel" value={category} onChange={e => setCategory(e.target.value)}>
                {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Title <span className="req">*</span></label>
              <input
                className="a-inp"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Understanding Private Equity in Sri Lanka"
              />
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Short description</label>
              <textarea
                className="a-ta"
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                rows={2}
                placeholder="A brief summary shown on the blog listing card."
              />
              <div className="a-hint">Appears on the blog card. Keep it under 200 characters.</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Description (full article)</label>
              <textarea
                className="a-ta"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={16}
                placeholder="Write the full blog post content here…"
                style={{ minHeight: 320 }}
              />
            </div>
          </div>

          <div className="a-form-foot">
            <div className="a-saved">
              <span className="a-dot-pulse" />
              {isEdit ? 'Unsaved changes' : 'Draft'}
            </div>
            <div className="a-right">
              <button className="a-btn ghost" onClick={onBack}>Cancel</button>
              <button className="a-btn primary" onClick={handleSave} disabled={saving}>
                <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
