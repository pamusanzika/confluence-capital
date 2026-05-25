import { useState } from 'react'
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Settings({ user, showToast }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePasswordChange(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
    } else {
      showToast('Password updated successfully')
      setPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="a-settings-page">
      <div className="a-page-head">
        <div>
          <div className="a-page-title">Settings</div>
          <div className="a-page-sub">Manage your admin account security and preferences.</div>
        </div>
      </div>

      <div className="a-settings-grid">
        <div className="a-panel">
          <div className="a-panel-head">
            <div>
              <div className="a-panel-title">Security</div>
              <div className="a-panel-sub">Update your account password.</div>
            </div>
          </div>
          <div style={{ padding: '24px 28px' }}>
            <form onSubmit={handlePasswordChange} style={{ maxWidth: 480 }}>
              <div className="a-field-group">
                <label className="a-lbl">New Password</label>
                <div className="a-field" style={{ borderRadius: 9 }}>
                  <Lock size={14} />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5 }}
                  />
                </div>
              </div>

              <div className="a-field-group">
                <label className="a-lbl">Confirm New Password</label>
                <div className="a-field" style={{ borderRadius: 9 }}>
                  <Lock size={14} />
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5 }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  color: 'var(--danger)', 
                  fontSize: 13, 
                  marginBottom: 16,
                  padding: '10px 12px',
                  background: '#FEF2F2',
                  borderRadius: 8,
                  border: '1px solid #FEE2E2'
                }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="a-btn primary" 
                disabled={loading}
                style={{ height: 40, padding: '0 20px' }}
              >
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        <div className="a-panel">
          <div className="a-panel-head">
            <div>
              <div className="a-panel-title">Account Information</div>
              <div className="a-panel-sub">Your current account details.</div>
            </div>
          </div>
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 12, 
                  background: 'var(--bg)', 
                  display: 'grid', 
                  placeItems: 'center',
                  color: 'var(--muted)'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Logged in as</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{user?.email}</div>
                </div>
              </div>
              
              <div style={{ 
                marginTop: 8, 
                padding: '12px 14px', 
                background: 'var(--bg-2)', 
                borderRadius: 10, 
                border: '1px solid var(--line-2)',
                fontSize: 12.5,
                color: 'var(--muted)',
                lineHeight: 1.5
              }}>
                Changing your password will update your login credentials for this admin console. Ensure you use a strong, unique password.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
