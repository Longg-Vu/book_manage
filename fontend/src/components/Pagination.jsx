export function Pagination({
  loading,
  nextUrl,
  onNext,
  onPageSizeChange,
  onPrevious,
  page,
  pageSize,
  previousUrl,
}) {
  return (
    <div className="pagination">
      <button
        className="secondary"
        type="button"
        disabled={!previousUrl || loading}
        onClick={onPrevious}
      >
        Previous
      </button>
      <span>Current page: {page}</span>
      <label className="page-size">
        Page size
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          <option value={20}>20</option>
          <option value={100}>100</option>
        </select>
      </label>
      <button
        className="secondary"
        type="button"
        disabled={!nextUrl || loading}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  )
}
