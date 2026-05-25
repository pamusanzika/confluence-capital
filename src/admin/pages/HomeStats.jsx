import { useState, useEffect } from 'react'
import { Hash } from 'lucide-react'
import { supabase } from '../supabaseClient'

const STAT_FIELDS = [
  { key: 'stat_years_experience', label: 'Years of market experience', suffix: '+' },
  { key: 'stat_active_projects', label: 'Active projects delivered', suffix: '+' },
  { key: 'stat_successful_exits', label: 'Proven successful exits', suffix: '+' },
  { key: 'stat_project_pipeline', label: 'Project pipeline (USD)', suffix: 'M' },
]

export default function HomeStats({ showToast }) {
  const [values, setValues] = useState({
    stat_years_experience: '40',
    stat_active_projects: '30',
    stat_successful_exits: '7',
    stat_project_pipeline: '80',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data?.length) {
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        setValues(prev => ({ ...prev, ...map }))
      }
      setLoading(false)
    })
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const rows = STAT_FIELDS.map(f => ({ key: f.key, value: String(values[f.key] ?? '') }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    if (error) {
      showToast('Failed to save stats')
    } else {
      showToast('✓ Home stats updated')
    }
    setSaving(false)
  }

  return (
    <>
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Home Stats</div>
          <div className="a-page-sub">Edit the animated stat counters displayed on the home page.</div>
        </div>
      </div>

      <div className="a-panel" style={{ maxWidth: 560 }}>
        <div className="a-panel-head">
          <div>
            <div className="a-panel-title">Stat Values</div>
            <div className="a-panel-sub">Changes are reflected live on the public site.</div>
          </div>
        </div>
        <div style={{ padding: '24px 28px' }}>
          {loading ? (
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</div>
          ) : (
            <form onSubmit={handleSave}>
              {STAT_FIELDS.map(f => (
                <div className="a-field-group" key={f.key}>
                  <label className="a-lbl">
                    {f.label} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({f.suffix})</span>
                  </label>
                  <div className="a-field" style={{ borderRadius: 9 }}>
                    <Hash size={14} />
                    <input
                      type="number"
                      min="0"
                      value={values[f.key] ?? ''}
                      onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                      required
                      style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5 }}
                    />
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="a-btn primary"
                disabled={saving}
                style={{ height: 40, padding: '0 20px', marginTop: 4 }}
              >
                {saving ? 'Saving…' : 'Save Stats'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
