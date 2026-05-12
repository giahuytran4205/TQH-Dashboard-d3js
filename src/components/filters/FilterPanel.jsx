import FilterSelect from "./FilterSelect";

export default function FilterPanel({
  filters,
  optionsByFilterId,
  valuesByFilterId,
  onFilterChange,
  activeCount,
}) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h2>Filters</h2>
          <p>Dropdowns build automatically from columns in dataset.</p>
        </div>
        <p className="section-head__meta">{activeCount} active filters</p>
      </div>

      <div className="filter-grid">
        {filters.map((filter) => (
          <FilterSelect
            key={filter.id}
            filter={filter}
            value={valuesByFilterId[filter.id] ?? "all"}
            options={optionsByFilterId[filter.id] ?? []}
            onChange={onFilterChange}
          />
        ))}
      </div>
    </section>
  );
}
