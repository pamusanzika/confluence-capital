import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { supabase } from '../supabaseClient'
import logo from '../../assets/logo2.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="a-login-wrap">
      <div className="a-login-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: '#051F3C', padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <img src={logo} alt="Logo" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
          <div style={{ color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Console</div>
          </div>
        </div>

        <div style={{ padding: '36px 36px 44px' }}>
          <div className="a-login-title">Sign in</div>
          <div className="a-login-sub">Enter your credentials to access the admin dashboard.</div>

          {error && <div className="a-login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="a-field-group">
              <label className="a-lbl">Email address</label>
              <div className="a-field" style={{ borderRadius: 8 }}>
                <Mail size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5, color: 'var(--ink)' }}
                />
              </div>
            </div>

            <div className="a-field-group" style={{ marginBottom: 22 }}>
              <label className="a-lbl">Password</label>
              <div className="a-field" style={{ borderRadius: 8 }}>
                <Lock size={14} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5, color: 'var(--ink)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="a-btn primary"
              style={{ width: '100%', justifyContent: 'center', height: 42 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
