import { memo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { formatCount, formatCurrency, formatNumber } from "../../utils/format";

const SIZE = { width: 760, height: 430 };
const TOOLTIP_ID = "d3-chart-tooltip";
const MAX_POINTS = 1000;
const MAX_GOOD_DEAL_POINTS = 20000;
const BOROUGH_ORDER = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
const HOST_TYPE_AXIS_LABELS = {
  "Individual host": "Individual",
  "Professional host": "Professional",
};
const HOST_TYPE_LABELS = {
  "Individual host": "Cá nhân (1 phòng)",
  "Professional host": "Chuyên nghiệp (Nhiều phòng)",
};

const COLORS = {
  blue: "#2563eb",
  teal: "#0f766e",
  green: "#16a34a",
  orange: "#f97316",
  red: "#dc2626",
  slate: "#475569",
  muted: "#64748b",
  text: "#0f172a",
  border: "#cbd5e1",
  panel: "#f8fafc",
};

const ROOM_COLORS = d3
  .scaleOrdinal()
  .domain(["Entire home/apt", "Hotel room", "Private room", "Shared room"])
  .range(["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"]);

const ROOM_TYPE_OFFSETS = new Map(
  ROOM_COLORS.domain().map((roomType, index, domain) => [
    roomType,
    (index - (domain.length - 1) / 2) * 8,
  ])
);

const HOST_COLORS = d3
  .scaleOrdinal()
  .domain(["Individual host", "Professional host"])
  .range(["#4e79a7", "#f28e2b"]);

const REGION_COLORS = d3.scaleOrdinal(d3.schemeTableau10);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const MONTH_NAMES = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function InteractiveChart({
  chart,
  data,
  metrics,
  geoData,
  selection,
  loading,
  error,
  onRegionToggle,
  onRoomTypeToggle,
}) {
  const ref = useRef(null);
  const mapZoomRef = useRef(d3.zoomIdentity);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const frameId = window.requestAnimationFrame(() => {
      svg.selectAll("*").remove();
      svg
        .attr("viewBox", `0 0 ${SIZE.width} ${SIZE.height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      if (loading) {
        drawEmptyState(svg, chart.title, "Loading dataset...");
        return;
      }

      if (error) {
        drawEmptyState(svg, chart.title, "Dataset unavailable.");
        return;
      }

      switch (chart.kind) {
        case "choropleth":
          drawChoropleth(svg, data, geoData, selection, onRegionToggle, mapZoomRef);
          break;
        case "occupancyLines":
          drawOccupancyLines(svg, metrics, selection, onRegionToggle);
          break;
        case "stackedRoomTypeBars":
          drawStackedRoomTypeBars(svg, data, selection, onRegionToggle);
          break;
        case "ratingBoxplot":
          drawRatingBoxplot(svg, data, selection, onRegionToggle);
          break;
        case "priceBoxplot":
          drawPriceDistributionBoxplot(svg, data, selection, onRegionToggle);
          break;
        case "goodDealScatter":
          drawGoodDealScatter(svg, data, selection, onRoomTypeToggle);
          break;
        case "pricePerPersonGroupedBars":
          drawPricePerPersonGroupedBars(svg, data, selection, onRoomTypeToggle);
          break;
        case "policyHeatmap":
          drawPolicyHeatmap(svg, metrics);
          break;
        case "hostPerformanceBars":
          drawHostPerformanceBars(svg, metrics);
          break;
        case "experienceWordCloud":
          drawExperienceWordCloud(svg, metrics);
          break;
        default:
          drawEmptyState(svg, chart.title, "Unsupported chart type.");
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      hideTooltip();
    };
  }, [chart, data, error, geoData, loading, metrics, onRegionToggle, onRoomTypeToggle, selection]);

  return <svg ref={ref} className="interactive-chart" />;
}

function drawEmptyState(svg, title, message) {
  drawFrame(svg);
  const center = svg.append("g").attr("transform", `translate(${SIZE.width / 2}, ${SIZE.height / 2})`);
  center.append("text").attr("class", "placeholder-title").attr("y", -10).text(title);
  center.append("text").attr("class", "placeholder-subtitle").attr("y", 18).text(message);
}

function monthName(value) {
  return MONTH_NAMES[Number(value)] ?? String(value);
}

function drawFrame(svg) {
  svg
    .append("rect")
    .attr("class", "placeholder-frame")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", SIZE.width - 20)
    .attr("height", SIZE.height - 20)
    .attr("rx", 8);
}

function drawChoropleth(svg, data, geoData, selection, onRegionToggle, zoomRef) {
  if (!geoData?.features?.length) {
    drawEmptyState(svg, "Map unavailable", "Place neighbourhoods.geojson in data/.");
    return;
  }

  const priceByNeighbourhood = d3.rollup(
    data.filter((row) => Number.isFinite(row.price) && row.price_is_outlier !== true),
    (rows) => ({
      avgPrice: d3.mean(rows, (row) => row.price),
      count: rows.length,
      region: rows[0]?.neighbourhood_group_cleansed ?? "Unknown",
    }),
    (row) => row.neighbourhood_cleansed
  );
  const values = Array.from(priceByNeighbourhood.values()).map((item) => item.avgPrice);
  if (!values.length) {
    drawEmptyState(svg, "No map values", "No listing prices match current filters.");
    return;
  }

  drawFrame(svg);
  const mapBounds = { left: 24, top: 22, right: SIZE.width - 24, bottom: SIZE.height - 58 };
  const projection = d3.geoMercator().fitExtent(
    [
      [mapBounds.left, mapBounds.top],
      [mapBounds.right, mapBounds.bottom],
    ],
    geoData
  );
  const path = d3.geoPath(projection);
  const domain = d3.extent(values);
  const color = d3.scaleSequential(d3.interpolateBlues).domain(domain);

  const defs = svg.append("defs");
  const clipId = "task1-map-clip";
  defs
    .append("clipPath")
    .attr("id", clipId)
    .append("rect")
    .attr("x", mapBounds.left)
    .attr("y", mapBounds.top)
    .attr("width", mapBounds.right - mapBounds.left)
    .attr("height", mapBounds.bottom - mapBounds.top);

  const mapViewport = svg.append("g").attr("class", "map-viewport");
  const zoomLayer = mapViewport.append("g").attr("clip-path", `url(#${clipId})`);
  zoomLayer
    .append("rect")
    .attr("class", "map-zoom-surface")
    .attr("x", mapBounds.left)
    .attr("y", mapBounds.top)
    .attr("width", mapBounds.right - mapBounds.left)
    .attr("height", mapBounds.bottom - mapBounds.top)
    .attr("fill", "transparent");

  const features = zoomLayer.append("g").attr("class", "map-features");
  const paths = features
    .selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("d", path)
    .attr("vector-effect", "non-scaling-stroke")
    .attr("fill", (feature) => {
      const stats = priceByNeighbourhood.get(feature.properties.neighbourhood);
      return stats ? color(stats.avgPrice) : "#e2e8f0";
    })
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.7)
    .style("cursor", "pointer")
    .style("opacity", (feature) => {
      const region = feature.properties.neighbourhood_group;
      return !selection.region || selection.region === region ? 1 : 0.28;
    })
    .on("click", (_, feature) => onRegionToggle?.(feature.properties.neighbourhood_group));

  bindTooltip(paths, (feature) => {
    const stats = priceByNeighbourhood.get(feature.properties.neighbourhood);
    return {
      title: feature.properties.neighbourhood,
      lines: [
        { label: "Borough", value: feature.properties.neighbourhood_group },
        { label: "Average price", value: stats ? formatCurrency(stats.avgPrice, 0) : "No listing" },
        { label: "Listings", value: stats ? formatCount(stats.count) : "0" },
      ],
    };
  });

  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .translateExtent([
      [mapBounds.left, mapBounds.top],
      [mapBounds.right, mapBounds.bottom],
    ])
    .extent([
      [mapBounds.left, mapBounds.top],
      [mapBounds.right, mapBounds.bottom],
    ])
    .filter((event) => Boolean(event.target?.closest?.(".map-viewport")) && event.type !== "contextmenu")
    .on("zoom", (event) => {
      zoomRef.current = event.transform;
      zoomLayer.attr("transform", event.transform);
    });

  svg.call(zoom).call(zoom.transform, zoomRef.current ?? d3.zoomIdentity);
  drawSequentialLegend(svg, color, domain, "Avg price", SIZE.width - 230, SIZE.height - 38);
}

function drawOccupancyLines(svg, metrics, selection, onRegionToggle) {
  const rows = metrics?.monthlyOccupancyByRegion ?? [];
  if (!rows.length) {
    drawEmptyState(svg, "No occupancy data", "Run npm run build-derived-data.");
    return;
  }

  const months = Array.from(new Set(rows.map((row) => row.month))).sort((a, b) => a - b);
  drawFrame(svg);
  const margin = { top: 30, right: 132, bottom: 54, left: 62 };
  const x = d3.scalePoint().domain(months).range([margin.left, SIZE.width - margin.right]).padding(0.35);
  const y = d3
    .scaleLinear()
    .domain([0, Math.ceil((d3.max(rows, (row) => row.occupancyRate) ?? 0) / 10) * 10])
    .nice()
    .range([SIZE.height - margin.bottom, margin.top]);

  drawXYAxes(svg, x, y, margin, "Month", "Occupancy %", {
    xFormat: (d) => monthName(d),
    yFormat: (d) => `${d}%`,
  });

  const byRegion = d3.group(rows, (row) => row.region);
  REGION_COLORS.domain(Array.from(byRegion.keys()));
  const line = d3
    .line()
    .x((row) => x(row.month))
    .y((row) => y(row.occupancyRate))
    .curve(d3.curveMonotoneX);
  const regionsData = Array.from(byRegion, ([region, values]) => ({ region, values }));

  const lineGroups = svg
    .append("g")
    .selectAll("g")
    .data(regionsData)
    .join("g")
    .style("cursor", "pointer");

  function updateFocus(focusedRegion = null) {
    const activeRegion = focusedRegion ?? selection.region ?? null;

    lineGroups.style("opacity", (d) => {
      if (!activeRegion) {
        return 1;
      }

      return d.region === activeRegion ? 1 : 0.08;
    });

    lineGroups
      .select("path.line-path")
      .attr("stroke-width", (d) => {
        if (activeRegion && d.region === activeRegion) {
          return 4.2;
        }

        return selection.region === d.region ? 3.4 : 2.4;
      })
      .attr("stroke-opacity", (d) => {
        if (!activeRegion) {
          return 1;
        }

        return d.region === activeRegion ? 1 : 0.3;
      });

    lineGroups
      .select("path.line-hit")
      .attr("stroke-width", (d) => (activeRegion && d.region === activeRegion ? 20 : 14));

    lineGroups
      .selectAll("circle.line-point")
      .attr("r", (d) => {
        if (activeRegion && d.region === activeRegion) {
          return 4.7;
        }

        return 3.8;
      })
      .attr("opacity", (d) => {
        if (!activeRegion) {
          return 1;
        }

        return d.region === activeRegion ? 1 : 0.22;
      });
  }

  lineGroups
    .append("path")
    .attr("class", "line-path")
    .attr("fill", "none")
    .attr("stroke", (d) => REGION_COLORS(d.region))
    .attr("stroke-width", (d) => (selection.region === d.region ? 3.8 : 2.4))
    .attr("d", (d) => line(d.values))
    .style("pointer-events", "none");

  lineGroups
    .append("path")
    .attr("class", "line-hit")
    .attr("fill", "none")
    .attr("stroke", "transparent")
    .attr("stroke-width", 14)
    .attr("d", (d) => line(d.values))
    .style("pointer-events", "stroke");

  const points = lineGroups
    .selectAll("circle")
    .data((d) => d.values.map((row) => ({ ...row, region: d.region })))
    .join("circle")
    .attr("class", "line-point")
    .attr("cx", (d) => x(d.month))
    .attr("cy", (d) => y(d.occupancyRate))
    .attr("r", 3.8)
    .attr("fill", (d) => REGION_COLORS(d.region))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8)
    .style("cursor", "pointer");

  bindTooltip(points, (d) => ({
    title: `${d.region} - Month ${d.month}`,
    lines: [
      { label: "Occupancy", value: `${formatNumber(d.occupancyRate, 1)}%` },
      { label: "Booked days", value: formatCount(d.bookedDays) },
      { label: "Total days", value: formatCount(d.totalDays) },
    ],
  }));

  lineGroups
    .on("click", (_, d) => onRegionToggle?.(d.region))
    .on("mouseover", function (event, d) {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      updateFocus(d.region);
    })
    .on("mouseout", function (event) {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      updateFocus(null);
    });

  updateFocus(null);

  drawColorLegend(svg, Array.from(byRegion.keys()), REGION_COLORS, SIZE.width - 118, 42, onRegionToggle);
}

function drawStackedRoomTypeBars(svg, data, selection, onRegionToggle) {
  const rows = data.filter(
    (row) => row.neighbourhood_group_cleansed && row.room_type && ROOM_COLORS.domain().includes(row.room_type)
  );
  const regions = BOROUGH_ORDER.filter((region) => rows.some((row) => row.neighbourhood_group_cleansed === region));
  const roomTypes = ROOM_COLORS.domain();

  if (!regions.length) {
    drawEmptyState(svg, "No supply data", "No borough and room type data match current filters.");
    return;
  }

  const countsByRegion = regions.map((region) => {
    const entry = { region };
    roomTypes.forEach((roomType) => {
      entry[roomType] = d3.sum(
        rows,
        (row) => (row.neighbourhood_group_cleansed === region && row.room_type === roomType ? 1 : 0)
      );
    });
    return entry;
  });

  const stack = d3.stack().keys(roomTypes);
  const series = stack(countsByRegion);
  const maxTotal = d3.max(countsByRegion, (row) => d3.sum(roomTypes, (roomType) => row[roomType])) ?? 1;

  drawFrame(svg);
  const margin = { top: 34, right: 130, bottom: 60, left: 62 };
  const x = d3.scaleBand().domain(regions).range([margin.left, SIZE.width - margin.right]).padding(0.16);
  const y = d3.scaleLinear().domain([0, maxTotal]).nice().range([SIZE.height - margin.bottom, margin.top]);

  drawXYAxes(svg, x, y, margin, "Borough", "Listings", {
    yFormat: formatCompactCount,
    tickLabelLimit: 12,
  });

  const groups = svg
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d) => ROOM_COLORS(d.key));

  const segments = groups
    .selectAll("rect")
    .data((d) => d.map((segment) => ({ key: d.key, region: segment.data.region, count: segment.data[d.key], start: segment[0], end: segment[1] })))
    .join("rect")
    .attr("x", (d) => x(d.region))
    .attr("y", (d) => y(d.end))
    .attr("width", x.bandwidth())
    .attr("height", (d) => Math.max(0, y(d.start) - y(d.end)))
    .attr("rx", 4)
    .attr("fill", (d) => ROOM_COLORS(d.key))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8)
    .style("cursor", "pointer")
    .style("opacity", (d) => (!selection.region || selection.region === d.region ? 1 : 0.28))
    .on("click", (_, d) => onRegionToggle?.(d.region));

  bindTooltip(segments, (d) => ({
    title: `${d.region} - ${d.key}`,
    lines: [{ label: "Listings", value: formatCount(d.count) }],
  }));

  svg
    .append("g")
    .selectAll("text")
    .data(series.flatMap((serie) =>
      serie.map((segment) => ({
        key: serie.key,
        region: segment.data.region,
        count: segment.data[serie.key],
        start: segment[0],
        end: segment[1],
      }))
    ))
    .join("text")
    .attr("x", (d) => x(d.region) + x.bandwidth() / 2)
    .attr("y", (d) => y((d.start + d.end) / 2) + 4)
    .attr("text-anchor", "middle")
    .attr("fill", "#ffffff")
    .attr("font-size", 10)
    .attr("font-weight", 700)
    .style("pointer-events", "none")
    .text((d) => {
      const height = y(d.start) - y(d.end);
      return height > 18 ? formatCompactCount(d.count) : "";
    });

  drawColorLegend(svg, roomTypes, ROOM_COLORS, SIZE.width - 116, 34);
}

function drawRatingBoxplot(svg, data, selection, onRegionToggle) {
  const rows = data.filter((row) => Number.isFinite(row.review_scores_rating));
  const regions = BOROUGH_ORDER.filter((region) => rows.some((row) => row.neighbourhood_group_cleansed === region));

  if (!regions.length) {
    drawEmptyState(svg, "No rating data", "No borough ratings match current filters.");
    return;
  }

  const stats = regions
    .map((region) => ({
      region,
      ...computeBoxStats(rows.filter((row) => row.neighbourhood_group_cleansed === region).map((row) => row.review_scores_rating)),
    }))
    .filter((item) => item.count > 0);
  const statsByRegion = new Map(stats.map((item) => [item.region, item]));
  const displayRows = rows.map((row) => {
    const boxStats = statsByRegion.get(row.neighbourhood_group_cleansed);
    const value = row.review_scores_rating;
    return {
      ...row,
      isOutlier: Boolean(boxStats && Number.isFinite(value) && (value < boxStats.lower || value > boxStats.upper)),
    };
  });

  drawFrame(svg);
  const margin = { top: 30, right: 34, bottom: 58, left: 64 };
  const x = d3.scaleBand().domain(regions).range([margin.left, SIZE.width - margin.right]).padding(0.18);
  const y = d3.scaleLinear().domain([0, 5]).range([SIZE.height - margin.bottom, margin.top]);

  drawXYAxes(svg, x, y, margin, "Borough", "Rating", {
    yFormat: (d) => formatNumber(d, 1),
    tickLabelLimit: 12,
  });

  const boxGroups = svg
    .append("g")
    .selectAll("g")
    .data(stats)
    .join("g")
    .attr("transform", (d) => `translate(${x(d.region)}, 0)`)
    .style("cursor", "pointer")
    .style("opacity", (d) => (!selection.region || selection.region === d.region ? 1 : 0.25))
    .on("click", (_, d) => onRegionToggle?.(d.region));

  bindTooltip(boxGroups, (d) => ({
    title: d.region,
    lines: [
      { label: "Median", value: formatNumber(d.median, 2) },
      { label: "Q1", value: formatNumber(d.q1, 2) },
      { label: "Q3", value: formatNumber(d.q3, 2) },
      { label: "Min", value: formatNumber(d.min, 2) },
      { label: "Max", value: formatNumber(d.max, 2) },
      { label: "Outliers", value: formatCount(d.outlierCount ?? 0) },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));

  boxGroups
    .append("line")
    .attr("class", "box-whisker")
    .attr("x1", x.bandwidth() / 2)
    .attr("x2", x.bandwidth() / 2)
    .attr("y1", (d) => y(d.lower))
    .attr("y2", (d) => y(d.upper))
    .attr("stroke", (d) => (selection.region === d.region ? COLORS.blue : COLORS.slate))
    .attr("stroke-width", (d) => (selection.region === d.region ? 1.6 : 1.2));

  boxGroups
    .append("rect")
    .attr("class", "box-iqr")
    .attr("x", x.bandwidth() * 0.24)
    .attr("y", (d) => y(d.q3))
    .attr("width", x.bandwidth() * 0.52)
    .attr("height", (d) => Math.max(2, y(d.q1) - y(d.q3)))
    .attr("rx", 4)
    .attr("fill", "#94a3b8")
    .attr("fill-opacity", 0.35)
    .attr("stroke", (d) => (selection.region === d.region ? COLORS.blue : "#64748b"))
    .attr("stroke-width", (d) => (selection.region === d.region ? 1.4 : 1));

  boxGroups
    .append("line")
    .attr("class", "box-median")
    .attr("x1", x.bandwidth() * 0.24)
    .attr("x2", x.bandwidth() * 0.76)
    .attr("y1", (d) => y(d.median))
    .attr("y2", (d) => y(d.median))
    .attr("stroke", (d) => (selection.region === d.region ? COLORS.blue : COLORS.text))
    .attr("stroke-width", (d) => (selection.region === d.region ? 2 : 1.6));

  const points = svg
    .append("g")
    .selectAll("circle")
    .data(displayRows)
    .join("circle")
    .attr("cx", (d) => x(d.neighbourhood_group_cleansed) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.review_scores_rating))
    .attr("r", (d) => (d.isOutlier ? 4.2 : 3.2))
    .attr("fill", (d) => (d.isOutlier ? COLORS.red : COLORS.blue))
    .attr("fill-opacity", (d) => (d.isOutlier ? 0.9 : 0.45))
    .attr("stroke", (d) => (d.isOutlier ? COLORS.red : "#ffffff"))
    .attr("stroke-width", (d) => (d.isOutlier ? 0.8 : 0.5))
    .style("opacity", (d) => (!selection.region || selection.region === d.neighbourhood_group_cleansed ? 1 : 0.18))
    .style("pointer-events", "none");

  bindTooltip(points, (d) => ({
    title: d.neighbourhood_cleansed || d.neighbourhood_group_cleansed,
    lines: [
      { label: "Rating", value: formatNumber(d.review_scores_rating, 2) },
      { label: "Outlier", value: d.isOutlier ? "Yes" : "No" },
    ],
  }));
}

function drawPriceDistributionBoxplot(svg, data, selection, onRegionToggle) {
  const rows = data.filter((row) => Number.isFinite(row.price) && row.price_is_outlier !== true);
  const regions = BOROUGH_ORDER.filter((region) => rows.some((row) => row.neighbourhood_group_cleansed === region));

  if (!regions.length) {
    drawEmptyState(svg, "No price distribution", "No borough prices match current filters.");
    return;
  }

  const stats = regions
    .map((region) => ({
      region,
      ...computeBoxStats(rows.filter((row) => row.neighbourhood_group_cleansed === region).map((row) => row.price)),
    }))
    .filter((item) => item.count > 0);
  const statsByRegion = new Map(stats.map((item) => [item.region, item]));
  const displayRows = rows.map((row) => {
    const boxStats = statsByRegion.get(row.neighbourhood_group_cleansed);
    const value = row.price;
    return {
      ...row,
      isOutlier: Boolean(boxStats && Number.isFinite(value) && (value < boxStats.lower || value > boxStats.upper)),
    };
  });

  drawFrame(svg);
  const margin = { top: 30, right: 128, bottom: 58, left: 64 };
  const x = d3.scaleBand().domain(regions).range([margin.left, SIZE.width - margin.right]).padding(0.18);
  const y = d3.scaleLinear().domain([0, d3.max(rows, (row) => row.price) ?? 1]).nice().range([SIZE.height - margin.bottom, margin.top]);

  drawXYAxes(svg, x, y, margin, "Borough", "Price", {
    yFormat: (d) => formatCurrency(d, 0),
    tickLabelLimit: 12,
  });

  const boxGroups = svg
    .append("g")
    .selectAll("g")
    .data(stats)
    .join("g")
    .attr("transform", (d) => `translate(${x(d.region)}, 0)`)
    .style("cursor", "pointer")
    .style("opacity", (d) => (!selection.region || selection.region === d.region ? 1 : 0.25))
    .on("click", (_, d) => onRegionToggle?.(d.region));

  bindTooltip(boxGroups, (d) => ({
    title: d.region,
    lines: [
      { label: "Median", value: formatCurrency(d.median, 0) },
      { label: "Q1", value: formatCurrency(d.q1, 0) },
      { label: "Q3", value: formatCurrency(d.q3, 0) },
      { label: "Min", value: formatCurrency(d.min, 0) },
      { label: "Max", value: formatCurrency(d.max, 0) },
      { label: "Outliers", value: formatCount(d.outlierCount ?? 0) },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));

  boxGroups
    .append("line")
    .attr("class", "box-whisker")
    .attr("x1", x.bandwidth() / 2)
    .attr("x2", x.bandwidth() / 2)
    .attr("y1", (d) => y(d.lower))
    .attr("y2", (d) => y(d.upper))
    .attr("stroke", (d) => (selection.region === d.region ? COLORS.blue : COLORS.slate))
    .attr("stroke-width", (d) => (selection.region === d.region ? 1.6 : 1.2));

  boxGroups
    .append("rect")
    .attr("class", "box-iqr")
    .attr("x", x.bandwidth() * 0.24)
    .attr("y", (d) => y(d.q3))
    .attr("width", x.bandwidth() * 0.52)
    .attr("height", (d) => Math.max(2, y(d.q1) - y(d.q3)))
    .attr("rx", 4)
    .attr("fill", "#94a3b8")
    .attr("fill-opacity", 0.35)
    .attr("stroke", (d) => (selection.region === d.region ? COLORS.blue : "#64748b"))
    .attr("stroke-width", (d) => (selection.region === d.region ? 1.4 : 1));

  boxGroups
    .append("line")
    .attr("class", "box-median")
    .attr("x1", x.bandwidth() * 0.24)
    .attr("x2", x.bandwidth() * 0.76)
    .attr("y1", (d) => y(d.median))
    .attr("y2", (d) => y(d.median))
    .attr("stroke", (d) => (selection.region === d.region ? COLORS.blue : COLORS.text))
    .attr("stroke-width", (d) => (selection.region === d.region ? 2 : 1.6));

  const points = svg
    .append("g")
    .selectAll("circle")
    .data(displayRows)
    .join("circle")
    .attr("cx", (d) => x(d.neighbourhood_group_cleansed) + x.bandwidth() / 2 + (ROOM_TYPE_OFFSETS.get(d.room_type) ?? 0))
    .attr("cy", (d) => y(d.price))
    .attr("r", (d) => (d.isOutlier ? 4.2 : 3.2))
    .attr("fill", (d) => (d.isOutlier ? COLORS.red : ROOM_COLORS(d.room_type)))
    .attr("fill-opacity", (d) => (d.isOutlier ? 0.9 : 0.8))
    .attr("stroke", (d) => (d.isOutlier ? COLORS.red : "#ffffff"))
    .attr("stroke-width", (d) => (d.isOutlier ? 0.8 : 0.5))
    .style("opacity", (d) => (!selection.region || selection.region === d.neighbourhood_group_cleansed ? 0.85 : 0.16))
    .style("pointer-events", "none");

  bindTooltip(points, (d) => ({
    title: d.neighbourhood_cleansed || d.neighbourhood_group_cleansed,
    lines: [
      { label: "Price", value: formatCurrency(d.price, 0) },
      { label: "Outlier", value: d.isOutlier ? "Yes" : "No" },
    ],
  }));

  drawColorLegend(svg, ROOM_COLORS.domain(), ROOM_COLORS, SIZE.width - 116, 34);
}

function drawPricePerPersonGroupedBars(svg, data, selection, onRoomTypeToggle) {
  const rows = data
    .filter((row) => Number.isFinite(row.price) && Number.isFinite(row.accommodates) && row.accommodates > 0 && row.price_is_outlier !== true)
    .map((row) => ({
      ...row,
      pricePerPerson: row.price / row.accommodates,
    }));
  const regions = BOROUGH_ORDER.filter((region) => rows.some((row) => row.neighbourhood_group_cleansed === region));
  const roomTypes = ROOM_COLORS.domain();

  if (!regions.length) {
    drawEmptyState(svg, "No price-per-person data", "No grouped bar values match current filters.");
    return;
  }

  const grouped = regions.map((region) => {
    const entry = { region };
    roomTypes.forEach((roomType) => {
      const values = rows
        .filter((row) => row.neighbourhood_group_cleansed === region && row.room_type === roomType)
        .map((row) => row.pricePerPerson);
      entry[roomType] = values.length ? d3.median(values) : null;
      entry[`${roomType}Count`] = values.length;
    });
    return entry;
  });

  const maxValue = d3.max(grouped, (row) => d3.max(roomTypes, (roomType) => row[roomType] ?? 0)) ?? 1;

  drawFrame(svg);
  const margin = { top: 34, right: 128, bottom: 72, left: 64 };
  const x0 = d3.scaleBand().domain(regions).range([margin.left, SIZE.width - margin.right]).padding(0.12);
  const x1 = d3.scaleBand().domain(roomTypes).range([0, x0.bandwidth()]).padding(0.16);
  const y = d3.scaleLinear().domain([0, maxValue]).nice().range([SIZE.height - margin.bottom, margin.top]);

  drawXYAxes(svg, x0, y, margin, "Borough", "Median $ / guest", {
    yFormat: (d) => formatCurrency(d, 0),
    tickLabelLimit: 12,
  });

  const groups = svg
    .append("g")
    .selectAll("g")
    .data(grouped)
    .join("g")
    .attr("transform", (d) => `translate(${x0(d.region)}, 0)`);

  const bars = groups
    .selectAll("rect")
    .data((d) => roomTypes.map((roomType) => ({ region: d.region, roomType, value: d[roomType], count: d[`${roomType}Count`] })))
    .join("rect")
    .attr("x", (d) => x1(d.roomType))
    .attr("y", (d) => (d.value == null ? y(0) : y(d.value)))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => (d.value == null ? 0 : SIZE.height - margin.bottom - y(d.value)))
    .attr("rx", 3)
    .attr("fill", (d) => ROOM_COLORS(d.roomType))
    .attr("fill-opacity", 0.92)
    .style("cursor", "pointer")
    .style("opacity", (d) => (!selection.roomType || selection.roomType === d.roomType ? 1 : 0.22))
    .on("click", (_, d) => onRoomTypeToggle?.(d.roomType));

  bindTooltip(bars, (d) => ({
    title: `${d.region} - ${d.roomType}`,
    lines: [
      { label: "Median price/person", value: formatCurrency(d.value, 0) },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));

  groups
    .selectAll("text.bar-label")
    .data((d) => roomTypes.map((roomType) => ({ region: d.region, roomType, value: d[roomType], count: d[`${roomType}Count`] })))
    .join("text")
    .attr("class", "bar-label")
    .attr("x", (d) => x1(d.roomType) + x1.bandwidth() / 2)
    .attr("y", (d) => (d.value == null ? y(0) - 4 : y(d.value) - 4))
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.text)
    .attr("font-size", 10)
    .text((d) => (d.value != null ? formatCurrency(d.value, 0) : ""));

  drawColorLegend(svg, roomTypes, ROOM_COLORS, SIZE.width - 116, 34, onRoomTypeToggle);
}

function drawHostPerformanceBars(svg, metrics) {
  const rows = metrics?.hostPerformance ?? [];
  if (rows.length < 2) {
    drawEmptyState(svg, "No host metrics", "Run npm run build-derived-data.");
    return;
  }

  const displayRows = rows.map((row) => ({
    ...row,
    displayLabel: HOST_TYPE_LABELS[row.hostType] ?? row.hostType,
    axisLabel: HOST_TYPE_AXIS_LABELS[row.hostType] ?? row.hostType,
    occupancyShare: row.occupancyRate / 100,
  })).sort((left, right) => {
    const order = ["Individual host", "Professional host"];
    return order.indexOf(left.hostType) - order.indexOf(right.hostType);
  });

  drawFrame(svg);
  const margin = { top: 44, right: 44, bottom: 72, left: 84 };
  const panelGap = 32;
  const panelHeight = (SIZE.height - margin.top - margin.bottom - panelGap) / 2;
  const x = d3.scaleBand().domain(displayRows.map((row) => row.axisLabel)).range([margin.left, SIZE.width - margin.right]).padding(0.3);

  const panels = [
    {
      key: "avgRating",
      label: "Avg. Review Scores Rating",
      axisLabel: "Avg. Rating",
      yMax: 5,
      yFormat: (d) => formatNumber(d, 1),
      accessor: (row) => row.avgRating,
    },
    {
      key: "occupancyShare",
      label: "Avg. Is Booked",
      axisLabel: "Booked Share",
      yMax: d3.max(displayRows, (row) => row.occupancyShare) ?? 0.4,
      yFormat: (d) => formatNumber(d, 2),
      accessor: (row) => row.occupancyShare,
    },
  ];

  panels.forEach((panel, index) => {
    const y0 = margin.top + index * (panelHeight + panelGap);
    const y = d3.scaleLinear().domain([0, panel.yMax]).nice().range([y0 + panelHeight, y0]);
    const xAxis = d3.axisBottom(x).tickSizeOuter(0).tickFormat((d) => d);
    xAxis.tickValues(displayRows.map((row) => row.axisLabel));

    svg
      .append("g")
      .attr("transform", `translate(0, ${y0 + panelHeight})`)
      .call(index === panels.length - 1 ? xAxis : xAxis.tickFormat(() => ""))
      .call(styleAxisText);
    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(y).ticks(5).tickFormat(panel.yFormat)).call(styleAxisText);
    svg.append("text").attr("x", margin.left).attr("y", y0 - 10).attr("fill", COLORS.text).attr("font-size", 12).attr("font-weight", 400).text(panel.label);
    svg
      .append("text")
      .attr("transform", `translate(${margin.left - 50}, ${y0 + panelHeight / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.muted)
      .attr("font-size", 10)
      .text(panel.axisLabel);

    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(displayRows)
      .join("rect")
      .attr("x", (d) => x(d.axisLabel))
      .attr("y", (d) => y(panel.accessor(d)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(y.domain()[0]) - y(panel.accessor(d)))
      .attr("fill", (d) => HOST_COLORS(d.hostType))
      .attr("fill-opacity", 0.95);

    bindTooltip(bars, (d) => ({
      title: d.displayLabel,
      lines: [
        { label: panel.label, value: panel.yFormat(panel.accessor(d)) },
        { label: "Hosts", value: formatCount(d.hostCount) },
        { label: "Listings", value: formatCount(d.listingCount) },
      ],
    }));
  });

  svg
    .append("text")
    .attr("x", SIZE.width / 2)
    .attr("y", SIZE.height - 16)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text("Host Type");
}

function drawCapacityHeatmap(svg, data, selection, onRegionToggle) {
  const bins = [
    { label: "1-2 guests", test: (value) => value <= 2 },
    { label: "3-4 guests", test: (value) => value >= 3 && value <= 4 },
    { label: "5-6 guests", test: (value) => value >= 5 && value <= 6 },
    { label: "7+ guests", test: (value) => value >= 7 },
  ];
  const regions = sortedRegions(data);
  const counts = new Map();

  data.forEach((row) => {
    const capacity = row.accommodates;
    const bin = bins.find((item) => item.test(capacity));
    if (!bin || !row.neighbourhood_group_cleansed) {
      return;
    }

    const key = `${row.neighbourhood_group_cleansed}|${bin.label}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  if (!counts.size) {
    drawEmptyState(svg, "No capacity data", "No listings match current filters.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 34, right: 36, bottom: 76, left: 132 };
  const x = d3.scaleBand().domain(bins.map((bin) => bin.label)).range([margin.left, SIZE.width - margin.right]).padding(0.08);
  const y = d3.scaleBand().domain(regions).range([margin.top, SIZE.height - margin.bottom]).padding(0.08);
  const color = d3.scaleSequential(d3.interpolateYlGnBu).domain([0, d3.max(counts.values()) ?? 1]);

  drawHeatmapAxes(svg, x, y, margin, "Capacity group", "Borough");

  const cells = svg
    .append("g")
    .selectAll("rect")
    .data(regions.flatMap((region) => bins.map((bin) => ({ region, bin: bin.label, count: counts.get(`${region}|${bin.label}`) ?? 0 }))))
    .join("rect")
    .attr("x", (d) => x(d.bin))
    .attr("y", (d) => y(d.region))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 5)
    .attr("fill", (d) => color(d.count))
    .attr("stroke", "#ffffff")
    .style("opacity", (d) => (!selection.region || selection.region === d.region ? 1 : 0.25))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRegionToggle?.(d.region));

  bindTooltip(cells, (d) => ({
    title: `${d.region} - ${d.bin}`,
    lines: [{ label: "Listings", value: formatCount(d.count) }],
  }));
}

function drawQualityScatter(svg, data, selection, onRoomTypeToggle) {
  const rows = data
    .filter((row) => Number.isFinite(row.review_scores_rating) && Number.isFinite(row.number_of_reviews) && row.number_of_reviews > 0)
    .map((row, index) => ({ ...row, __pointId: row.__index ?? index, x: row.number_of_reviews + 1, y: row.review_scores_rating, r: row.reviews_per_month ?? 0 }));

  if (!rows.length) {
    drawEmptyState(svg, "No review data", "No rated listings match current filters.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 28, right: 124, bottom: 58, left: 62 };
  const x = d3.scaleLog().domain([1, d3.max(rows, (row) => row.x) ?? 10]).range([margin.left, SIZE.width - margin.right]);
  const y = d3.scaleLinear().domain([Math.max(3, d3.min(rows, (row) => row.y) ?? 3), 5]).nice().range([SIZE.height - margin.bottom, margin.top]);
  const radius = d3.scaleSqrt().domain([0, d3.max(rows, (row) => row.r) ?? 1]).range([2.5, 9]);
  const displayRows = samplePoints(rows, MAX_POINTS, (row) => selection.roomType === row.room_type);

  drawXYAxes(svg, x, y, margin, "Reviews (log)", "Rating", { xFormat: (d) => formatNumber(d - 1, 0), yFormat: (d) => formatNumber(d, 1) });

  const points = svg
    .append("g")
    .selectAll("circle")
    .data(displayRows, (d) => d.__pointId)
    .join("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", (d) => radius(d.r))
    .attr("fill", (d) => ROOM_COLORS(d.room_type))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8)
    .style("opacity", (d) => (!selection.roomType || selection.roomType === d.room_type ? 0.72 : 0.12))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRoomTypeToggle?.(d.room_type));

  bindTooltip(points, listingTooltip);
  drawColorLegend(svg, ROOM_COLORS.domain(), ROOM_COLORS, SIZE.width - 112, 44, onRoomTypeToggle);
}

function drawPriceBoxplot(svg, data, selection, onRegionToggle) {
  const rows = data.filter((row) => Number.isFinite(row.price) && row.price_is_outlier !== true);
  const roomTypes = ROOM_COLORS.domain();
  const stats = [];

  d3.rollups(
    rows,
    (groupRows) => {
      const prices = groupRows.map((row) => row.price).sort(d3.ascending);
      if (prices.length < 5) {
        return null;
      }
      const q1 = d3.quantileSorted(prices, 0.25);
      const median = d3.quantileSorted(prices, 0.5);
      const q3 = d3.quantileSorted(prices, 0.75);
      const iqr = q3 - q1;
      const lower = d3.max([d3.min(prices), q1 - 1.5 * iqr]);
      const upper = d3.min([d3.max(prices), q3 + 1.5 * iqr]);
      return { q1, median, q3, lower, upper, count: prices.length };
    },
    (row) => row.neighbourhood_group_cleansed,
    (row) => row.room_type
  ).forEach(([region, roomGroups]) => {
    roomGroups.forEach(([roomType, value]) => {
      if (value && roomTypes.includes(roomType)) {
        stats.push({ region, roomType, ...value });
      }
    });
  });

  if (!stats.length) {
    drawEmptyState(svg, "No price distribution", "No non-outlier prices match current filters.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 26, right: 124, bottom: 68, left: 64 };
  const regions = sortedRegions(rows);
  const xRegion = d3.scaleBand().domain(regions).range([margin.left, SIZE.width - margin.right]).padding(0.16);
  const xRoom = d3.scaleBand().domain(roomTypes).range([0, xRegion.bandwidth()]).padding(0.25);
  const y = d3.scaleLinear().domain([0, d3.max(stats, (d) => d.upper) ?? 1]).nice().range([SIZE.height - margin.bottom, margin.top]);
  drawXYAxes(svg, xRegion, y, margin, "Borough", "Price", { yFormat: (d) => `$${formatNumber(d, 0)}` });

  const boxGroups = svg
    .append("g")
    .selectAll("g")
    .data(stats)
    .join("g")
    .attr("transform", (d) => `translate(${xRegion(d.region) + xRoom(d.roomType)}, 0)`)
    .style("opacity", (d) => (!selection.region || selection.region === d.region ? 1 : 0.22))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRegionToggle?.(d.region));

  boxGroups.append("line").attr("x1", xRoom.bandwidth() / 2).attr("x2", xRoom.bandwidth() / 2).attr("y1", (d) => y(d.lower)).attr("y2", (d) => y(d.upper)).attr("stroke", COLORS.slate);
  boxGroups.append("rect").attr("x", 0).attr("y", (d) => y(d.q3)).attr("width", xRoom.bandwidth()).attr("height", (d) => Math.max(2, y(d.q1) - y(d.q3))).attr("rx", 3).attr("fill", (d) => ROOM_COLORS(d.roomType)).attr("fill-opacity", 0.3).attr("stroke", (d) => ROOM_COLORS(d.roomType));
  boxGroups.append("line").attr("x1", 0).attr("x2", xRoom.bandwidth()).attr("y1", (d) => y(d.median)).attr("y2", (d) => y(d.median)).attr("stroke", (d) => ROOM_COLORS(d.roomType)).attr("stroke-width", 2);
  boxGroups.append("line").attr("x1", 2).attr("x2", xRoom.bandwidth() - 2).attr("y1", (d) => y(d.lower)).attr("y2", (d) => y(d.lower)).attr("stroke", COLORS.slate);
  boxGroups.append("line").attr("x1", 2).attr("x2", xRoom.bandwidth() - 2).attr("y1", (d) => y(d.upper)).attr("y2", (d) => y(d.upper)).attr("stroke", COLORS.slate);

  bindTooltip(boxGroups, (d) => ({
    title: `${d.region} - ${d.roomType}`,
    lines: [
      { label: "Median", value: formatCurrency(d.median, 0) },
      { label: "Q1 / Q3", value: `${formatCurrency(d.q1, 0)} / ${formatCurrency(d.q3, 0)}` },
      { label: "Whiskers", value: `${formatCurrency(d.lower, 0)} - ${formatCurrency(d.upper, 0)}` },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));
  drawColorLegend(svg, roomTypes, ROOM_COLORS, SIZE.width - 112, 44);
}

function drawGoodDealScatter(svg, data, selection, onRoomTypeToggle) {
  const eligible = data.filter(
    (row) =>
      Number.isFinite(row.price) &&
      Number.isFinite(row.review_scores_rating) &&
      Number.isFinite(row.number_of_reviews) &&
      row.number_of_reviews > 0 &&
      row.price_is_outlier !== true
  );
  const medianPrice = d3.median(eligible, (row) => row.price);
  const rows = eligible.map((row, index) => ({
    ...row,
    __pointId: row.__index ?? index,
    isGoodDeal: row.price <= medianPrice && row.review_scores_rating >= 4.8,
  }));

  if (!rows.length) {
    drawEmptyState(svg, "No good-deal data", "No listings with enough reviews match current filters.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 28, right: 150, bottom: 58, left: 62 };
  const xMax = d3.max(rows, (row) => row.price) ?? 1;
  const x = d3.scaleLinear().domain([0, xMax]).nice().range([margin.left, SIZE.width - margin.right]);
  const y = d3.scaleLinear().domain([0, 5]).range([SIZE.height - margin.bottom, margin.top]);
  const radius = d3.scaleSqrt().domain([1, d3.max(rows, (row) => row.number_of_reviews) ?? 2]).range([2.5, 9]);
  const displayRows = samplePoints(rows, MAX_GOOD_DEAL_POINTS, (row) => row.isGoodDeal || selection.roomType === row.room_type);

  drawXYAxes(svg, x, y, margin, "Price", "Review Scores Rating", { xFormat: (d) => `$${formatNumber(d, 0)}`, yFormat: (d) => formatNumber(d, 1) });
  svg.append("line").attr("x1", x(medianPrice)).attr("x2", x(medianPrice)).attr("y1", margin.top).attr("y2", SIZE.height - margin.bottom).attr("stroke", COLORS.slate).attr("stroke-dasharray", "4 4");
  svg.append("line").attr("x1", margin.left).attr("x2", SIZE.width - margin.right).attr("y1", y(4.8)).attr("y2", y(4.8)).attr("stroke", COLORS.slate).attr("stroke-dasharray", "4 4");
  svg.append("text").attr("x", x(medianPrice) + 6).attr("y", margin.top + 12).attr("fill", COLORS.muted).attr("font-size", 10).text("Median");
  svg.append("text").attr("x", margin.left + 6).attr("y", y(4.8) - 6).attr("fill", COLORS.muted).attr("font-size", 10).text("Good Deal threshold (4.8)");

  const points = svg
    .append("g")
    .selectAll("circle")
    .data(displayRows, (d) => d.__pointId)
    .join("circle")
    .attr("cx", (d) => x(d.price))
    .attr("cy", (d) => y(d.review_scores_rating))
    .attr("r", (d) => radius(d.number_of_reviews))
    .attr("fill", (d) => (d.isGoodDeal ? "#59a14f" : "#bab0ab"))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8)
    .style("opacity", (d) => (d.isGoodDeal ? 0.92 : 0.42))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRoomTypeToggle?.(d.room_type));

  bindTooltip(points, (d) => ({
    title: d.isGoodDeal ? "Good deal" : "Normal",
    lines: [
      { label: "Price", value: formatCurrency(d.price, 0) },
      { label: "Rating", value: formatNumber(d.review_scores_rating, 2) },
      { label: "Room type", value: d.room_type ?? "Unknown" },
      { label: "Reviews", value: formatCount(d.number_of_reviews) },
      { label: "Neighbourhood", value: d.neighbourhood_cleansed ?? "Unknown" },
    ],
  }));

  drawSizeLegend(
    svg,
    "Number of Reviews",
    [1, 1000, 2000, 3000, d3.max(rows, (row) => row.number_of_reviews) ?? 0],
    radius,
    SIZE.width - 112,
    44
  );
  drawBinaryLegend(
    svg,
    [
      { label: "Good Deal", color: "#59a14f" },
      { label: "Normal", color: "#bab0ab" },
    ],
    SIZE.width - 112,
    176,
    "Good Deal Flag"
  );
}

function drawCostTrend(svg, data, selection, onRoomTypeToggle) {
  const rows = data
    .filter((row) => Number.isFinite(row.price) && Number.isFinite(row.accommodates) && row.accommodates >= 1 && row.accommodates <= 16 && row.price_is_outlier !== true)
    .map((row) => ({ ...row, pricePerGuest: row.price / row.accommodates }));
  const roomTypes = ROOM_COLORS.domain().filter((roomType) => rows.some((row) => row.room_type === roomType));
  const grouped = [];

  roomTypes.forEach((roomType) => {
    d3.rollups(
      rows.filter((row) => row.room_type === roomType),
      (items) => ({
        value: d3.median(items, (row) => row.pricePerGuest),
        count: items.length,
      }),
      (row) => row.accommodates
    ).forEach(([capacity, stats]) => {
      if (stats.count >= 5) {
        grouped.push({ roomType, capacity: Number(capacity), ...stats });
      }
    });
  });

  if (!grouped.length) {
    drawEmptyState(svg, "No cost data", "No capacity/price values match current filters.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 28, right: 124, bottom: 58, left: 62 };
  const x = d3.scaleLinear().domain([1, 16]).range([margin.left, SIZE.width - margin.right]);
  const y = d3.scaleLinear().domain([0, d3.max(grouped, (d) => d.value) ?? 1]).nice().range([SIZE.height - margin.bottom, margin.top]);
  drawXYAxes(svg, x, y, margin, "Accommodates", "Median $ / guest", { xFormat: (d) => formatNumber(d, 0), yFormat: (d) => `$${formatNumber(d, 0)}` });

  const byRoom = d3.group(grouped, (d) => d.roomType);
  byRoom.forEach((values, roomType) => {
    const sorted = values.sort((a, b) => a.capacity - b.capacity);
    const regression = linearRegression(sorted);
    if (regression) {
      const endpoints = [d3.min(sorted, (d) => d.capacity), d3.max(sorted, (d) => d.capacity)];
      svg
        .append("line")
        .attr("x1", x(endpoints[0]))
        .attr("x2", x(endpoints[1]))
        .attr("y1", y(regression.slope * endpoints[0] + regression.intercept))
        .attr("y2", y(regression.slope * endpoints[1] + regression.intercept))
        .attr("stroke", ROOM_COLORS(roomType))
        .attr("stroke-width", 2.5)
        .attr("stroke-dasharray", "5 4")
        .style("opacity", !selection.roomType || selection.roomType === roomType ? 1 : 0.15);
    }
  });

  const points = svg
    .append("g")
    .selectAll("circle")
    .data(grouped)
    .join("circle")
    .attr("cx", (d) => x(d.capacity))
    .attr("cy", (d) => y(d.value))
    .attr("r", 5)
    .attr("fill", (d) => ROOM_COLORS(d.roomType))
    .attr("stroke", "#ffffff")
    .style("opacity", (d) => (!selection.roomType || selection.roomType === d.roomType ? 0.9 : 0.16))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRoomTypeToggle?.(d.roomType));

  bindTooltip(points, (d) => ({
    title: `${d.roomType} - ${d.capacity} guests`,
    lines: [
      { label: "Median / guest", value: formatCurrency(d.value, 0) },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));
  drawColorLegend(svg, roomTypes, ROOM_COLORS, SIZE.width - 112, 44, onRoomTypeToggle);
}

function drawPolicyHeatmap(svg, metrics) {
  const rows = (metrics?.monthlyOccupancyByMinNights ?? []).filter(
    (row) => row.totalDays > 0 && Number.isFinite(row.occupancyRate)
  );
  if (!rows.length) {
    drawEmptyState(svg, "No policy data", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const groups = ["Long >7", "Medium 4-7", "Short <=3"];
  const months = Array.from(new Set(rows.map((row) => row.month))).sort((a, b) => a - b);
  const margin = { top: 34, right: 148, bottom: 62, left: 120 };
  const x = d3.scaleBand().domain(months).range([margin.left, SIZE.width - margin.right]).padding(0.06);
  const y = d3.scaleBand().domain(groups).range([margin.top, SIZE.height - margin.bottom]).padding(0.08);
  const extent = d3.extent(rows, (row) => row.occupancyRate);
  const color = d3.scaleSequential(d3.interpolateYlGnBu).domain(extent);
  drawHeatmapAxes(svg, x, y, margin, "Month", "Minimum nights", {
    xFormat: monthName,
    yLabelX: 24,
  });

  const cells = svg
    .append("g")
    .selectAll("rect")
    .data(rows)
    .join("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d.minNightsGroup))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 5)
    .attr("fill", (d) => color(d.occupancyRate))
    .attr("stroke", "#ffffff");

  svg
    .append("g")
    .selectAll("text")
    .data(rows)
    .join("text")
    .attr("x", (d) => x(d.month) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.minNightsGroup) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.text)
    .attr("font-size", 9)
    .text((d) => `${formatNumber(d.occupancyRate, 0)}%`);

  bindTooltip(cells, (d) => ({
    title: `${d.minNightsGroup} - ${monthName(d.month)}`,
    lines: [
      { label: "Occupancy", value: `${formatNumber(d.occupancyRate, 1)}%` },
      { label: "Calendar days", value: formatCount(d.totalDays) },
    ],
  }));

  drawSequentialLegend(
    svg,
    color,
    extent,
    "Occupancy %",
    SIZE.width - 146,
    34,
    (value) => `${formatNumber(value, 0)}%`
  );
}

function drawHostPerformance(svg, metrics) {
  const rows = metrics?.hostPerformance ?? [];
  if (!rows.length) {
    drawEmptyState(svg, "No host metrics", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const panels = [
    { key: "avgRating", label: "Average rating", max: 5, format: (d) => formatNumber(d, 2), color: COLORS.blue },
    { key: "occupancyRate", label: "Occupancy rate", max: 100, format: (d) => `${formatNumber(d, 1)}%`, color: COLORS.teal },
  ];
  const margin = { top: 42, right: 28, bottom: 64, left: 58 };
  const gap = 48;
  const panelWidth = (SIZE.width - margin.left - margin.right - gap) / 2;
  const panelHeight = SIZE.height - margin.top - margin.bottom;

  panels.forEach((panel, index) => {
    const x0 = margin.left + index * (panelWidth + gap);
    const x = d3.scaleBand().domain(rows.map((row) => row.hostType)).range([x0, x0 + panelWidth]).padding(0.28);
    const y = d3.scaleLinear().domain([0, panel.max]).nice().range([margin.top + panelHeight, margin.top]);

    svg.append("text").attr("x", x0).attr("y", 24).attr("fill", COLORS.text).attr("font-size", 13).attr("font-weight", 700).text(panel.label);
    svg.append("g").attr("transform", `translate(0, ${margin.top + panelHeight})`).call(d3.axisBottom(x).tickSizeOuter(0)).call(styleAxisText);
    svg.append("g").attr("transform", `translate(${x0}, 0)`).call(d3.axisLeft(y).ticks(4).tickFormat(panel.format)).call(styleAxisText);

    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(rows)
      .join("rect")
      .attr("x", (d) => x(d.hostType))
      .attr("y", (d) => y(d[panel.key]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => margin.top + panelHeight - y(d[panel.key]))
      .attr("rx", 5)
      .attr("fill", panel.color)
      .attr("fill-opacity", 0.82);

    bindTooltip(bars, (d) => ({
      title: d.hostType,
      lines: [
        { label: panel.label, value: panel.format(d[panel.key]) },
        { label: "Hosts", value: formatCount(d.hostCount) },
        { label: "Listings", value: formatCount(d.listingCount) },
      ],
    }));
  });
}

function drawExperienceWordCloud(svg, metrics) {
  const source = metrics?.sentimentTerms ?? [];
  const rows = source
    .map((row) => ({
      ...row,
      count: (row.highCount ?? 0) + (row.lowCount ?? 0),
      sentiment: row.strength >= 0 ? "Praise" : "Complaint",
    }))
    .filter((row) => row.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 48);

  if (!rows.length) {
    drawEmptyState(svg, "No review language metrics", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const bounds = { left: 34, top: 34, right: SIZE.width - 150, bottom: SIZE.height - 36 };
  const fontSize = d3
    .scaleSqrt()
    .domain(d3.extent(rows, (row) => row.count))
    .range([13, 44]);
  const placedWords = layoutWordCloud(rows, bounds, fontSize);

  const words = svg
    .append("g")
    .selectAll("text")
    .data(placedWords, (d) => d.term)
    .join("text")
    .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", (d) => (d.strength >= 0 ? "#4e79a7" : "#f28e2b"))
    .attr("font-size", (d) => d.fontSize)
    .attr("font-weight", (d, index) => (index < 5 ? 800 : 650))
    .attr("letter-spacing", 0)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 4)
    .attr("paint-order", "stroke fill")
    .style("cursor", "default")
    .text((d) => d.term);

  bindTooltip(words, (d) => ({
    title: d.term,
    lines: [
      { label: "Experience type", value: d.sentiment },
      { label: "Mentions", value: formatCount(d.count) },
      { label: "Strength", value: formatNumber(d.strength, 2) },
      { label: "High / Low count", value: `${formatCount(d.highCount)} / ${formatCount(d.lowCount)}` },
    ],
  }));

  drawBinaryLegend(
    svg,
    [
      { label: "Praise", color: "#4e79a7" },
      { label: "Complaint", color: "#f28e2b" },
    ],
    SIZE.width - 126,
    34,
    "Review tone"
  );
}

function drawSentimentBars(svg, metrics) {
  const source = metrics?.sentimentTerms ?? [];
  const positive = source.filter((row) => row.strength >= 0).sort((a, b) => b.strength - a.strength);
  const negative = source.filter((row) => row.strength < 0).sort((a, b) => a.strength - b.strength);
  const rows = [...positive, ...negative];
  if (!rows.length) {
    drawEmptyState(svg, "No review language metrics", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 26, right: 160, bottom: 48, left: 150 };
  const maxAbs = d3.max(rows, (row) => Math.abs(row.strength)) ?? 1;
  const x = d3.scaleLinear().domain([-maxAbs, maxAbs]).nice().range([margin.left, SIZE.width - margin.right]);
  const y = d3.scaleBand().domain(rows.map((row) => row.term)).range([margin.top, SIZE.height - margin.bottom]).padding(0.18);

  svg.append("g").attr("transform", `translate(0, ${SIZE.height - margin.bottom})`).call(d3.axisBottom(x).ticks(5)).call(styleAxisText);
  svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(y).tickSizeOuter(0)).call(styleAxisText);
  svg.append("line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", margin.top).attr("y2", SIZE.height - margin.bottom).attr("stroke", COLORS.slate).attr("stroke-width", 1.4);

  const bars = svg
    .append("g")
    .selectAll("rect")
    .data(rows)
    .join("rect")
    .attr("x", (d) => (d.strength < 0 ? x(d.strength) : x(0)))
    .attr("y", (d) => y(d.term))
    .attr("width", (d) => Math.abs(x(d.strength) - x(0)))
    .attr("height", y.bandwidth())
    .attr("rx", 4)
    .attr("fill", (d) => (d.strength < 0 ? "#f28e2b" : "#4e79a7"));

  bindTooltip(bars, (d) => ({
    title: d.term,
    lines: [
      { label: "Group", value: d.group },
      { label: "Strength", value: formatNumber(d.strength, 2) },
      { label: "High / Low count", value: `${formatCount(d.highCount)} / ${formatCount(d.lowCount)}` },
    ],
  }));

  drawBinaryLegend(
    svg,
    [
      { label: "Hài lòng", color: "#4e79a7" },
      { label: "Phàn nàn", color: "#f28e2b" },
    ],
    SIZE.width - 132,
    34,
    "Phân loại đánh giá"
  );
}

function computeBoxStats(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort(d3.ascending);
  if (!sorted.length) {
    return { count: 0 };
  }

  const q1 = d3.quantileSorted(sorted, 0.25);
  const median = d3.quantileSorted(sorted, 0.5);
  const q3 = d3.quantileSorted(sorted, 0.75);
  const iqr = q3 - q1;
  const lower = d3.max([d3.min(sorted), q1 - 1.5 * iqr]);
  const upper = d3.min([d3.max(sorted), q3 + 1.5 * iqr]);
  const outlierCount = sorted.filter((value) => value < lower || value > upper).length;
  return {
    count: sorted.length,
    q1,
    median,
    q3,
    lower,
    upper,
    min: d3.min(sorted),
    max: d3.max(sorted),
    outlierCount,
  };
}

function formatCompactCount(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (Math.abs(value) < 1000) {
    return String(Math.round(value));
  }

  return `${Math.round(value / 1000)}K`;
}

function drawBinaryLegend(svg, items, x, y, title) {
  const legend = svg.append("g").attr("transform", `translate(${x}, ${y})`);
  legend.append("text").attr("x", 0).attr("y", 0).attr("fill", COLORS.text).attr("font-size", 12).text(title);
  items.forEach((item, index) => {
    const row = legend.append("g").attr("transform", `translate(0, ${18 + index * 20})`);
    row.append("rect").attr("width", 14).attr("height", 14).attr("rx", 2).attr("fill", item.color);
    row.append("text").attr("x", 20).attr("y", 12).attr("fill", COLORS.text).attr("font-size", 10).text(item.label);
  });
}

function drawSizeLegend(svg, title, values, radiusScale, x, y) {
  const uniqueValues = Array.from(new Set(values.filter((value) => Number.isFinite(value)))).sort((a, b) => a - b);
  const legend = svg.append("g").attr("transform", `translate(${x}, ${y})`);
  legend.append("text").attr("x", 0).attr("y", 0).attr("fill", COLORS.text).attr("font-size", 12).text(title);

  uniqueValues.forEach((value, index) => {
    const cy = 18 + index * 22;
    legend.append("circle").attr("cx", 8).attr("cy", cy).attr("r", radiusScale(value)).attr("fill", "#ffffff").attr("stroke", COLORS.border);
    legend.append("text").attr("x", 28).attr("y", cy + 4).attr("fill", COLORS.text).attr("font-size", 10).text(value >= 1000 ? value.toLocaleString("en-US") : String(value));
  });
}

function layoutWordCloud(rows, bounds, fontSize) {
  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.top + bounds.bottom) / 2;
  const placed = [];

  rows.forEach((row, index) => {
    const size = fontSize(row.count);
    const rotate = index % 7 === 0 ? -18 : index % 5 === 0 ? 18 : 0;
    const width = row.term.length * size * (rotate ? 0.5 : 0.58);
    const height = size * (rotate ? 1.45 : 1.1);
    let candidate = null;

    for (let step = 0; step < 2600; step += 1) {
      const angle = step * 0.36;
      const radius = 2.7 * Math.sqrt(step);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const box = {
        x0: x - width / 2,
        x1: x + width / 2,
        y0: y - height / 2,
        y1: y + height / 2,
      };

      if (
        box.x0 >= bounds.left &&
        box.x1 <= bounds.right &&
        box.y0 >= bounds.top &&
        box.y1 <= bounds.bottom &&
        placed.every((item) => !wordBoxesOverlap(box, item.box))
      ) {
        candidate = { ...row, x, y, rotate, fontSize: size, box };
        break;
      }
    }

    if (candidate) {
      placed.push(candidate);
    }
  });

  return placed;
}

function wordBoxesOverlap(left, right) {
  const padding = 5;
  return !(
    left.x1 + padding < right.x0 ||
    left.x0 - padding > right.x1 ||
    left.y1 + padding < right.y0 ||
    left.y0 - padding > right.y1
  );
}

function drawXYAxes(svg, xScale, yScale, margin, xLabel, yLabel, options = {}) {
  const isCategorical = Boolean(xScale.bandwidth || xScale.step);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  if (!isCategorical && typeof xScale.ticks === "function") {
    xAxis.ticks(5);
  }
  if (options.xFormat || options.tickLabelLimit) {
    const format = options.xFormat || ((d) => d);
    xAxis.tickFormat((d) => {
      const text = String(format(d));
      return options.tickLabelLimit ? truncate(text, options.tickLabelLimit) : text;
    });
  }

  const yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);
  if (options.yFormat) {
    yAxis.tickFormat(options.yFormat);
  }

  const plotMiddleX = margin.left + (SIZE.width - margin.left - margin.right) / 2;
  const plotMiddleY = margin.top + (SIZE.height - margin.top - margin.bottom) / 2;
  const yLabelX = Math.max(24, margin.left - 46);

  svg.append("g").attr("transform", `translate(0, ${SIZE.height - margin.bottom})`).call(xAxis).call(styleAxisText);
  svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(yAxis).call(styleAxisText);
  svg
    .append("text")
    .attr("x", plotMiddleX)
    .attr("y", SIZE.height - 18)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text(xLabel);
  svg
    .append("text")
    .attr("transform", `translate(${yLabelX}, ${plotMiddleY}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text(yLabel);
}

function drawHeatmapAxes(svg, xScale, yScale, margin, xLabel, yLabel, options = {}) {
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  if (options.xFormat) {
    xAxis.tickFormat(options.xFormat);
  }

  const plotMiddleX = margin.left + (SIZE.width - margin.left - margin.right) / 2;
  const plotMiddleY = margin.top + (SIZE.height - margin.top - margin.bottom) / 2;
  const yLabelX = options.yLabelX ?? 24;

  svg.append("g").attr("transform", `translate(0, ${SIZE.height - margin.bottom})`).call(xAxis).call(styleAxisText);
  svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale).tickSizeOuter(0)).call(styleAxisText);
  svg
    .append("text")
    .attr("x", plotMiddleX)
    .attr("y", SIZE.height - 18)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text(xLabel);
  svg
    .append("text")
    .attr("transform", `translate(${yLabelX}, ${plotMiddleY}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text(yLabel);
}

function styleAxisText(group) {
  group.selectAll("text").attr("fill", COLORS.muted).attr("font-size", 10);
  group.selectAll("path,line").attr("stroke", COLORS.border);
}

function drawColorLegend(svg, domain, colorScale, x, y, onClick) {
  const legend = svg.append("g").attr("transform", `translate(${x}, ${y})`);
  const availableWidth = Math.max(72, SIZE.width - x - 20);
  domain.forEach((item, index) => {
    const row = legend.append("g").attr("transform", `translate(0, ${index * 22})`).style("cursor", onClick ? "pointer" : "default");
    row.append("rect").attr("width", 11).attr("height", 11).attr("rx", 3).attr("fill", colorScale(item));
    row.append("title").text(item);
    row
      .append("text")
      .attr("x", 17)
      .attr("y", 10)
      .attr("fill", COLORS.text)
      .attr("font-size", 10)
      .text(truncate(item, Math.max(12, Math.floor(availableWidth / 7))));
    if (onClick) {
      row.on("click", () => onClick(item));
    }
  });
}

function drawSequentialLegend(svg, color, domain, label, x, y, formatValue = (value) => formatCurrency(value, 0)) {
  const steps = d3.range(6);
  const group = svg.append("g").attr("transform", `translate(${x}, ${y})`);
  const stepWidth = Math.max(16, Math.min(24, Math.floor((SIZE.width - x - 20) / steps.length)));
  group.append("text").attr("x", 0).attr("y", -6).attr("fill", COLORS.muted).attr("font-size", 10).text(label);
  group
    .selectAll("rect")
    .data(steps)
    .join("rect")
    .attr("x", (d) => d * stepWidth)
    .attr("width", stepWidth)
    .attr("height", 10)
    .attr("fill", (d) => color(domain[0] + ((domain[1] - domain[0]) * d) / (steps.length - 1)));
  group.append("text").attr("x", 0).attr("y", 26).attr("fill", COLORS.muted).attr("font-size", 9).text(formatValue(domain[0]));
  group
    .append("text")
    .attr("x", steps.length * stepWidth)
    .attr("y", 26)
    .attr("text-anchor", "end")
    .attr("fill", COLORS.muted)
    .attr("font-size", 9)
    .text(formatValue(domain[1]));
}

function listingTooltip(row) {
  return {
    title: row.neighbourhood_cleansed || row.room_type,
    lines: [
      { label: "Borough", value: row.neighbourhood_group_cleansed ?? "Unknown" },
      { label: "Room type", value: row.room_type ?? "Unknown" },
      { label: "Price", value: formatCurrency(row.price, 0) },
      { label: "Rating", value: formatNumber(row.review_scores_rating, 2) },
      { label: "Reviews", value: formatCount(row.number_of_reviews) },
    ],
  };
}

function sortedRegions(data) {
  return Array.from(new Set(data.map((row) => row.neighbourhood_group_cleansed).filter(Boolean))).sort();
}

function samplePoints(rows, maxItems, keepPredicate = () => false) {
  if (rows.length <= maxItems) {
    return rows;
  }

  const keep = rows.filter(keepPredicate);
  const keepIds = new Set(keep.map((row) => row.__pointId));
  const rest = rows.filter((row) => !keepIds.has(row.__pointId));
  const budget = Math.max(0, maxItems - keep.length);
  const step = rest.length / Math.max(1, budget);
  const sampled = budget ? d3.range(budget).map((index) => rest[Math.floor(index * step)]) : [];
  return [...keep.slice(0, maxItems), ...sampled].slice(0, maxItems);
}

function linearRegression(points) {
  if (points.length < 2) {
    return null;
  }

  const xMean = d3.mean(points, (point) => point.capacity);
  const yMean = d3.mean(points, (point) => point.value);
  const numerator = d3.sum(points, (point) => (point.capacity - xMean) * (point.value - yMean));
  const denominator = d3.sum(points, (point) => (point.capacity - xMean) ** 2);
  if (!denominator) {
    return null;
  }

  const slope = numerator / denominator;
  return { slope, intercept: yMean - slope * xMean };
}

function bindTooltip(selection, getContent) {
  selection
    .on("mouseenter", (event, d) => {
      const content = getContent(d);
      showTooltip(event, content.title, content.lines);
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);
}

function showTooltip(event, title, lines) {
  const tooltip = getTooltipElement();
  tooltip.replaceChildren();

  const titleNode = document.createElement("div");
  titleNode.className = "chart-tooltip__title";
  titleNode.textContent = title;
  tooltip.appendChild(titleNode);

  const bodyNode = document.createElement("div");
  bodyNode.className = "chart-tooltip__body";
  lines.forEach((line) => {
    const lineNode = document.createElement("div");
    lineNode.className = "chart-tooltip__line";
    const labelNode = document.createElement("span");
    labelNode.textContent = line.label;
    const valueNode = document.createElement("strong");
    valueNode.textContent = line.value;
    lineNode.append(labelNode, valueNode);
    bodyNode.appendChild(lineNode);
  });

  tooltip.appendChild(bodyNode);
  tooltip.classList.add("is-visible");
  moveTooltip(event);
}

function moveTooltip(event) {
  const tooltip = document.getElementById(TOOLTIP_ID);
  if (!tooltip) {
    return;
  }

  const gap = 14;
  const width = tooltip.offsetWidth || 220;
  const height = tooltip.offsetHeight || 120;
  const left = Math.min(event.clientX + gap, window.innerWidth - width - gap);
  const top = Math.min(event.clientY + gap, window.innerHeight - height - gap);
  tooltip.style.left = `${Math.max(gap, left)}px`;
  tooltip.style.top = `${Math.max(gap, top)}px`;
}

function hideTooltip() {
  const tooltip = document.getElementById(TOOLTIP_ID);
  if (tooltip) {
    tooltip.classList.remove("is-visible");
  }
}

function getTooltipElement() {
  let tooltip = document.getElementById(TOOLTIP_ID);
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = TOOLTIP_ID;
    tooltip.className = "chart-tooltip";
    document.body.appendChild(tooltip);
  }

  return tooltip;
}

function truncate(value, maxLength) {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

export default memo(InteractiveChart);
