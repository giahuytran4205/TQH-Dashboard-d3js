import ChartCard from "./ChartCard";

export default function ChartGrid({
  charts,
  loading,
  error,
  onRegionToggle,
  onRoomTypeToggle,
  onBrushChange,
  metrics,
  geoData,
}) {
  return (
    <section className="chart-grid" aria-label="Chart area">
      {charts.map((chart) => (
        <ChartCard
          key={chart.id}
          {...chart}
          loading={loading}
          error={error}
          onRegionToggle={onRegionToggle}
          onRoomTypeToggle={onRoomTypeToggle}
          onBrushChange={onBrushChange}
          metrics={metrics}
          geoData={geoData}
        />
      ))}
    </section>
  );
}
