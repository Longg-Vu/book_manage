import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_STORAGE_KEY = 'book_manage_access_token'

const emptyBookForm = {
  title: '',
  author: '',
  price: '',
  quantity: '',
}

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
    // Some endpoints, like DELETE, may return an empty response body.
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

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || '')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [books, setBooks] = useState([])
  const [count, setCount] = useState(0)
  const [nextUrl, setNextUrl] = useState(null)
  const [previousUrl, setPreviousUrl] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filterForm, setFilterForm] = useState({ title: '', author: '' })
  const [activeFilters, setActiveFilters] = useState({ title: '', author: '' })
  const [newBook, setNewBook] = useState(emptyBookForm)
  const [detailBook, setDetailBook] = useState(null)
  const [editBookId, setEditBookId] = useState(null)
  const [editBook, setEditBook] = useState(emptyBookForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(count / pageSize)),
    [count, pageSize],
  )

  const loadBooks = useCallback(async () => {
    if (!token) {
      setBooks([])
      setCount(0)
      setNextUrl(null)
      setPreviousUrl(null)
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await apiRequest(
        buildBookQuery({ page, pageSize, filters: activeFilters }),
        { token },
      )
      setBooks(data.results || [])
      setCount(data.count || 0)
      setNextUrl(data.next)
      setPreviousUrl(data.previous)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [activeFilters, page, pageSize, token])

  useEffect(() => {
    const timerId = window.setTimeout(loadBooks, 0)

    return () => window.clearTimeout(timerId)
  }, [loadBooks])

  function updateForm(setter, field, value) {
    setter((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      const data = await apiRequest('/api/token/', {
        method: 'POST',
        body: loginForm,
      })
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access)
      setToken(data.access)
      setMessage('Login successful.')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken('')
    setDetailBook(null)
    setEditBookId(null)
    setMessage('Logged out.')
  }

  function handleFilterSubmit(event) {
    event.preventDefault()
    setActiveFilters(filterForm)
    setPage(1)
  }

  function handleResetFilter() {
    setFilterForm({ title: '', author: '' })
    setActiveFilters({ title: '', author: '' })
    setPage(1)
  }

  async function handleAddBook(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await apiRequest('/api/books/', {
        method: 'POST',
        token,
        body: newBook,
      })
      setNewBook(emptyBookForm)
      setPage(1)
      setMessage('Book added successfully.')
      await loadBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleShowDetail(bookId) {
    setError('')
    setMessage('')

    try {
      const data = await apiRequest(`/api/books/${bookId}/`, { token })
      setDetailBook(data)
    } catch (err) {
      setError(err.message)
    }
  }

  function handleStartEdit(book) {
    setEditBookId(book.id)
    setEditBook({
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: book.quantity,
    })
  }

  async function handleSaveEdit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      const data = await apiRequest(`/api/books/${editBookId}/`, {
        method: 'PATCH',
        token,
        body: editBook,
      })
      setEditBookId(null)
      setDetailBook(data)
      setMessage('Book updated successfully.')
      await loadBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(bookId) {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return
    }

    setError('')
    setMessage('')

    try {
      await apiRequest(`/api/books/${bookId}/`, {
        method: 'DELETE',
        token,
      })
      setMessage('Book deleted successfully.')
      if (detailBook?.id === bookId) {
        setDetailBook(null)
      }
      await loadBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Book Management</p>
          <h1>Home</h1>
          <p className="subtitle">
            Manage books from the Django REST API with pagination, filters, and CRUD actions.
          </p>
        </div>
        <div className={token ? 'auth-status success' : 'auth-status'}>
          {token ? 'JWT connected' : 'JWT required'}
        </div>
      </header>

      <section className="card auth-card">
        <div>
          <h2>API Login</h2>
          <p>Use your Django superuser account to get an access token.</p>
        </div>

        <form className="inline-form" onSubmit={handleLogin}>
          <input
            value={loginForm.username}
            onChange={(event) => updateForm(setLoginForm, 'username', event.target.value)}
            placeholder="Username"
            autoComplete="username"
          />
          <input
            value={loginForm.password}
            onChange={(event) => updateForm(setLoginForm, 'password', event.target.value)}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
          {token && (
            <button className="secondary" type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </form>
      </section>

      {(message || error) && (
        <div className={error ? 'notice error' : 'notice success'}>
          {error || message}
        </div>
      )}

      <section className="grid">
        <form className="card form-card" onSubmit={handleFilterSubmit}>
          <h2>Filter Books</h2>
          <label>
            Title
            <input
              value={filterForm.title}
              onChange={(event) => updateForm(setFilterForm, 'title', event.target.value)}
              placeholder="Search by title"
            />
          </label>
          <label>
            Author
            <input
              value={filterForm.author}
              onChange={(event) => updateForm(setFilterForm, 'author', event.target.value)}
              placeholder="Search by author"
            />
          </label>
          <div className="button-row">
            <button type="submit">Apply Filter</button>
            <button className="secondary" type="button" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </form>

        <form className="card form-card" onSubmit={handleAddBook}>
          <h2>Add Book</h2>
          <label>
            Title
            <input
              required
              value={newBook.title}
              onChange={(event) => updateForm(setNewBook, 'title', event.target.value)}
              placeholder="Book title"
            />
          </label>
          <label>
            Author
            <input
              required
              value={newBook.author}
              onChange={(event) => updateForm(setNewBook, 'author', event.target.value)}
              placeholder="Author"
            />
          </label>
          <div className="two-columns">
            <label>
              Price
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={newBook.price}
                onChange={(event) => updateForm(setNewBook, 'price', event.target.value)}
                placeholder="10.00"
              />
            </label>
            <label>
              Quantity
              <input
                required
                min="0"
                type="number"
                value={newBook.quantity}
                onChange={(event) => updateForm(setNewBook, 'quantity', event.target.value)}
                placeholder="5"
              />
            </label>
          </div>
          <button type="submit" disabled={!token}>
            Add Book
          </button>
        </form>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h2>Book List</h2>
            <p>
              Showing page {page} of {totalPages}, total {count} books.
            </p>
          </div>
          <label className="page-size">
            Page size
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
            >
              <option value={20}>20</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.price}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <div className="action-row">
                      <button type="button" onClick={() => handleShowDetail(book.id)}>
                        Detail
                      </button>
                      <button
                        className="secondary"
                        type="button"
                        onClick={() => handleStartEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="danger"
                        type="button"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && books.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {token ? 'No books found.' : 'Login first to load books.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="secondary"
            type="button"
            disabled={!previousUrl || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <span>Current page: {page}</span>
          <button
            className="secondary"
            type="button"
            disabled={!nextUrl || loading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </section>

      <section className="grid">
        <div className="card detail-card">
          <h2>Book Detail</h2>
          {detailBook ? (
            <dl>
              <dt>Title</dt>
              <dd>{detailBook.title}</dd>
              <dt>Author</dt>
              <dd>{detailBook.author}</dd>
              <dt>Price</dt>
              <dd>{detailBook.price}</dd>
              <dt>Quantity</dt>
              <dd>{detailBook.quantity}</dd>
            </dl>
          ) : (
            <p>Select Detail on a row to view book information.</p>
          )}
        </div>

        <form className="card form-card" onSubmit={handleSaveEdit}>
          <h2>Edit Book</h2>
          {editBookId ? (
            <>
              <label>
                Title
                <input
                  required
                  value={editBook.title}
                  onChange={(event) => updateForm(setEditBook, 'title', event.target.value)}
                />
              </label>
              <label>
                Author
                <input
                  required
                  value={editBook.author}
                  onChange={(event) => updateForm(setEditBook, 'author', event.target.value)}
                />
              </label>
              <div className="two-columns">
                <label>
                  Price
                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={editBook.price}
                    onChange={(event) => updateForm(setEditBook, 'price', event.target.value)}
                  />
                </label>
                <label>
                  Quantity
                  <input
                    required
                    min="0"
                    type="number"
                    value={editBook.quantity}
                    onChange={(event) => updateForm(setEditBook, 'quantity', event.target.value)}
                  />
                </label>
              </div>
              <div className="button-row">
                <button type="submit">Save</button>
                <button className="secondary" type="button" onClick={() => setEditBookId(null)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p>Select Edit on a row to update book information.</p>
          )}
        </form>
      </section>
    </main>
  )
}

export default App
