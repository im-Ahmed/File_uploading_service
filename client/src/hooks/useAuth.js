import { useState, useCallback } from 'react'
import * as api from '../lib/api'

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('fp_token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fp_user') || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isLoggedIn = Boolean(token && user)

  const doLogin = useCallback(async (email, password) => {
    setLoading(true); setError('')
    try {
      const data = await api.login(email, password)
      const t = data.data?.accessToken || data.token || data.accessToken
      const u = data.data?.user || data.user || { email }
      localStorage.setItem('fp_token', t)
      localStorage.setItem('fp_user', JSON.stringify(u))
      setToken(t); setUser(u)
      return true
    } catch (e) {
      setError(e.message); return false
    } finally { setLoading(false) }
  }, [])

  const doRegister = useCallback(async (email, password, username) => {
    setLoading(true); setError('')
    try {
      await api.register(email, password, username)
      return await doLogin(email, password)
    } catch (e) {
      setError(e.message); setLoading(false); return false
    }
  }, [doLogin])

  const doLogout = useCallback(async () => {
    try { await api.logout() } catch {}
    localStorage.removeItem('fp_token')
    localStorage.removeItem('fp_user')
    setToken(null); setUser(null); setError('')
  }, [])

  const clearError = useCallback(() => setError(''), [])

  return { token, user, isLoggedIn, loading, error, doLogin, doRegister, doLogout, clearError }
}
