export function AddBookForm({ book, disabled, onFieldChange, onAdd }) {
  function handleSubmit(event) {
    event.preventDefault()
    onAdd()
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Add Book</h2>
      <label>
        Title
        <input
          required
          value={book.title}
          onChange={(event) => onFieldChange('title', event.target.value)}
          placeholder="Book title"
        />
      </label>
      <label>
        Author
        <input
          required
          value={book.author}
          onChange={(event) => onFieldChange('author', event.target.value)}
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
            value={book.price}
            onChange={(event) => onFieldChange('price', event.target.value)}
            placeholder="10.00"
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
            placeholder="5"
          />
        </label>
      </div>
      <button type="submit" disabled={disabled}>
        Add Book
      </button>
    </form>
  )
}
