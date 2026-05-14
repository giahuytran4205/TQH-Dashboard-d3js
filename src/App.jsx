import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import FilterPanel from "./components/filters/FilterPanel";
import KpiGrid from "./components/kpi/KpiGrid";
import ChartGrid from "./components/charts/ChartGrid";
import InsightPanel from "./components/InsightPanel";
import SelectionStrip from "./components/interactions/SelectionStrip";
import { DASHBOARD_CONFIG } from "./config/dashboardConfig";
import derivedMetrics from "./data/derivedMetrics.json";
import { useCsvData } from "./hooks/useCsvData";
import {
  applyFilters,
  buildFilterOptionsMap,
  buildInsight,
  computeKpis,
  resolveFilterConfigs,
} from "./utils/data";
import {
  applyChartSelection,
  buildSelectionSummary,
  describeBrush,
  sameBrushExtent,
} from "./utils/chartData";
import { formatCount } from "./utils/format";

function createInitialFilterValues(filters) {
  return filters.reduce((accumulator, filter) => {
    accumulator[filter.id] = "all";
    return accumulator;
  }, {});
}

const EMPTY_SELECTION = Object.freeze({
  region: null,
  roomType: null,
  brush: null,
});

const STATIC_METRIC_CHART_KINDS = new Set([
  "occupancyLines",
  "policyHeatmap",
  "hostPerformanceBars",
  "experienceWordCloud",
]);

export default function App() {
  const { data, columns, loading, error } = useCsvData(DASHBOARD_CONFIG);
  const [filterValues, setFilterValues] = useState(() =>
    createInitialFilterValues(DASHBOARD_CONFIG.filters)
  );
  const [selection, setSelection] = useState({
    region: null,
    roomType: null,
    brush: null,
  });
  const [geoData, setGeoData] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const resolvedFilters = useMemo(
    () => resolveFilterConfigs(DASHBOARD_CONFIG.filters, columns),
    [columns]
  );

  useEffect(() => {
    setFilterValues((current) => {
      const next = { ...current };
      resolvedFilters.forEach((filter) => {
        if (!Object.prototype.hasOwnProperty.call(next, filter.id)) {
          next[filter.id] = "all";
        }
      });
      return next;
    });
  }, [resolvedFilters]);

  useEffect(() => {
    let cancelled = false;

    async function loadGeoData() {
      try {
        const response = await fetch(DASHBOARD_CONFIG.dataSources.neighbourhoods.path);
        if (!response.ok) {
          throw new Error(`GeoJSON request failed: ${response.status}`);
        }

        const json = await response.json();
        if (!cancelled) {
          setGeoData(json);
          setGeoError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setGeoData(null);
          setGeoError(error);
        }
      }
    }

    loadGeoData();

    return () => {
      cancelled = true;
    };
  }, []);

  const optionsByFilterId = useMemo(
    () => buildFilterOptionsMap(data, resolvedFilters),
    [data, resolvedFilters]
  );

  const filteredData = useMemo(
    () => applyFilters(data, resolvedFilters, filterValues),
    [data, resolvedFilters, filterValues]
  );

  const selectedData = useMemo(
    () => applyChartSelection(filteredData, selection, DASHBOARD_CONFIG),
    [filteredData, selection]
  );

  const kpiItems = useMemo(() => {
    if (loading) {
      return DASHBOARD_CONFIG.kpis.map((item) => ({
        ...item,
        label: item.label,
        value: "--",
        meta: "Waiting for dataset",
      }));
    }

    if (error) {
      return DASHBOARD_CONFIG.kpis.map((item) => ({
        ...item,
        label: item.label,
        value: "N/A",
        meta: "Dataset unavailable",
      }));
    }

    const metrics = computeKpis(selectedData, DASHBOARD_CONFIG.kpis);
    return DASHBOARD_CONFIG.kpis.map((item) => ({
      ...item,
      ...metrics[item.id],
    }));
  }, [error, loading, selectedData]);

  const insight = useMemo(
    () => buildInsight(selectedData, DASHBOARD_CONFIG),
    [selectedData]
  );

  const selectionSummary = useMemo(
    () => buildSelectionSummary(selection, selectedData, DASHBOARD_CONFIG),
    [selectedData, selection]
  );

  const activeFilterCount = useMemo(
    () => Object.values(filterValues).filter((value) => value !== "all").length,
    [filterValues]
  );

  const status = useMemo(() => {
    if (loading) {
      return {
        tone: "neutral",
        label: "Loading",
        message: `Loading ${DASHBOARD_CONFIG.dataPath}...`,
      };
    }

    if (error) {
      return {
        tone: "error",
        label: "Error",
        message: "Dataset load failed. Check Live Server or file path.",
      };
    }

    return {
      tone: geoError ? "neutral" : "success",
      label: geoError ? "Partial" : "Ready",
      message: geoError
        ? `Loaded ${formatCount(data.length)} rows. GeoJSON unavailable, map view will show fallback state.`
        : `Loaded ${formatCount(data.length)} rows and derived metrics for 10 domain tasks.`,
    };
  }, [data.length, error, geoError, loading]);

  const dataChartCards = useMemo(
    () =>
      DASHBOARD_CONFIG.chartCards
        .filter((chart) => !STATIC_METRIC_CHART_KINDS.has(chart.kind))
        .map((chart) => ({
          ...chart,
          data: selectedData,
          selection,
        })),
    [selection, selectedData]
  );

  const metricChartCards = useMemo(
    () =>
      DASHBOARD_CONFIG.chartCards
        .filter((chart) => STATIC_METRIC_CHART_KINDS.has(chart.kind))
        .map((chart) => ({
          ...chart,
          metrics: derivedMetrics,
          selection: EMPTY_SELECTION,
        })),
    []
  );

  const chartCards = useMemo(
    () =>
      DASHBOARD_CONFIG.chartCards.map(
        (chart) =>
          dataChartCards.find((item) => item.id === chart.id) ??
          metricChartCards.find((item) => item.id === chart.id) ??
          chart
      ),
    [dataChartCards, metricChartCards]
  );

  const updateSelection = useCallback(
    (nextSelection) => {
      setSelection((current) =>
        typeof nextSelection === "function" ? nextSelection(current) : nextSelection
      );
    },
    []
  );

  const toggleRegion = useCallback((region) => {
    updateSelection((current) => ({
      ...current,
      region: current.region === region ? null : region,
    }));
  }, [updateSelection]);

  const toggleRoomType = useCallback((roomType) => {
    updateSelection((current) => ({
      ...current,
      roomType: current.roomType === roomType ? null : roomType,
    }));
  }, [updateSelection]);

  const updateBrush = useCallback((nextBrush) => {
    updateSelection((current) => {
      if (!nextBrush) {
        if (!current.brush) {
          return current;
        }
        return { ...current, brush: null };
      }

      if (sameBrushExtent(current.brush, nextBrush)) {
        return current;
      }

      return {
        ...current,
        brush: {
          ...nextBrush,
          label: nextBrush.label || describeBrush(nextBrush),
        },
      };
    });
  }, [updateSelection]);

  const clearRegion = useCallback(() => {
    updateSelection((current) => ({ ...current, region: null }));
  }, [updateSelection]);

  const clearRoomType = useCallback(() => {
    updateSelection((current) => ({ ...current, roomType: null }));
  }, [updateSelection]);

  const clearBrush = useCallback(() => {
    updateSelection((current) => ({ ...current, brush: null }));
  }, [updateSelection]);

  const clearAllSelection = useCallback(() => {
    updateSelection({
      region: null,
      roomType: null,
      brush: null,
    });
  }, [updateSelection]);

  return (
    <div className="app-shell">
      <Header
        eyebrow={DASHBOARD_CONFIG.eyebrow}
        title={DASHBOARD_CONFIG.title}
        description={DASHBOARD_CONFIG.description}
        sourceLabel={DASHBOARD_CONFIG.dataPath}
        rowCountLabel={`${formatCount(data.length)} rows loaded`}
        status={status}
      />

      <FilterPanel
        filters={resolvedFilters}
        optionsByFilterId={optionsByFilterId}
        valuesByFilterId={filterValues}
        onFilterChange={(id, value) =>
          setFilterValues((current) => ({
            ...current,
            [id]: value,
          }))
        }
        activeCount={activeFilterCount}
      />

      <SelectionStrip
        totalCount={filteredData.length}
        selectedCount={selectedData.length}
        summary={selectionSummary}
        selection={selection}
        onClearRegion={clearRegion}
        onClearRoomType={clearRoomType}
        onClearBrush={clearBrush}
        onClearAll={clearAllSelection}
      />

      <KpiGrid items={kpiItems} />

      <ChartGrid
        charts={chartCards}
        loading={loading}
        error={Boolean(error)}
        onRegionToggle={toggleRegion}
        onRoomTypeToggle={toggleRoomType}
        onBrushChange={updateBrush}
        metrics={derivedMetrics}
        geoData={geoData}
      />

      <InsightPanel insight={insight} loading={loading} error={Boolean(error)} />
    </div>
  );
}
