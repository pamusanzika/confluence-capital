import { useState } from 'react'
import { ArrowLeft, Check, Star } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const ICON_OPTIONS = [
  { value: 'wind',     label: 'Wind' },
  { value: 'brain',    label: 'Brain Circuit' },
  { value: 'activity', label: 'Activity / Pulse' },
  { value: 'chart',    label: 'Bar Chart' },
  { value: 'dollar',   label: 'Dollar Sign' },
  { value: 'building', label: 'Building' },
  { value: 'leaf',     label: 'Leaf' },
  { value: 'trend',    label: 'Trend Up' },
]

export default function OpportunityCardForm({ card, onBack, onSave, showToast, currentFeaturedCount }) {
  const isEdit = !!card
  const [category,     setCategory]     = useState(card?.category     || '')
  const [title,        setTitle]        = useState(card?.title        || '')
  const [description,  setDescription]  = useState(card?.description  || '')
  const [metric1Label, setMetric1Label] = useState(card?.metric1_label || '')
  const [metric1Value, setMetric1Value] = useState(card?.metric1_value || '')
  const [metric2Label, setMetric2Label] = useState(card?.metric2_label || '')
  const [metric2Value, setMetric2Value] = useState(card?.metric2_value || '')
  const [icon,         setIcon]         = useState(card?.icon         || 'chart')
  const [featured,     setFeatured]     = useState(card?.featured     || false)
  const [saving,       setSaving]       = useState(false)

  const maxFeaturedReached = !featured && currentFeaturedCount >= 3

  async function handleSave() {
    if (!title.trim())       { showToast('Please enter a title');       return }
    if (!category.trim())    { showToast('Please enter a category');    return }
    if (!description.trim()) { showToast('Please enter a description'); return }

    setSaving(true)
    try {
      const payload = {
        category:      category.trim().toUpperCase(),
        title:         title.trim(),
        description:   description.trim(),
        metric1_label: metric1Label.trim(),
        metric1_value: metric1Value.trim(),
        metric2_label: metric2Label.trim(),
        metric2_value: metric2Value.trim(),
        icon,
        featured,
        updated_at: new Date().toISOString(),
      }

      if (isEdit) {
        const { error } = await supabase.from('opportunity_cards').update(payload).eq('id', card.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('opportunity_cards').insert(payload)
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
            <ArrowLeft size={15} /> Back to cards
          </button>
          <div className="a-page-title">{isEdit ? 'Edit card' : 'Create a new card'}</div>
          <div className="a-page-sub">
            {isEdit
              ? `Editing · Last updated ${new Date(card.updated_at || card.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Fill in the card details below.'}
          </div>
        </div>
        <div className="a-actions">
          <button className="a-btn ghost" onClick={onBack}>Cancel</button>
          <button className="a-btn primary" onClick={handleSave} disabled={saving}>
            <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create card'}
          </button>
        </div>
      </div>

      <div className="a-form-grid">

        {/* Left column */}
        <div>

          {/* Featured */}
          <div className="a-form-section">
            <h3>Featured visibility</h3>
            <div className="a-sec-sub">
              Feature this card in the Sample Debt Report section. Maximum 3 cards can be featured at a time.
            </div>

            {maxFeaturedReached && (
              <div style={{
                marginTop: 10, padding: '8px 12px',
                background: 'var(--warn-bg)', color: 'var(--warn)',
                borderRadius: 'var(--r-sm)', fontSize: 12.5,
              }}>
                Maximum 3 featured cards allowed. Unfeature another card first.
              </div>
            )}

            <div
              className={`a-opt${featured ? ' on' : ''}`}
              style={{
                display: 'flex', marginTop: 12,
                cursor: maxFeaturedReached ? 'not-allowed' : 'pointer',
                opacity: maxFeaturedReached ? 0.6 : 1,
              }}
              onClick={() => !maxFeaturedReached && setFeatured(f => !f)}
            >
              <div className="a-radio" />
              <div style={{ flex: 1 }}>
                <div className="a-opt-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={14} fill={featured ? '#d4af37' : 'none'} style={{ color: '#d4af37' }} />
                  Feature this card
                </div>
                <div className="a-opt-desc">
                  {featured ? 'Will appear in the Sample Debt Report section' : 'Not shown in the Sample Debt Report section'}
                </div>
              </div>
              <div className={`a-switch${featured ? ' on' : ''}`} style={{ flexShrink: 0 }} />
            </div>
          </div>

          {/* Icon */}
          <div className="a-form-section">
            <h3>Card icon</h3>
            <div className="a-sec-sub">Choose an icon displayed at the top of the card.</div>
            <div className="a-field-group" style={{ marginTop: 12 }}>
              <label className="a-lbl">Icon</label>
              <select className="a-sel" value={icon} onChange={e => setIcon(e.target.value)}>
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Right column */}
        <div>

          <div className="a-form-section">
            <h3>Card content</h3>
            <div className="a-sec-sub">Details that appear on the card.</div>

            <div className="a-field-group">
              <label className="a-lbl">Category <span className="req">*</span></label>
              <input
                className="a-inp"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. SUSTAINABLE INFRASTRUCTURE"
                maxLength={60}
              />
              <div className="a-hint">Displayed in uppercase on the card.</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Title <span className="req">*</span></label>
              <input
                className="a-inp"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. $50M Green Energy Initiative"
                maxLength={80}
              />
              <div className="a-hint">{title.length}/80 characters</div>
            </div>

            <div className="a-field-group">
              <label className="a-lbl">Description <span className="req">*</span></label>
              <textarea
                className="a-ta"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description shown on the card."
              />
              <div className="a-hint">{description.length} characters</div>
            </div>
          </div>

          <div className="a-form-section">
            <h3>Card metrics</h3>
            <div className="a-sec-sub">Two data points displayed at the bottom of the card.</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
              <div className="a-field-group">
                <label className="a-lbl">Metric 1 — Label</label>
                <input
                  className="a-inp"
                  value={metric1Label}
                  onChange={e => setMetric1Label(e.target.value)}
                  placeholder="e.g. Target IRR"
                  maxLength={40}
                />
              </div>
              <div className="a-field-group">
                <label className="a-lbl">Metric 1 — Value</label>
                <input
                  className="a-inp"
                  value={metric1Value}
                  onChange={e => setMetric1Value(e.target.value)}
                  placeholder="e.g. 18-22%"
                  maxLength={40}
                />
              </div>
              <div className="a-field-group">
                <label className="a-lbl">Metric 2 — Label</label>
                <input
                  className="a-inp"
                  value={metric2Label}
                  onChange={e => setMetric2Label(e.target.value)}
                  placeholder="e.g. Entry"
                  maxLength={40}
                />
              </div>
              <div className="a-field-group">
                <label className="a-lbl">Metric 2 — Value</label>
                <input
                  className="a-inp"
                  value={metric2Value}
                  onChange={e => setMetric2Value(e.target.value)}
                  placeholder="e.g. Q3 2024"
                  maxLength={40}
                />
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
                <Check size={15} /> {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create card'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
