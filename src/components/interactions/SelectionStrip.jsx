export default function SelectionStrip({
  totalCount,
  selectedCount,
  summary,
  selection,
  onClearRegion,
  onClearRoomType,
  onClearBrush,
  onClearAll,
}) {
  const hasSelection = Boolean(selection.region || selection.roomType || selection.brush);

  return (
    <section className="selection-strip panel">
      <div className="section-head">
        <div>
          <h2>Chart selections</h2>
          <p>Click marks to cross-filter. Brush scatter to lock a numeric range.</p>
        </div>
        <p className="section-head__meta">
          {selectedCount.toLocaleString("en-US")} / {totalCount.toLocaleString("en-US")} rows
        </p>
      </div>

      <div className="selection-strip__summary">{summary}</div>

      <div className="selection-strip__chips">
        {selection.region ? (
          <button className="selection-chip" type="button" onClick={onClearRegion}>
            <span>Region</span>
            <strong>{selection.region}</strong>
          </button>
        ) : null}

        {selection.roomType ? (
          <button className="selection-chip" type="button" onClick={onClearRoomType}>
            <span>Room type</span>
            <strong>{selection.roomType}</strong>
          </button>
        ) : null}

        {selection.brush ? (
          <button className="selection-chip" type="button" onClick={onClearBrush}>
            <span>Brush</span>
            <strong>{selection.brush.label}</strong>
          </button>
        ) : null}

        {hasSelection ? (
          <button className="selection-chip selection-chip--clear" type="button" onClick={onClearAll}>
            Clear all
          </button>
        ) : null}
      </div>
    </section>
  );
}
