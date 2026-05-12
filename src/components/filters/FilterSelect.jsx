export default function FilterSelect({ filter, value, options, onChange }) {
  const disabled = !filter.field || options.length === 0;
  const emptyLabel = filter.field ? "No values" : "Field not found in dataset";

  return (
    <div className="filter-control">
      <label htmlFor={filter.id}>{filter.label}</label>
      <select
        id={filter.id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(filter.id, event.target.value)}
      >
        <option value="all">All {filter.label}</option>
        {options.length > 0
          ? options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          : null}
        {disabled ? <option value="">{emptyLabel}</option> : null}
      </select>
      <p className="filter-control__help">
        {filter.helpText} {filter.field ? `Resolved field: ${filter.field}` : ""}
      </p>
    </div>
  );
}
