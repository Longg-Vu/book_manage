export function EditBookForm({
  book,
  bookId,
  onCancel,
  onFieldChange,
  onSave,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSave()
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Edit Book</h2>
      {bookId ? (
        <>
          <label>
            Title
            <input
              required
              value={book.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
            />
          </label>
          <label>
            Author
            <input
              required
              value={book.author}
              onChange={(event) => onFieldChange('author', event.target.value)}
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
                value={book.price}
                onChange={(event) => onFieldChange('price', event.target.value)}
              />
            </label>
            <label>
              Quantity
              <input
                required
                min="0"
                type="number"
                value={book.quantity}
                onChange={(event) => onFieldChange('quantity', event.target.value)}
              />
            </label>
          </div>
          <div className="button-row">
            <button type="submit">Save</button>
            <button className="secondary" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>Select Edit on a row to update book information.</p>
      )}
    </form>
  )
}
