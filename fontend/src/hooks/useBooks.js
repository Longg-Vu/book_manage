import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from '../api'

const emptyBookForm = {
  title: '',
  author: '',
  price: '',
  quantity: '',
}

function updateObjectField(setter, field, value) {
  setter((current) => ({
    ...current,
    [field]: value,
  }))
}

export function useBooks(accessToken) {
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

  const loadBooks = useCallback(
    async ({ pageOverride } = {}) => {
      if (!accessToken) {
        setBooks([])
        setCount(0)
        setNextUrl(null)
        setPreviousUrl(null)
        setDetailBook(null)
        setEditBookId(null)
        setLoading(false)
        return
      }

      const requestedPage = pageOverride ?? page
      setLoading(true)
      setError('')

      try {
        const data = await getBooks({
          page: requestedPage,
          pageSize,
          filters: activeFilters,
          token: accessToken,
        })
        setBooks(data.results || [])
        setCount(data.count || 0)
        setNextUrl(data.next)
        setPreviousUrl(data.previous)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [accessToken, activeFilters, page, pageSize],
  )

  useEffect(() => {
    const timerId = window.setTimeout(loadBooks, 0)

    return () => window.clearTimeout(timerId)
  }, [loadBooks])

  function updateFilterField(field, value) {
    updateObjectField(setFilterForm, field, value)
  }

  function updateNewBookField(field, value) {
    updateObjectField(setNewBook, field, value)
  }

  function updateEditBookField(field, value) {
    updateObjectField(setEditBook, field, value)
  }

  function applyFilter() {
    setActiveFilters(filterForm)
    setPage(1)
  }

  function resetFilter() {
    setFilterForm({ title: '', author: '' })
    setActiveFilters({ title: '', author: '' })
    setPage(1)
  }

  function changePageSize(value) {
    setPageSize(value)
    setPage(1)
  }

  async function addBook() {
    setError('')
    setMessage('')

    try {
      await createBook({ book: newBook, token: accessToken })
      setNewBook(emptyBookForm)
      setPage(1)
      setMessage('Book added successfully.')
      await loadBooks({ pageOverride: 1 })
    } catch (err) {
      setError(err.message)
    }
  }

  async function showDetail(bookId) {
    setError('')
    setMessage('')

    try {
      const data = await getBook({ bookId, token: accessToken })
      setDetailBook(data)
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(book) {
    setEditBookId(book.id)
    setEditBook({
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: book.quantity,
    })
  }

  function cancelEdit() {
    setEditBookId(null)
  }

  async function saveEdit() {
    setError('')
    setMessage('')

    try {
      const data = await updateBook({
        bookId: editBookId,
        book: editBook,
        token: accessToken,
      })
      setEditBookId(null)
      setDetailBook(data)
      setMessage('Book updated successfully.')
      await loadBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeBook(bookId) {
    setError('')
    setMessage('')

    try {
      await deleteBook({ bookId, token: accessToken })
      setMessage('Book deleted successfully.')
      if (detailBook?.id === bookId) {
        setDetailBook(null)
      }
      await loadBooks()
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    books,
    count,
    nextUrl,
    previousUrl,
    page,
    pageSize,
    totalPages,
    filterForm,
    newBook,
    detailBook,
    editBookId,
    editBook,
    message,
    error,
    loading,
    setPage,
    changePageSize,
    updateFilterField,
    applyFilter,
    resetFilter,
    updateNewBookField,
    addBook,
    showDetail,
    startEdit,
    cancelEdit,
    updateEditBookField,
    saveEdit,
    removeBook,
  }
}
