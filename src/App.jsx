import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Header from "./components/Header";
import FilterPanel from "./components/filters/FilterPanel";
import KpiGrid from "./components/kpi/KpiGrid";
import ChartGrid from "./components/charts/ChartGrid";
import InsightPanel from "./components/InsightPanel";
import SelectionStrip from "./components/interactions/SelectionStrip";
import { DASHBOARD_CONFIG } from "./config/dashboardConfig";
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
  const [, startSelectionTransition] = useTransition();

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

  const scatterData = useMemo(
    () =>
      applyChartSelection(
        filteredData,
        {
          region: selection.region,
          roomType: selection.roomType,
          brush: null,
        },
        DASHBOARD_CONFIG
      ),
    [filteredData, selection.region, selection.roomType]
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
      tone: "success",
      label: "Ready",
      message: `Loaded ${formatCount(data.length)} rows. Click charts to cross-filter the view.`,
    };
  }, [data.length, error, loading]);

  const chartCards = useMemo(
    () =>
      DASHBOARD_CONFIG.chartCards.map((chart) => ({
        ...chart,
        data: chart.kind === "scatter" ? scatterData : selectedData,
      })),
    [scatterData, selectedData]
  );

  const updateSelection = useCallback(
    (nextSelection) => {
      startSelectionTransition(() => {
        setSelection(nextSelection);
      });
    },
    [startSelectionTransition]
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
        rows={selectedData.length}
        selection={selection}
        loading={loading}
        error={Boolean(error)}
        onRegionToggle={toggleRegion}
        onRoomTypeToggle={toggleRoomType}
        onBrushChange={updateBrush}
      />

      <InsightPanel insight={insight} loading={loading} error={Boolean(error)} />
    </div>
  );
}
