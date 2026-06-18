import { useState } from 'react'
import { login, logout } from '../api'

const ACCESS_TOKEN_STORAGE_KEY = 'book_manage_access_token'
const REFRESH_TOKEN_STORAGE_KEY = 'book_manage_refresh_token'

export function useAuth() {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '',
  )
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || '',
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    setAccessToken('')
    setRefreshToken('')
  }

  async function loginUser(credentials) {
    setError('')
    setMessage('')

    try {
      const data = await login(credentials)
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.access)
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refresh)
      setAccessToken(data.access)
      setRefreshToken(data.refresh)
      setMessage('Login successful.')
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  async function logoutUser() {
    setError('')
    setMessage('')

    try {
      if (accessToken && refreshToken) {
        await logout({ accessToken, refreshToken })
      }
      setMessage('Logged out successfully.')
    } catch (err) {
      setMessage(`Local session cleared. Logout API returned: ${err.message}`)
    } finally {
      clearSession()
    }
  }

  return {
    accessToken,
    isAuthenticated: Boolean(accessToken),
    message,
    error,
    loginUser,
    logoutUser,
  }
}
