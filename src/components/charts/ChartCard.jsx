import { memo, useMemo } from "react";
import InteractiveChart from "./InteractiveChart";

function ChartCard({
  badge,
  title,
  description,
  kind,
  groupField,
  metricField,
  xField,
  yField,
  colorField,
  interactionKey,
  note,
  data,
  selection,
  loading,
  error,
  onRegionToggle,
  onRoomTypeToggle,
  onBrushChange,
  metrics,
  geoData,
}) {
  const chartConfig = useMemo(
    () => ({
      kind,
      title,
      note,
      groupField,
      metricField,
      xField,
      yField,
      colorField,
      interactionKey,
    }),
    [colorField, groupField, interactionKey, kind, metricField, note, title, xField, yField]
  );

  return (
    <article className="chart-card">
      <div className="chart-card__head">
        <div>
          <span className="chart-card__badge">{badge}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="chart-card__body">
        <InteractiveChart
          chart={chartConfig}
          data={data}
          selection={selection}
          loading={loading}
          error={error}
          onRegionToggle={onRegionToggle}
          onRoomTypeToggle={onRoomTypeToggle}
          onBrushChange={onBrushChange}
          metrics={metrics}
          geoData={geoData}
        />
      </div>

      {note ? <p className="chart-card__note">{note}</p> : null}
    </article>
  );
}

export default memo(ChartCard);
