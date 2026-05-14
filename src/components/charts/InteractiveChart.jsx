import { memo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { formatCount, formatCurrency, formatNumber } from "../../utils/format";

const SIZE = { width: 760, height: 430 };
const TOOLTIP_ID = "d3-chart-tooltip";
const MAX_POINTS = 1000;

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
  .domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
  .range(["#2563eb", "#0f766e", "#f97316", "#8b5cf6"]);

const REGION_COLORS = d3.scaleOrdinal(d3.schemeTableau10);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

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
          drawChoropleth(svg, data, geoData, selection, onRegionToggle);
          break;
        case "occupancyLines":
          drawOccupancyLines(svg, metrics, selection, onRegionToggle);
          break;
        case "capacityHeatmap":
          drawCapacityHeatmap(svg, data, selection, onRegionToggle);
          break;
        case "qualityScatter":
          drawQualityScatter(svg, data, selection, onRoomTypeToggle);
          break;
        case "priceBoxplot":
          drawPriceBoxplot(svg, data, selection, onRegionToggle);
          break;
        case "goodDealScatter":
          drawGoodDealScatter(svg, data, selection, onRoomTypeToggle);
          break;
        case "costTrend":
          drawCostTrend(svg, data, selection, onRoomTypeToggle);
          break;
        case "policyHeatmap":
          drawPolicyHeatmap(svg, metrics);
          break;
        case "hostPerformance":
          drawHostPerformance(svg, metrics);
          break;
        case "sentimentBars":
          drawSentimentBars(svg, metrics);
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

function drawChoropleth(svg, data, geoData, selection, onRegionToggle) {
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
  const projection = d3.geoMercator().fitExtent(
    [
      [24, 22],
      [SIZE.width - 24, SIZE.height - 58],
    ],
    geoData
  );
  const path = d3.geoPath(projection);
  const domain = d3.extent(values);
  const color = d3.scaleSequential(d3.interpolateBlues).domain(domain);

  const features = svg.append("g").attr("class", "map-features");
  const paths = features
    .selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("d", path)
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

  drawSequentialLegend(svg, color, domain, "Avg price", SIZE.width - 230, SIZE.height - 38);
}

function drawOccupancyLines(svg, metrics, selection, onRegionToggle) {
  const rows = metrics?.monthlyOccupancyByRegion ?? [];
  if (!rows.length) {
    drawEmptyState(svg, "No occupancy data", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 30, right: 132, bottom: 54, left: 62 };
  const x = d3.scalePoint().domain(MONTHS).range([margin.left, SIZE.width - margin.right]).padding(0.35);
  const y = d3
    .scaleLinear()
    .domain([0, Math.ceil((d3.max(rows, (row) => row.occupancyRate) ?? 0) / 10) * 10])
    .nice()
    .range([SIZE.height - margin.bottom, margin.top]);

  drawXYAxes(svg, x, y, margin, "Month", "Occupancy %", { yFormat: (d) => `${d}%` });

  const byRegion = d3.group(rows, (row) => row.region);
  REGION_COLORS.domain(Array.from(byRegion.keys()));
  const line = d3
    .line()
    .x((row) => x(row.month))
    .y((row) => y(row.occupancyRate))
    .curve(d3.curveMonotoneX);

  const lineGroups = svg
    .append("g")
    .selectAll("g")
    .data(Array.from(byRegion, ([region, values]) => ({ region, values })))
    .join("g")
    .style("opacity", (d) => (!selection.region || selection.region === d.region ? 1 : 0.18));

  lineGroups
    .append("path")
    .attr("fill", "none")
    .attr("stroke", (d) => REGION_COLORS(d.region))
    .attr("stroke-width", (d) => (selection.region === d.region ? 3.8 : 2.4))
    .attr("d", (d) => line(d.values))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRegionToggle?.(d.region));

  const points = lineGroups
    .selectAll("circle")
    .data((d) => d.values.map((row) => ({ ...row, region: d.region })))
    .join("circle")
    .attr("cx", (d) => x(d.month))
    .attr("cy", (d) => y(d.occupancyRate))
    .attr("r", 3.8)
    .attr("fill", (d) => REGION_COLORS(d.region))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRegionToggle?.(d.region));

  bindTooltip(points, (d) => ({
    title: `${d.region} - Month ${d.month}`,
    lines: [
      { label: "Occupancy", value: `${formatNumber(d.occupancyRate, 1)}%` },
      { label: "Booked days", value: formatCount(d.bookedDays) },
      { label: "Total days", value: formatCount(d.totalDays) },
    ],
  }));

  drawColorLegend(svg, Array.from(byRegion.keys()), REGION_COLORS, SIZE.width - 118, 42, onRegionToggle);
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
      row.number_of_reviews >= 5 &&
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
  const margin = { top: 28, right: 34, bottom: 58, left: 62 };
  const xMax = d3.quantile(rows.map((row) => row.price).sort(d3.ascending), 0.98) ?? d3.max(rows, (row) => row.price);
  const x = d3.scaleLinear().domain([0, xMax]).nice().range([margin.left, SIZE.width - margin.right]);
  const y = d3.scaleLinear().domain([4, 5]).range([SIZE.height - margin.bottom, margin.top]);
  const radius = d3.scaleSqrt().domain([5, d3.max(rows, (row) => row.number_of_reviews) ?? 6]).range([2.5, 9]);
  const displayRows = samplePoints(rows, MAX_POINTS, (row) => row.isGoodDeal || selection.roomType === row.room_type).filter((row) => row.price <= xMax);

  drawXYAxes(svg, x, y, margin, "Price", "Rating", { xFormat: (d) => `$${formatNumber(d, 0)}`, yFormat: (d) => formatNumber(d, 1) });
  svg.append("line").attr("x1", x(medianPrice)).attr("x2", x(medianPrice)).attr("y1", margin.top).attr("y2", SIZE.height - margin.bottom).attr("stroke", COLORS.slate).attr("stroke-dasharray", "4 4");
  svg.append("line").attr("x1", margin.left).attr("x2", SIZE.width - margin.right).attr("y1", y(4.8)).attr("y2", y(4.8)).attr("stroke", COLORS.slate).attr("stroke-dasharray", "4 4");
  svg.append("text").attr("x", x(medianPrice) + 6).attr("y", margin.top + 12).attr("fill", COLORS.muted).attr("font-size", 10).text("median price");
  svg.append("text").attr("x", margin.left + 6).attr("y", y(4.8) - 6).attr("fill", COLORS.muted).attr("font-size", 10).text("rating 4.8");

  const points = svg
    .append("g")
    .selectAll("circle")
    .data(displayRows, (d) => d.__pointId)
    .join("circle")
    .attr("cx", (d) => x(d.price))
    .attr("cy", (d) => y(d.review_scores_rating))
    .attr("r", (d) => radius(d.number_of_reviews))
    .attr("fill", (d) => (d.isGoodDeal ? COLORS.green : "#94a3b8"))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8)
    .style("opacity", (d) => (d.isGoodDeal ? 0.88 : selection.roomType && selection.roomType !== d.room_type ? 0.1 : 0.36))
    .style("cursor", "pointer")
    .on("click", (_, d) => onRoomTypeToggle?.(d.room_type));

  bindTooltip(points, (d) => ({
    title: d.isGoodDeal ? "Good deal" : d.room_type,
    lines: listingTooltip(d).lines,
  }));
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
  const rows = metrics?.monthlyOccupancyByMinNights ?? [];
  if (!rows.length) {
    drawEmptyState(svg, "No policy data", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const groups = ["Short <=3", "Medium 4-7", "Long >7"];
  const margin = { top: 34, right: 38, bottom: 62, left: 128 };
  const x = d3.scaleBand().domain(MONTHS).range([margin.left, SIZE.width - margin.right]).padding(0.06);
  const y = d3.scaleBand().domain(groups).range([margin.top, SIZE.height - margin.bottom]).padding(0.08);
  const extent = d3.extent(rows, (row) => row.occupancyRate);
  const color = d3.scaleSequential(d3.interpolateYlGnBu).domain(extent);
  drawHeatmapAxes(svg, x, y, margin, "Month", "Minimum nights");

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
    title: `${d.minNightsGroup} - Month ${d.month}`,
    lines: [
      { label: "Occupancy", value: `${formatNumber(d.occupancyRate, 1)}%` },
      { label: "Calendar days", value: formatCount(d.totalDays) },
    ],
  }));
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

function drawSentimentBars(svg, metrics) {
  const rows = (metrics?.sentimentTerms ?? []).slice().sort((a, b) => a.strength - b.strength);
  if (!rows.length) {
    drawEmptyState(svg, "No review language metrics", "Run npm run build-derived-data.");
    return;
  }

  drawFrame(svg);
  const margin = { top: 26, right: 46, bottom: 48, left: 150 };
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
    .attr("fill", (d) => (d.strength < 0 ? COLORS.orange : COLORS.teal));

  bindTooltip(bars, (d) => ({
    title: d.term,
    lines: [
      { label: "Group", value: d.group },
      { label: "Strength", value: formatNumber(d.strength, 2) },
      { label: "High / Low count", value: `${formatCount(d.highCount)} / ${formatCount(d.lowCount)}` },
    ],
  }));

  svg.append("text").attr("x", margin.left).attr("y", SIZE.height - 18).attr("fill", COLORS.orange).attr("font-size", 11).text("Low-rating terms");
  svg.append("text").attr("x", SIZE.width - margin.right).attr("y", SIZE.height - 18).attr("text-anchor", "end").attr("fill", COLORS.teal).attr("font-size", 11).text("High-rating terms");
}

function drawXYAxes(svg, xScale, yScale, margin, xLabel, yLabel, options = {}) {
  const isCategorical = Boolean(xScale.bandwidth || xScale.step);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  if (!isCategorical && typeof xScale.ticks === "function") {
    xAxis.ticks(5);
  }
  if (options.xFormat) {
    xAxis.tickFormat(options.xFormat);
  }

  const yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);
  if (options.yFormat) {
    yAxis.tickFormat(options.yFormat);
  }

  svg.append("g").attr("transform", `translate(0, ${SIZE.height - margin.bottom})`).call(xAxis).call(styleAxisText);
  svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(yAxis).call(styleAxisText);
  svg.append("text").attr("x", SIZE.width - margin.right).attr("y", SIZE.height - 18).attr("text-anchor", "end").attr("fill", COLORS.muted).attr("font-size", 10).text(xLabel);
  svg.append("text").attr("transform", `translate(20, ${margin.top + 8}) rotate(-90)`).attr("fill", COLORS.muted).attr("font-size", 10).text(yLabel);
}

function drawHeatmapAxes(svg, xScale, yScale, margin, xLabel, yLabel) {
  svg.append("g").attr("transform", `translate(0, ${SIZE.height - margin.bottom})`).call(d3.axisBottom(xScale).tickSizeOuter(0)).call(styleAxisText);
  svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale).tickSizeOuter(0)).call(styleAxisText);
  svg.append("text").attr("x", SIZE.width - margin.right).attr("y", SIZE.height - 18).attr("text-anchor", "end").attr("fill", COLORS.muted).attr("font-size", 10).text(xLabel);
  svg.append("text").attr("transform", `translate(20, ${margin.top + 8}) rotate(-90)`).attr("fill", COLORS.muted).attr("font-size", 10).text(yLabel);
}

function styleAxisText(group) {
  group.selectAll("text").attr("fill", COLORS.muted).attr("font-size", 10);
  group.selectAll("path,line").attr("stroke", COLORS.border);
}

function drawColorLegend(svg, domain, colorScale, x, y, onClick) {
  const legend = svg.append("g").attr("transform", `translate(${x}, ${y})`);
  domain.forEach((item, index) => {
    const row = legend.append("g").attr("transform", `translate(0, ${index * 22})`).style("cursor", onClick ? "pointer" : "default");
    row.append("rect").attr("width", 11).attr("height", 11).attr("rx", 3).attr("fill", colorScale(item));
    row.append("text").attr("x", 17).attr("y", 10).attr("fill", COLORS.text).attr("font-size", 10).text(truncate(item, 17));
    if (onClick) {
      row.on("click", () => onClick(item));
    }
  });
}

function drawSequentialLegend(svg, color, domain, label, x, y) {
  const steps = d3.range(6);
  const group = svg.append("g").attr("transform", `translate(${x}, ${y})`);
  group.append("text").attr("x", 0).attr("y", -6).attr("fill", COLORS.muted).attr("font-size", 10).text(label);
  group
    .selectAll("rect")
    .data(steps)
    .join("rect")
    .attr("x", (d) => d * 28)
    .attr("width", 28)
    .attr("height", 10)
    .attr("fill", (d) => color(domain[0] + ((domain[1] - domain[0]) * d) / (steps.length - 1)));
  group.append("text").attr("x", 0).attr("y", 26).attr("fill", COLORS.muted).attr("font-size", 9).text(formatCurrency(domain[0], 0));
  group.append("text").attr("x", steps.length * 28).attr("y", 26).attr("text-anchor", "end").attr("fill", COLORS.muted).attr("font-size", 9).text(formatCurrency(domain[1], 0));
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
