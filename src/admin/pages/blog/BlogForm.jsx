import { useState, useRef } from 'react'
import { ArrowLeft, Check, Upload, Trash2 } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import RichTextEditor from './RichTextEditor'

const BLOG_CATEGORIES = ['Equity', 'Credit', 'Market Insights']

export default function BlogForm({ post, onBack, onSave, showToast }) {
  const isEdit = !!post
  const [title, setTitle] = useState(post?.title || '')
  const [shortDesc, setShortDesc] = useState(post?.short_description || '')
  const [category, setCategory] = useState(post?.category || BLOG_CATEGORIES[0])
  const [description, setDescription] = useState(post?.description || '')
  const [writer, setWriter] = useState(post?.writer || '')
  const [readingTime, setReadingTime] = useState(post?.reading_time || '')
  const [updatedDate, setUpdatedDate] = useState(
    post?.updated_date ? post.updated_date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.image_url || null)
  const [saving, setSaving] = useState('')   // '' | 'draft' | 'published'
  const imageRef = useRef(null)

  function onImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave(saveStatus) {
    if (!title.trim()) { showToast('Please enter a title'); return }
    setSaving(saveStatus)
    try {
      let image_url = post?.image_url || null

      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name}`
        const { data, error } = await supabase.storage.from('blog-images').upload(path, imageFile, { upsert: true })
        if (error) throw error

        const publicResult = supabase.storage.from('blog-images').getPublicUrl(data.path)
        image_url = publicResult?.data?.publicUrl || publicResult?.publicUrl || (
          `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/blog-images/${data.path}`
        )
      }

      const payload = {
        title: title.trim(),
        short_description: shortDesc.trim(),
        category,
        description,
        writer: writer.trim(),
        image_url,
        reading_time: readingTime.trim(),
        updated_date: updatedDate || null,
        status: saveStatus,
      }

      if (isEdit) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', post.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('blogs').insert(payload)
        if (error) throw error
      }

      onSave(saveStatus)
    } catch (err) {
      showToast(`Error: ${err.message}`)
    }
    setSaving('')
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
          <button className="a-btn" onClick={() => handleSave('draft')} disabled={!!saving}>
            {saving === 'draft' ? 'Saving…' : 'Save as Draft'}
          </button>
          <button className="a-btn primary" onClick={() => handleSave('published')} disabled={!!saving}>
            <Check size={15} /> {saving === 'published' ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
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
              <label className="a-lbl">Writer / Author</label>
              <input
                className="a-inp"
                value={writer}
                onChange={e => setWriter(e.target.value)}
                placeholder="e.g. John Smith"
              />
              <div className="a-hint">Author name displayed on the blog post.</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Description (full article)</label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </div>

          <div className="a-form-foot">
            <div className="a-saved">
              <span className="a-dot-pulse" style={{ background: post?.status === 'draft' ? 'var(--warn)' : 'var(--ok)' }} />
              {isEdit ? (post?.status === 'draft' ? 'Draft' : 'Published') : 'Not yet saved'}
            </div>
            <div className="a-right">
              <button className="a-btn ghost" onClick={onBack}>Cancel</button>
              <button className="a-btn" onClick={() => handleSave('draft')} disabled={!!saving}>
                {saving === 'draft' ? 'Saving…' : 'Save as Draft'}
              </button>
              <button className="a-btn primary" onClick={() => handleSave('published')} disabled={!!saving}>
                <Check size={15} /> {saving === 'published' ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
