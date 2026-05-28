import { useState, useRef } from 'react'
import { ArrowLeft, Check, Star, Upload, Trash2 } from 'lucide-react'
import { supabase } from '../../supabaseClient'

export default function TestimonialForm({ testimonial, onBack, onSave, showToast }) {
  const isEdit = !!testimonial
  const [quote, setQuote] = useState(testimonial?.quote || '')
  const [customerName, setCustomerName] = useState(testimonial?.customer_name || '')
  const [position, setPosition] = useState(testimonial?.position || '')
  const [company, setCompany] = useState(testimonial?.company || '')
  const [featured, setFeatured] = useState(testimonial?.featured || false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(testimonial?.image_url || null)
  const [saving, setSaving] = useState(false)
  const imageRef = useRef(null)

  function onImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage(file) {
    const path = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('testimonial-images').upload(path, file, { upsert: true })
    if (error) throw error
    const result = supabase.storage.from('testimonial-images').getPublicUrl(data.path)
    return result?.data?.publicUrl || `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/testimonial-images/${data.path}`
  }

  async function handleFeaturedToggle() {
    if (featured) { setFeatured(false); return }
    const { data, error } = await supabase.from('testimonials').select('id').eq('featured', true)
    if (error) { showToast('Could not verify featured count'); return }
    const otherFeatured = data.filter(t => t.id !== testimonial?.id)
    if (otherFeatured.length >= 5) {
      showToast('Maximum 5 featured testimonials allowed. Turn off one before featuring this.')
      return
    }
    setFeatured(true)
  }

  async function handleSave() {
    if (!customerName.trim()) { showToast('Please enter the customer name'); return }
    if (!quote.trim()) { showToast('Please enter a quote'); return }
    setSaving(true)
    try {
      let image_url = testimonial?.image_url || null
      if (imageFile) image_url = await uploadImage(imageFile)

      const payload = {
        quote: quote.trim(),
        customer_name: customerName.trim(),
        position: position.trim(),
        company: company.trim(),
        featured,
        image_url,
        updated_at: new Date().toISOString(),
      }
      if (isEdit) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', testimonial.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('testimonials').insert(payload)
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
            <ArrowLeft size={15} /> Back to testimonials
          </button>
          <div className="a-page-title">{isEdit ? 'Edit testimonial' : 'Add a testimonial'}</div>
          <div className="a-page-sub">
            {isEdit
              ? `Editing testimonial · Last updated ${new Date(testimonial.updated_at || testimonial.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Fill in customer details and their quote.'}
          </div>
        </div>
        <div className="a-actions">
          <button className="a-btn ghost" onClick={onBack}>Cancel</button>
          <button className="a-btn primary" onClick={handleSave} disabled={saving}>
            <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add testimonial'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 680 }}>
        <div className="a-form-section">
          <h3>Customer details</h3>
          <div className="a-sec-sub">Information about the person giving the testimonial.</div>

          {/* Profile image */}
          <label className="a-lbl">Profile photo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'linear-gradient(135deg, #1687f1, #d4af37)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px dashed var(--border)',
              }}
              onClick={() => imageRef.current?.click()}
            >
              {imagePreview
                ? <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>
                    {customerName?.[0]?.toUpperCase() || '?'}
                  </span>
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="a-btn sm" onClick={() => imageRef.current?.click()}>
                <Upload size={13} /> {imagePreview ? 'Replace photo' : 'Upload photo'}
              </button>
              {imagePreview && (
                <button
                  className="a-btn sm ghost"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>PNG, JPG up to 8MB</span>
            </div>
          </div>
          <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />

          <div className="a-field-group">
            <label className="a-lbl">Customer name <span className="req">*</span></label>
            <input className="a-inp" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Jennifer Lee" maxLength={80} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="a-field-group">
              <label className="a-lbl">Position / Job title</label>
              <input className="a-inp" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Business Manager" maxLength={80} />
            </div>
            <div className="a-field-group">
              <label className="a-lbl">Company name</label>
              <input className="a-inp" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Framer" maxLength={80} />
            </div>
          </div>

          <div className="a-field-group">
            <label className="a-lbl">Quote <span className="req">*</span></label>
            <textarea
              className="a-ta"
              value={quote}
              onChange={e => setQuote(e.target.value)}
              rows={5}
              placeholder="The customer's testimonial in their own words…"
            />
            <div className="a-hint">{quote.length} characters</div>
          </div>

          <div className="a-field-group" style={{ marginTop: 4 }}>
            <label className="a-lbl">Homepage visibility</label>
            <div
              className={`a-opt${featured ? ' on' : ''}`}
              style={{ display: 'flex', cursor: 'pointer' }}
              onClick={handleFeaturedToggle}
            >
              <div className="a-radio" />
              <div style={{ flex: 1 }}>
                <div className="a-opt-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={14} fill={featured ? '#d4af37' : 'none'} style={{ color: '#d4af37' }} />
                  Feature on homepage
                </div>
                <div className="a-opt-desc">
                  {featured ? 'Shown in client testimonials section · max 5' : 'Not shown in client testimonials section'}
                </div>
              </div>
              <div className={`a-switch${featured ? ' on' : ''}`} style={{ flexShrink: 0 }} />
            </div>
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
              <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add testimonial'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
