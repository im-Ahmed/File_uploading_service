import { useState } from 'react'

export default function AuthForm({ onLogin, onRegister, loading, error }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) return
    if (tab === 'login') {
      await onLogin(email, password)
    } else {
      if (!username) return
      await onRegister(email, password, username)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-surface-card rounded-full p-1 mb-4">
        {['login', 'register'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
              tab === t
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            {t === 'login' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-error-color rounded-md px-4 py-3 text-sm font-bold mb-4">
          {error}
        </div>
      )}

      {/* Username (register only) */}
      {tab === 'register' && (
        <div className="mb-3">
          <label className="block text-sm font-bold text-ink mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKey}
            placeholder="yourname"
            className="w-full h-11 px-4 bg-canvas border border-ash rounded-md text-base text-ink
                       input-focus placeholder:text-ash"
          />
        </div>
      )}

      {/* Email */}
      <div className="mb-3">
        <label className="block text-sm font-bold text-ink mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKey}
          placeholder="you@example.com"
          className="w-full h-11 px-4 bg-canvas border border-ash rounded-md text-base text-ink
                     input-focus placeholder:text-ash"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-ink mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKey}
          placeholder="••••••••"
          className="w-full h-11 px-4 bg-canvas border border-ash rounded-md text-base text-ink
                     input-focus placeholder:text-ash"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary text-white rounded-md py-2.5 text-sm font-bold
                   hover:bg-primary-pressed disabled:opacity-60 transition-colors focus-ring"
      >
        {loading ? '…' : tab === 'login' ? 'Log in' : 'Create account'}
      </button>

      <p className="text-center text-sm text-mute mt-3">
        {tab === 'login' ? 'No account? ' : 'Have one? '}
        <button
          onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
          className="font-bold text-ink hover:underline"
        >
          {tab === 'login' ? 'Sign up free' : 'Log in'}
        </button>
      </p>
    </div>
  )
}
