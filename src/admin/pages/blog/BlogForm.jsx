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
  const [writerImageFile, setWriterImageFile] = useState(null)
  const [writerImagePreview, setWriterImagePreview] = useState(post?.writer_image_url || null)
  const [saving, setSaving] = useState('')   // '' | 'draft' | 'published'
  const imageRef = useRef(null)
  const writerImageRef = useRef(null)

  function onImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function onWriterImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setWriterImageFile(file)
    setWriterImagePreview(URL.createObjectURL(file))
  }

  async function uploadBlogImage(file) {
    const path = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('blog-images').upload(path, file, { upsert: true })
    if (error) throw error

    const publicResult = supabase.storage.from('blog-images').getPublicUrl(data.path)
    return publicResult?.data?.publicUrl || publicResult?.publicUrl || (
      `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/blog-images/${data.path}`
    )
  }

  async function handleSave(saveStatus) {
    if (!title.trim()) { showToast('Please enter a title'); return }
    setSaving(saveStatus)
    try {
      let image_url = imagePreview ? (post?.image_url || null) : null
      let writer_image_url = writerImagePreview ? (post?.writer_image_url || null) : null

      if (imageFile) image_url = await uploadBlogImage(imageFile)
      if (writerImageFile) writer_image_url = await uploadBlogImage(writerImageFile)

      const payload = {
        title: title.trim(),
        short_description: shortDesc.trim(),
        category,
        description,
        writer: writer.trim(),
        writer_image_url,
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
      if (err.message?.includes('writer_image_url')) {
        showToast('Error: Add writer_image_url column to the blogs table in Supabase, then try again.')
        setSaving('')
        return
      }
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
              <label className="a-lbl">Writer image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #1687f1, #d4af37)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px dashed var(--border)',
                  }}
                  onClick={() => writerImageRef.current?.click()}
                >
                  {writerImagePreview ? (
                    <img
                      src={writerImagePreview}
                      alt="Writer preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>
                      {writer?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button className="a-btn sm" onClick={() => writerImageRef.current?.click()}>
                    <Upload size={13} /> {writerImagePreview ? 'Replace image' : 'Upload image'}
                  </button>
                  {writerImagePreview && (
                    <button
                      className="a-btn sm ghost"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => { setWriterImageFile(null); setWriterImagePreview(null) }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>PNG, JPG up to 8MB</span>
                </div>
              </div>
              <input
                ref={writerImageRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onWriterImageChange}
              />
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
