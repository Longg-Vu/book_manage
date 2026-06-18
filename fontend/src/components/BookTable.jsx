export function BookTable({
  books,
  isAuthenticated,
  loading,
  onDelete,
  onDetail,
  onEdit,
}) {
  function handleDelete(bookId) {
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDelete(bookId)
    }
  }

  return (
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
                  <button type="button" onClick={() => onDetail(book.id)}>
                    Detail
                  </button>
                  <button
                    className="secondary"
                    type="button"
                    onClick={() => onEdit(book)}
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
                {isAuthenticated ? 'No books found.' : 'Login first to load books.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
