import { useState, useRef } from 'react'
import {
  ArrowLeft, Check, Upload, Trash2,
  MapPin, Building2, TrendingUp, Percent, Clock,
  Factory, Layers, RefreshCw, Flag, User, Star,
  DollarSign, BarChart2, Timer
} from 'lucide-react'
import { supabase } from '../../supabaseClient'

const CATEGORIES = [
  'Food & Beverage', 'Hospitality', 'Manufacturing', 'Retail',
  'Technology', 'Real Estate', 'Agriculture', 'Healthcare',
]

const TAG_SCHEMA = [
  { key: 'location', label: 'Location', placeholder: 'e.g. Kandy, Sri Lanka', Icon: MapPin },
  { key: 'propType', label: 'Property Type', placeholder: 'e.g. Food & Beverage', Icon: Building2 },
  { key: 'invRange', label: 'Investment Range', placeholder: 'e.g. USD 250K – 500K', Icon: TrendingUp },
  { key: 'expReturn', label: 'Expected Return', placeholder: 'e.g. USD 80K – 120K', Icon: Percent },
  { key: 'term', label: 'Investment Term', placeholder: 'e.g. 2016 (Established)', Icon: Clock },
  { key: 'industry', label: 'Industry', placeholder: 'e.g. Hospitality', Icon: Factory },
  { key: 'stage', label: 'Stage', placeholder: 'e.g. Growth / Series A', Icon: Layers },
  { key: 'roiTimeline', label: 'ROI Timeline', placeholder: 'e.g. 36 months', Icon: RefreshCw },
  { key: 'ownership', label: 'Ownership %', placeholder: 'e.g. 35% equity offered', Icon: Flag },
  { key: 'contact', label: 'Contact Person', placeholder: 'e.g. Nadeesha P.', Icon: User },
]

const HOME_STATS = [
  { key: 'dealValue', label: 'Deal Value',     placeholder: 'e.g. USD 5M',     Icon: DollarSign },
  { key: 'irr',       label: 'IRR',            placeholder: 'e.g. +18%',        Icon: TrendingUp },
  { key: 'moic',      label: 'MOIC',           placeholder: 'e.g. 2.5x',        Icon: BarChart2  },
  { key: 'payback',   label: 'Payback Period', placeholder: 'e.g. 36 months',   Icon: Timer      },
]

export default function DealForm({ deal, onBack, onSave, showToast }) {
  const isEdit = !!deal
  const [title, setTitle] = useState(deal?.title || '')
  const [desc, setDesc] = useState(deal?.short_description || '')
  const [category, setCategory] = useState(deal?.category || CATEGORIES[0])
  const [status, setStatus] = useState(() => {
    const map = { Closed: 'Sold', Ongoing: 'Open' }
    return map[deal?.status] ?? deal?.status ?? 'Open'
  })
  const [tags, setTags] = useState(deal?.tags || {})
  const [pub, setPub] = useState(new Set(deal?.public_tags || []))
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(deal?.image_url || null)
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfName, setPdfName] = useState(deal?.pdf_url ? 'Existing document' : null)
  const [featured, setFeatured] = useState(deal?.featured || false)
  const [saving, setSaving] = useState(false)
  const [tagToast, setTagToast] = useState('')
  const imageRef = useRef(null)
  const pdfRef = useRef(null)

  function setTag(k, v) { setTags(t => ({ ...t, [k]: v })) }

  function togglePublic(k) {
    setPub(prev => {
      const next = new Set(prev)
      if (next.has(k)) { next.delete(k); return next }
      if (next.size >= 5) {
        setTagToast('Maximum of 5 public tags reached')
        setTimeout(() => setTagToast(''), 1800)
        return prev
      }
      next.add(k)
      return next
    })
  }

  function onImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function onPdfChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfFile(file)
    setPdfName(file.name)
  }

  async function uploadFile(bucket, file) {
    const path = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) throw error

    // getPublicUrl returns { data: { publicUrl } } but be defensive in case
    // the SDK shape differs. Fall back to constructing the public URL.
    const publicResult = supabase.storage.from(bucket).getPublicUrl(data.path)
    const publicUrl = publicResult?.data?.publicUrl || publicResult?.publicUrl || (
      `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${data.path}`
    )

    // Debug output to inspect getPublicUrl result and final URL in browser console
    // Keep concise to avoid leaking sensitive tokens
    console.log('supabase.storage.getPublicUrl', { bucket, path: data.path, publicResult, publicUrl })

    return publicUrl
  }

  async function handleSave() {
    if (!title.trim()) { showToast('Please enter a deal title'); return }
    setSaving(true)
    try {
      let image_url = deal?.image_url || null
      let pdf_url = deal?.pdf_url || null

      if (imageFile) image_url = await uploadFile('deal-images', imageFile)
      if (pdfFile) pdf_url = await uploadFile('deal-docs', pdfFile)

      const payload = {
        title: title.trim(),
        short_description: desc.trim(),
        category,
        status,
        featured,
        image_url,
        pdf_url,
        tags,
        public_tags: Array.from(pub),
        updated_at: new Date().toISOString(),
      }

      if (isEdit) {
        const { error } = await supabase.from('deals').update(payload).eq('id', deal.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('deals').insert(payload)
        if (error) throw error
      }

      onSave()
    } catch (err) {
      showToast(`Error: ${err.message}`)
    }
    setSaving(false)
  }

  const pct = (pub.size / 5) * 100
  const full = pub.size === 5
  const pubArr = Array.from(pub)

  return (
    <>
      <div className="a-page-head">
        <div>
          <button className="a-btn ghost" style={{ marginBottom: 10, paddingLeft: 6 }} onClick={onBack}>
            <ArrowLeft size={15} /> Back to deals
          </button>
          <div className="a-page-title">{isEdit ? 'Edit deal' : 'Create a new deal'}</div>
          <div className="a-page-sub">
            {isEdit
              ? `Editing deal · Last updated ${new Date(deal.updated_at || deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Fill in deal details, then choose the 5 tags to display publicly.'}
          </div>
        </div>
        <div className="a-actions">
          <button className="a-btn ghost" onClick={onBack}>Cancel</button>
          <button className="a-btn primary" onClick={handleSave} disabled={saving}>
            <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish deal'}
          </button>
        </div>
      </div>

      <div className="a-form-grid">
        {/* Left column: media + preview */}
        <div>
          <div className="a-form-section">
            <h3>Deal media</h3>
            <div className="a-sec-sub">Cover image and supporting document.</div>

            <label className="a-lbl">Cover image <span className="req">*</span></label>
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
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>PNG, JPG up to 8MB · 1600×900 recommended</div>
                </>
              )}
            </div>
            <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />

            <label className="a-lbl" style={{ marginTop: 18 }}>Deal document (PDF)</label>
            {pdfName ? (
              <div className="a-file-meta">
                <div className="a-ficon">PDF</div>
                <div className="a-fmeta">
                  <div className="a-fname">{pdfName}</div>
                  <div className="a-fsize">Click replace to swap</div>
                </div>
                <button
                  className="a-iconbtn"
                  style={{ width: 32, height: 32, borderRadius: 8, marginLeft: 'auto' }}
                  onClick={() => { setPdfFile(null); setPdfName(null) }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="a-upload" onClick={() => pdfRef.current?.click()} style={{ padding: '16px' }}>
                <div className="a-upload-icon"><Upload size={18} /></div>
                <div className="a-upload-text" style={{ fontSize: 12 }}><strong>Upload PDF</strong></div>
              </div>
            )}
            <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={onPdfChange} />
            {pdfName && (
              <button className="a-btn sm" style={{ marginTop: 8 }} onClick={() => pdfRef.current?.click()}>
                <Upload size={13} /> Replace PDF
              </button>
            )}
          </div>

          {/* Public card preview */}
          <div className="a-preview-pane">
            <div className="a-pphd"><span className="a-live" />Public card preview</div>
            <div className="a-preview-card">
              <div className="a-pimg">
                {imagePreview && <img src={imagePreview} alt="" />}
                <div className="a-pstatus">
                  <span className={`a-badge ${status.toLowerCase()}`}>
                    <span className="a-dot" />{status}
                  </span>
                </div>
              </div>
              <div className="a-pbody">
                <div className="a-pcat">{category}</div>
                <div className="a-ptitle">{title || 'Untitled deal'}</div>
                <div className="a-pdesc">{(desc || '').slice(0, 110)}{desc.length > 110 ? '…' : ''}</div>
                <div className="a-ptags">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const k = pubArr[i]
                    const t = k && TAG_SCHEMA.find(x => x.key === k)
                    return (
                      <div key={i} className={`a-ptag${t ? '' : ' empty'}`}>
                        <div className="k">{t ? t.label : `Tag ${i + 1}`}</div>
                        <div className="v">{t ? (tags[t.key] || '—') : '—'}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: fields */}
        <div>
          <div className="a-form-section">
            <h3>Basic information</h3>
            <div className="a-sec-sub">Headline, summary and classification.</div>

            <div className="a-field-group">
              <label className="a-lbl">Deal title <span className="req">*</span></label>
              <input className="a-inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Yala Coffee Roasters — Specialty Grade" maxLength={80} />
              <div className="a-hint">{title.length}/80 characters</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Short description <span className="req">*</span></label>
              <textarea className="a-ta" value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Appears on the public deal card. Keep it under 240 characters." />
              <div className="a-hint">{desc.length}/240 characters · Appears on public deal card.</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Business category <span className="req">*</span></label>
              <select className="a-sel" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Status</label>
              <div className="a-statuspick">
                {[
                  { v: 'Open', desc: 'Deal is currently accepting investments' },
                  { v: 'Sold', desc: 'Deal has been successfully sold' },
                ].map(({ v, desc: d }) => (
                <div key={v} className={`a-opt${status === v ? ' on' : ''}`} onClick={() => setStatus(v)}>
                  <div className="a-radio" />
                  <div>
                    <div className="a-opt-name">{v}</div>
                    <div className="a-opt-desc">{d}</div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="a-form-section">
            <h3>Homepage visibility</h3>
            <div className="a-sec-sub">Feature this deal in the Featured Transactions section on the home page. Maximum 3 deals can be featured at a time.</div>
            <div
              className={`a-opt${featured ? ' on' : ''}`}
              style={{display: 'flex', marginTop: 12, cursor: 'pointer' }}
              onClick={() => setFeatured(f => !f)}
            >
              <div className="a-radio" />
              <div style={{ flex: 1 }}>
                <div className="a-opt-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={14} fill={featured ? '#d4af37' : 'none'} style={{ color: '#d4af37' }} />
                  Feature on homepage
                </div>
                <div className="a-opt-desc">{featured ? 'This deal will appear in Featured Transactions' : 'Not shown in Featured Transactions'}</div>
              </div>
              <div className={`a-switch${featured ? ' on' : ''}`} style={{ flexShrink: 0 }} />
            </div>
          </div>

          {/* Tags section */}
          <div className="a-form-section">
            <div className="a-tags-head">
              <div>
                <h3>Deal detail tags</h3>
                <div className="a-sec-sub">Fill in values. Toggle up to 5 to show publicly.</div>
              </div>
              <div className={`a-counter${full ? ' full' : ''}`}>
                <div className="a-progress"><div className="a-bar" style={{ width: `${pct}%` }} /></div>
                <span><strong>{pub.size}</strong>/5 public</span>
              </div>
            </div>

            <div className="a-tag-grid">
              {TAG_SCHEMA.map(({ key, label, placeholder, Icon }) => {
                const on = pub.has(key)
                const canToggle = on || pub.size < 5
                return (
                  <div key={key} className={`a-tag-row${on ? ' on' : ''}`}>
                    <div className="a-tlabel">
                      <div className="a-nm"><Icon size={12} /> {label}</div>
                      <div className="a-ex">{placeholder.replace(/^e\.g\.\s*/, '')}</div>
                    </div>
                    <div className="a-tval">
                      <input
                        placeholder={placeholder}
                        value={tags[key] || ''}
                        onChange={e => setTag(key, e.target.value)}
                      />
                      <div className="a-toggle-wrap" title={canToggle ? '' : 'Maximum 5 public tags'}>
                        <span>Public</span>
                        <div
                          className={`a-switch${on ? ' on' : ''}${!canToggle ? ' disabled' : ''}`}
                          onClick={() => canToggle && togglePublic(key)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Homepage stats section */}
          <div className="a-form-section">
            <h3>Homepage stats</h3>
            <div className="a-sec-sub">Powers the live ticker strip on the homepage. Fill in to include this deal in the scrolling stats band.</div>
            <div className="a-tag-grid" style={{ marginTop: 14 }}>
              {HOME_STATS.map(({ key, label, placeholder, Icon }) => (
                <div key={key} className="a-tag-row">
                  <div className="a-tlabel">
                    <div className="a-nm"><Icon size={12} /> {label}</div>
                  </div>
                  <div className="a-tval">
                    <input
                      placeholder={placeholder}
                      value={tags[key] || ''}
                      onChange={e => setTag(key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
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
                <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish deal'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {tagToast && <div className="a-toast">{tagToast}</div>}
    </>
  )
}
