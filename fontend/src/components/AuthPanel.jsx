import { useState } from 'react'

export function AuthPanel({ isAuthenticated, onLogin, onLogout }) {
  const [form, setForm] = useState({ username: '', password: '' })

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const success = await onLogin(form)
    if (success) {
      setForm((current) => ({ ...current, password: '' }))
    }
  }

  return (
    <section className="card auth-card">
      <div>
        <h2>API Login</h2>
        <p>Use your Django superuser account to get an access token.</p>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          value={form.username}
          onChange={(event) => updateField('username', event.target.value)}
          placeholder="Username"
          autoComplete="username"
        />
        <input
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
        {isAuthenticated && (
          <button className="secondary" type="button" onClick={onLogout}>
            Logout
          </button>
        )}
      </form>
    </section>
  )
}
