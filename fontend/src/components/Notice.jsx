export function Notice({ error, message }) {
  if (!message && !error) {
    return null
  }

  return (
    <div className={error ? 'notice error' : 'notice success'}>
      {error || message}
    </div>
  )
}
