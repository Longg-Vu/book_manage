export function FilterForm({ filters, onFieldChange, onApply, onReset }) {
  function handleSubmit(event) {
    event.preventDefault()
    onApply()
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Filter Books</h2>
      <label>
        Title
        <input
          value={filters.title}
          onChange={(event) => onFieldChange('title', event.target.value)}
          placeholder="Search by title"
        />
      </label>
      <label>
        Author
        <input
          value={filters.author}
          onChange={(event) => onFieldChange('author', event.target.value)}
          placeholder="Search by author"
        />
      </label>
      <div className="button-row">
        <button type="submit">Apply Filter</button>
        <button className="secondary" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  )
}
