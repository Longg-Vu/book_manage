import { AddBookForm } from './components/AddBookForm'
import { AuthPanel } from './components/AuthPanel'
import { BookDetail } from './components/BookDetail'
import { BookTable } from './components/BookTable'
import { EditBookForm } from './components/EditBookForm'
import { FilterForm } from './components/FilterForm'
import { Notice } from './components/Notice'
import { Pagination } from './components/Pagination'
import { useAuth } from './hooks/useAuth'
import { useBooks } from './hooks/useBooks'
import './App.css'

function App() {
  const auth = useAuth()
  const books = useBooks(auth.accessToken)

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
        <div className={auth.isAuthenticated ? 'auth-status success' : 'auth-status'}>
          {auth.isAuthenticated ? 'JWT connected' : 'JWT required'}
        </div>
      </header>

      <AuthPanel
        isAuthenticated={auth.isAuthenticated}
        onLogin={auth.loginUser}
        onLogout={auth.logoutUser}
      />

      <Notice
        error={books.error || auth.error}
        message={books.message || auth.message}
      />

      <section className="grid">
        <FilterForm
          filters={books.filterForm}
          onApply={books.applyFilter}
          onFieldChange={books.updateFilterField}
          onReset={books.resetFilter}
        />
        <AddBookForm
          book={books.newBook}
          disabled={!auth.isAuthenticated}
          onAdd={books.addBook}
          onFieldChange={books.updateNewBookField}
        />
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h2>Book List</h2>
            <p>
              Showing page {books.page} of {books.totalPages}, total {books.count} books.
            </p>
          </div>
        </div>

        <BookTable
          books={books.books}
          isAuthenticated={auth.isAuthenticated}
          loading={books.loading}
          onDelete={books.removeBook}
          onDetail={books.showDetail}
          onEdit={books.startEdit}
        />

        <Pagination
          loading={books.loading}
          nextUrl={books.nextUrl}
          onNext={() => books.setPage((current) => current + 1)}
          onPageSizeChange={books.changePageSize}
          onPrevious={() => books.setPage((current) => Math.max(1, current - 1))}
          page={books.page}
          pageSize={books.pageSize}
          previousUrl={books.previousUrl}
        />
      </section>

      <section className="grid">
        <BookDetail book={books.detailBook} />
        <EditBookForm
          book={books.editBook}
          bookId={books.editBookId}
          onCancel={books.cancelEdit}
          onFieldChange={books.updateEditBookField}
          onSave={books.saveEdit}
        />
      </section>
    </main>
  )
}

export default App
