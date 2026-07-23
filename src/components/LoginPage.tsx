import { useState } from 'react'
import { Loader2, AlertCircle, LogIn, UserPlus, Banknote } from 'lucide-react'

interface LoginPageProps {
  onLogin: (email: string, password: string) => void
  onSignUp: (email: string, password: string) => void
  onClearError: () => void
  error: string
  loading: boolean
}

export function LoginPage({ onLogin, onSignUp, onClearError, error, loading }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      onLogin(email, password)
    } else {
      onSignUp(email, password)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <Banknote size={40} />
        </div>
        <h2>Controle Financeiro</h2>
        <p className="login-subtitle">Gerencie suas despesas na nuvem</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="error-msg">
              <AlertCircle size={16} /> {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="spin" />
            ) : mode === 'login' ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <p className="login-toggle">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button className="link-btn" onClick={() => { setMode('signup'); onClearError() }}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button className="link-btn" onClick={() => { setMode('login'); onClearError() }}>
                Fazer login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
