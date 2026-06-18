export function BookDetail({ book }) {
  return (
    <div className="card detail-card">
      <h2>Book Detail</h2>
      {book ? (
        <dl>
          <dt>Title</dt>
          <dd>{book.title}</dd>
          <dt>Author</dt>
          <dd>{book.author}</dd>
          <dt>Price</dt>
          <dd>{book.price}</dd>
          <dt>Quantity</dt>
          <dd>{book.quantity}</dd>
        </dl>
      ) : (
        <p>Select Detail on a row to view book information.</p>
      )}
    </div>
  )
}
