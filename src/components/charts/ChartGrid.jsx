import ChartCard from "./ChartCard";

export default function ChartGrid({
  charts,
  rows,
  selection,
  loading,
  error,
  onRegionToggle,
  onRoomTypeToggle,
  onBrushChange,
}) {
  return (
    <section className="chart-grid" aria-label="Chart area">
      {charts.map((chart) => (
        <ChartCard
          key={chart.id}
          {...chart}
          rows={rows}
          selection={selection}
          loading={loading}
          error={error}
          onRegionToggle={onRegionToggle}
          onRoomTypeToggle={onRoomTypeToggle}
          onBrushChange={onBrushChange}
        />
      ))}
    </section>
  );
}
