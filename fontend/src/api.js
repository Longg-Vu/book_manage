const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function getErrorMessage(data, fallback) {
  if (!data) {
    return fallback
  }

  if (typeof data === 'string') {
    return data
  }

  if (data.detail) {
    return data.detail
  }

  const firstError = Object.entries(data)[0]
  if (!firstError) {
    return fallback
  }

  const [field, messages] = firstError
  const message = Array.isArray(messages) ? messages.join(', ') : messages
  return `${field}: ${message}`
}

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const headers = {
    Accept: 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data
  try {
    data = await response.json()
  } catch {
    // DELETE may return an empty response body.
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `Request failed: ${response.status}`))
  }

  return data
}

function buildBookQuery({ page, pageSize, filters }) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })

  if (filters.title.trim()) {
    params.set('title', filters.title.trim())
  }

  if (filters.author.trim()) {
    params.set('author', filters.author.trim())
  }

  return `/api/books/?${params.toString()}`
}

export function login(credentials) {
  return apiRequest('/api/token/', {
    method: 'POST',
    body: credentials,
  })
}

export function logout({ accessToken, refreshToken }) {
  return apiRequest('/api/logout/', {
    method: 'POST',
    token: accessToken,
    body: { refresh: refreshToken },
  })
}

export function getBooks({ page, pageSize, filters, token }) {
  return apiRequest(buildBookQuery({ page, pageSize, filters }), { token })
}

export function createBook({ book, token }) {
  return apiRequest('/api/books/', {
    method: 'POST',
    token,
    body: book,
  })
}

export function getBook({ bookId, token }) {
  return apiRequest(`/api/books/${bookId}/`, { token })
}

export function updateBook({ bookId, book, token }) {
  return apiRequest(`/api/books/${bookId}/`, {
    method: 'PATCH',
    token,
    body: book,
  })
}

export function deleteBook({ bookId, token }) {
  return apiRequest(`/api/books/${bookId}/`, {
    method: 'DELETE',
    token,
  })
}
