import './FilterChips.css'

export default function FilterChips({ options, active, onChange }) {
  return (
    <div className="filter-chips" role="group" aria-label="Filter">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`filter-chip${active === option.id ? ' is-active' : ''}`}
          onClick={() => onChange(option.id)}
          aria-pressed={active === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
