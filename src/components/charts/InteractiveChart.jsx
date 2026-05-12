import { memo, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  aggregateCategoryData,
  aggregateCountData,
  getBrushFromPixelExtent,
  getPixelExtentFromBrush,
  getPointTooltip,
} from "../../utils/chartData";
import { formatCount, formatCurrency, formatNumber } from "../../utils/format";

const SIZE = {
  width: 720,
  height: 380,
};

const MAX_CATEGORY_MARKS = 14;
const MAX_CATEGORICAL_TICKS = 7;
const MAX_SCATTER_POINTS = 1000;
const TOOLTIP_ID = "d3-chart-tooltip";

const COLORS = {
  primary: "#1d4ed8",
  primarySoft: "#dbeafe",
  accent: "#0f766e",
  accentSoft: "rgba(15, 118, 110, 0.12)",
  text: "#0f172a",
  muted: "#64748b",
  border: "#cbd5e1",
};

function InteractiveChart({
  chart,
  data,
  selection,
  loading,
  error,
  onRegionToggle,
  onRoomTypeToggle,
  onBrushChange,
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

      if (!data.length) {
        drawEmptyState(svg, chart.title, "No rows match current filters.");
        return;
      }

      switch (chart.kind) {
        case "line":
          drawRegionLineChart(svg, chart, data, selection, onRegionToggle);
          break;
        case "bar":
          drawRoomTypeBarChart(svg, chart, data, selection, onRoomTypeToggle);
          break;
        case "scatter":
          drawScatterChart(svg, chart, data, selection, onBrushChange);
          break;
        case "donut":
          drawRegionDonutChart(svg, chart, data, selection, onRegionToggle);
          break;
        default:
          drawEmptyState(svg, chart.title, "Unsupported chart type.");
          break;
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      hideTooltip();
    };
  }, [chart, data, error, loading, onBrushChange, onRegionToggle, onRoomTypeToggle, selection]);

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

  const grid = svg.append("g").attr("class", "chart-gridlines");
  d3.range(5).forEach((index) => {
    const y = 72 + index * 50;
    grid
      .append("line")
      .attr("x1", 64)
      .attr("x2", SIZE.width - 34)
      .attr("y1", y)
      .attr("y2", y)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-dasharray", "3 5");
  });
}

function drawRegionLineChart(svg, chart, data, selection, onRegionToggle) {
  const series = aggregateCategoryData(data, chart.groupField, chart.metricField, {
    mode: "mean",
  }).slice(0, MAX_CATEGORY_MARKS);
  if (!series.length) {
    drawEmptyState(svg, chart.title, "No grouped values found.");
    return;
  }

  drawFrame(svg);

  const margin = { top: 28, right: 34, bottom: 86, left: 68 };
  const plotBottom = SIZE.height - margin.bottom;

  const x = d3
    .scalePoint()
    .domain(series.map((d) => d.category))
    .range([margin.left, SIZE.width - margin.right])
    .padding(0.45);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d.value) || 0])
    .nice()
    .range([plotBottom, margin.top]);

  const line = d3
    .line()
    .x((d) => x(d.category))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX);

  drawAxes(svg, x, y, margin, "region", "avg price");

  svg
    .append("path")
    .datum(series)
    .attr("class", "chart-line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", COLORS.primary)
    .attr("stroke-width", 3);

  const points = svg.append("g").attr("class", "chart-points");

  const marks = points
    .selectAll("circle")
    .data(series)
    .join("circle")
    .attr("cx", (d) => x(d.category))
    .attr("cy", (d) => y(d.value))
    .attr("r", (d) => (selection.region === d.category ? 8 : 5))
    .attr("fill", (d) => (selection.region === d.category ? COLORS.primary : COLORS.primarySoft))
    .attr("stroke", COLORS.primary)
    .attr("stroke-width", 1.5)
    .style("cursor", "pointer")
    .style("opacity", (d) => (!selection.region || selection.region === d.category ? 1 : 0.35))
    .on("click", (event, d) => {
      d3.select(event.currentTarget).raise().attr("stroke-width", 3);
      queueChartAction(() => onRegionToggle?.(d.category));
    });

  bindTooltip(marks, (d) => ({
    title: d.category,
    lines: [
      { label: "Average price", value: formatCurrency(d.value, 0) },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));
}

function drawRoomTypeBarChart(svg, chart, data, selection, onRoomTypeToggle) {
  const series = aggregateCategoryData(data, chart.groupField, chart.metricField, {
    mode: "mean",
  }).slice(0, MAX_CATEGORY_MARKS);
  if (!series.length) {
    drawEmptyState(svg, chart.title, "No grouped values found.");
    return;
  }

  drawFrame(svg);

  const margin = { top: 28, right: 28, bottom: 88, left: 68 };
  const plotBottom = SIZE.height - margin.bottom;

  const x = d3
    .scaleBand()
    .domain(series.map((d) => d.category))
    .range([margin.left, SIZE.width - margin.right])
    .padding(0.28);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d.value) || 0])
    .nice()
    .range([plotBottom, margin.top]);

  drawAxes(svg, x, y, margin, "room type", "avg price");

  const bars = svg.append("g").attr("class", "chart-bars");

  const marks = bars
    .selectAll("rect")
    .data(series)
    .join("rect")
    .attr("x", (d) => x(d.category))
    .attr("y", (d) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => plotBottom - y(d.value))
    .attr("rx", 4)
    .attr("fill", (d) => (selection.roomType === d.category ? COLORS.primary : COLORS.primarySoft))
    .attr("stroke", COLORS.primary)
    .attr("stroke-width", 1)
    .style("cursor", "pointer")
    .style("opacity", (d) => (!selection.roomType || selection.roomType === d.category ? 1 : 0.35))
    .on("click", (event, d) => {
      d3.select(event.currentTarget).attr("stroke-width", 3);
      queueChartAction(() => onRoomTypeToggle?.(d.category));
    });

  bindTooltip(marks, (d) => ({
    title: d.category,
    lines: [
      { label: "Average price", value: formatCurrency(d.value, 0) },
      { label: "Listings", value: formatCount(d.count) },
    ],
  }));
}

function drawScatterChart(svg, chart, data, selection, onBrushChange) {
  const points = data
    .map((row, index) => ({
      __pointId: row.__index ?? index,
      x: row.__scatterX ?? row[chart.xField],
      y: row.__scatterY ?? row[chart.yField],
      [chart.xField]: row.__scatterX ?? row[chart.xField],
      [chart.yField]: row.__scatterY ?? row[chart.yField],
      price: row.price,
      availability_365: row.availability_365,
      neighbourhood_group_cleansed: row.neighbourhood_group_cleansed,
      room_type: row.room_type,
      colorKey: chart.colorField ? String(row[chart.colorField] || "Unknown") : "All",
    }))
    .filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
  if (!points.length) {
    drawEmptyState(svg, chart.title, "No numeric x/y values found.");
    return;
  }

  drawFrame(svg);

  const margin = { top: 28, right: 34, bottom: 76, left: 68 };
  const plotBottom = SIZE.height - margin.bottom;

  const x = d3
    .scaleLinear()
    .domain(d3.extent(points, (d) => d.x))
    .nice()
    .range([margin.left, SIZE.width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(points, (d) => d.y))
    .nice()
    .range([plotBottom, margin.top]);

  const colorDomain = Array.from(
    new Set(points.map((d) => d.colorKey))
  );
  const color = d3.scaleOrdinal().domain(colorDomain).range(d3.schemeTableau10);

  drawAxes(svg, x, y, margin, chart.xField, chart.yField);

  const selectedIds = new Set(
    selection.brush
      ? points
          .filter((d) => isPointInBrushExtent(d, selection.brush))
          .map((d) => d.__pointId)
      : []
  );
  const displayPoints = pickDisplayPoints(points, selectedIds, MAX_SCATTER_POINTS);

  let brushLayer;
  const brush = d3
    .drag()
    .on("start", (event) => {
      const target = event.sourceEvent?.target;
      if (target && target.closest && target.closest(".scatter-point")) {
        return;
      }

      hideTooltip();
      const pointer = d3.pointer(event, svg.node());
      const start = clampPoint(pointer, margin);
      brushLayer.selectAll("*").remove();
      brushLayer
        .append("rect")
        .attr("class", "scatter-brush__selection")
        .attr("x", start[0])
        .attr("y", start[1])
        .attr("width", 0)
        .attr("height", 0)
        .attr("rx", 4)
        .attr("fill", COLORS.accentSoft)
        .attr("stroke", COLORS.accent)
        .attr("stroke-dasharray", "4 4")
        .style("pointer-events", "none");

      brushLayer.node().__start = start;
    })
    .on("drag", (event) => {
      const start = brushLayer.node().__start;
      if (!start) {
        return;
      }

      const pointer = clampPoint(d3.pointer(event, svg.node()), margin);
      const x0 = Math.min(start[0], pointer[0]);
      const y0 = Math.min(start[1], pointer[1]);
      const x1 = Math.max(start[0], pointer[0]);
      const y1 = Math.max(start[1], pointer[1]);

      brushLayer
        .select("rect.scatter-brush__selection")
        .attr("x", x0)
        .attr("y", y0)
        .attr("width", x1 - x0)
        .attr("height", y1 - y0);
    })
    .on("end", () => {
      const start = brushLayer.node().__start;
      brushLayer.node().__start = null;
      const rect = brushLayer.select("rect.scatter-brush__selection");
      if (!start || rect.empty()) {
        onBrushChange?.(null);
        brushLayer.selectAll("*").remove();
        return;
      }

      const width = Number(rect.attr("width"));
      const height = Number(rect.attr("height"));
      if (width < 8 || height < 8) {
        onBrushChange?.(null);
        brushLayer.selectAll("*").remove();
        return;
      }

      const x0 = Number(rect.attr("x"));
      const y0 = Number(rect.attr("y"));
      const x1 = x0 + width;
      const y1 = y0 + height;
      const nextBrush = getBrushFromPixelExtent(
        [
          [x0, y0],
          [x1, y1],
        ],
        x,
        y
      );
      nextBrush.label = `reviews ${formatNumber(nextBrush.xMin, 0)}-${formatNumber(
        nextBrush.xMax,
        0
      )}, price ${formatCurrency(nextBrush.yMin, 0)}-${formatCurrency(nextBrush.yMax, 0)}`;
      onBrushChange?.(nextBrush);
    });

  svg
    .append("rect")
    .attr("class", "scatter-drag-surface")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", SIZE.width - margin.left - margin.right)
    .attr("height", plotBottom - margin.top)
    .attr("fill", "transparent")
    .style("cursor", "crosshair")
    .call(brush);

  const pointsLayer = svg.append("g").attr("class", "scatter-points");
  const marks = pointsLayer
    .selectAll("circle")
    .data(displayPoints, (d) => d.__pointId)
    .join("circle")
    .attr("class", "scatter-point")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", (d) => (selectedIds.has(d.__pointId) ? 5.2 : 3.3))
    .attr("fill", (d) => color(d.colorKey))
    .attr("stroke", (d) => (selectedIds.has(d.__pointId) ? COLORS.primary : "white"))
    .attr("stroke-width", 1.1)
    .style("opacity", (d) => {
      if (!selection.brush) {
        return 0.64;
      }
      return selectedIds.has(d.__pointId) ? 0.95 : 0.1;
    });

  bindTooltip(marks, (d) => ({
    title: `${formatCount(d.x)} reviews`,
    lines: getPointTooltip(d, {
      valueField: "price",
      selectionFields: {
        region: "neighbourhood_group_cleansed",
        roomType: "room_type",
        scatterX: chart.xField,
        scatterY: chart.yField,
      },
    }),
  }));

  brushLayer = svg.append("g").attr("class", "scatter-brush");
  if (selection.brush) {
    const pixelExtent = getPixelExtentFromBrush(selection.brush, x, y);
    if (pixelExtent) {
      const [[x0, y0], [x1, y1]] = pixelExtent;
      brushLayer
        .append("rect")
        .attr("class", "scatter-brush__selection")
        .attr("x", x0)
        .attr("y", y0)
        .attr("width", x1 - x0)
        .attr("height", y1 - y0)
        .attr("rx", 4)
        .attr("fill", COLORS.accentSoft)
        .attr("stroke", COLORS.accent)
        .attr("stroke-dasharray", "4 4")
        .style("pointer-events", "none");
    }
  }
}

function drawRegionDonutChart(svg, chart, data, selection, onRegionToggle) {
  const rawSeries = aggregateCountData(data, chart.groupField);
  const series = limitDonutSeries(rawSeries, 6);
  if (!series.length) {
    drawEmptyState(svg, chart.title, "No grouped values found.");
    return;
  }

  drawFrame(svg);

  const width = SIZE.width;
  const height = SIZE.height;
  const centerX = 230;
  const centerY = height / 2;
  const radius = 108;
  const arc = d3.arc().innerRadius(58).outerRadius(radius);
  const pie = d3.pie().value((d) => d.count).sort(null);
  const total = d3.sum(series, (d) => d.count) || 1;

  const color = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.category))
    .range([COLORS.primary, "#60a5fa", COLORS.accent, "#94a3b8", "#f59e0b", "#8b5cf6"]);

  const group = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

  const slices = group
    .selectAll("path")
    .data(pie(series))
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.category))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 2)
    .style("cursor", (d) => (d.data.isOther ? "default" : "pointer"))
    .style("opacity", (d) => {
      if (!selection.region) {
        return 1;
      }
      return selection.region === d.data.category ? 1 : 0.28;
    })
    .attr("transform", (d) => (selection.region === d.data.category ? "scale(1.04)" : "scale(1)"))
    .on("click", (event, d) => {
      if (!d.data.isOther) {
        d3.select(event.currentTarget).raise().attr("stroke-width", 3);
        queueChartAction(() => onRegionToggle?.(d.data.category));
      }
    });

  bindTooltip(slices, (d) => ({
    title: d.data.category,
    lines: [
      { label: "Listings", value: formatCount(d.data.count) },
      { label: "Share", value: `${formatNumber((d.data.count / total) * 100, 1)}%` },
    ],
  }));

  svg
    .append("text")
    .attr("x", centerX)
    .attr("y", centerY - 4)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.text)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .text(formatCount(total));

  svg
    .append("text")
    .attr("x", centerX)
    .attr("y", centerY + 20)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 12)
    .text("rows");

  const legendX = 420;
  const legendY = centerY - (series.length * 24) / 2;
  const legend = svg.append("g").attr("transform", `translate(${legendX}, ${legendY})`);
  legend
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("transform", (_, index) => `translate(0, ${index * 24})`)
    .each(function (d) {
      const item = d3.select(this);
      item
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("fill", color(d.category));

      item
        .append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("fill", COLORS.text)
        .attr("font-size", 11)
        .text(truncateLabel(`${d.category} (${formatCount(d.count)})`, 30));
    });
}

function drawAxes(svg, xScale, yScale, margin, xLabel, yLabel) {
  const xDomain = typeof xScale.domain === "function" ? xScale.domain() : [];
  const isCategorical = Boolean(xScale.bandwidth || xScale.step);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  if (isCategorical && xDomain.length > MAX_CATEGORICAL_TICKS) {
    xAxis.tickValues(sampleValues(xDomain, MAX_CATEGORICAL_TICKS));
  } else if (!isCategorical && typeof xScale.ticks === "function") {
    xAxis.ticks(5);
  }

  const yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);
  const xTickRotation =
    isCategorical && xDomain.some((item) => String(item).length > 11) ? -24 : 0;

  svg
    .append("g")
    .attr("transform", `translate(0, ${SIZE.height - margin.bottom})`)
    .call(xAxis)
    .call((g) => {
      g.selectAll("text")
        .attr("fill", COLORS.muted)
        .attr("font-size", 11)
        .attr("dy", xTickRotation ? "0.45em" : "0.8em")
        .attr("transform", xTickRotation ? `rotate(${xTickRotation})` : null)
        .style("text-anchor", xTickRotation ? "end" : "middle")
        .text((d) => (isCategorical ? truncateLabel(d, 18) : formatNumber(d, 0)));
      g.selectAll("path,line").attr("stroke", COLORS.border);
    });

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .call((g) => {
      g.selectAll("text")
        .attr("fill", COLORS.muted)
        .attr("font-size", 11)
        .text((d) => formatNumber(d, 0));
      g.selectAll("path,line").attr("stroke", COLORS.border);
    });

  svg
    .append("text")
    .attr("x", SIZE.width - margin.right)
    .attr("y", SIZE.height - 24)
    .attr("text-anchor", "end")
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text(truncateLabel(xLabel, 24));

  svg
    .append("text")
    .attr("transform", `translate(22, ${margin.top + 8}) rotate(-90)`)
    .attr("fill", COLORS.muted)
    .attr("font-size", 10)
    .text(truncateLabel(yLabel, 24));
}

function bindTooltip(selection, getContent) {
  selection
    .on("mouseenter", (event, d) => {
      const content = getContent(d);
      showTooltip(event, content.title, content.lines);
    })
    .on("mousemove", (event) => moveTooltip(event))
    .on("mouseleave", hideTooltip);
}

function queueChartAction(callback) {
  hideTooltip();
  window.requestAnimationFrame(() => callback?.());
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

function clampPoint(point, margin) {
  const x = Math.max(margin.left, Math.min(SIZE.width - margin.right, point[0]));
  const y = Math.max(margin.top, Math.min(SIZE.height - margin.bottom, point[1]));
  return [x, y];
}

function isPointInBrushExtent(point, brush) {
  return (
    point.x >= brush.xMin &&
    point.x <= brush.xMax &&
    point.y >= brush.yMin &&
    point.y <= brush.yMax
  );
}

function pickDisplayPoints(points, selectedIds, maxPoints) {
  if (points.length <= maxPoints) {
    return points;
  }

  if (!selectedIds?.size) {
    return sampleValues(points, maxPoints);
  }

  const selected = points.filter((point) => selectedIds.has(point.__pointId));
  const selectedBudget = Math.min(selected.length, Math.floor(maxPoints * 0.45));
  const sampledSelected = sampleValues(selected, selectedBudget);
  const sampledSelectedIds = new Set(sampledSelected.map((point) => point.__pointId));
  const remaining = points.filter(
    (point) => !selectedIds.has(point.__pointId) && !sampledSelectedIds.has(point.__pointId)
  );

  return [...sampledSelected, ...sampleValues(remaining, maxPoints - sampledSelected.length)];
}

function sampleValues(values, maxItems) {
  if (values.length <= maxItems) {
    return values;
  }

  if (maxItems <= 0) {
    return [];
  }

  const step = values.length / maxItems;
  return d3.range(maxItems).map((index) => values[Math.floor(index * step)]);
}

function limitDonutSeries(series, maxItems) {
  if (series.length <= maxItems) {
    return series;
  }

  const head = series.slice(0, maxItems - 1);
  const otherCount = d3.sum(series.slice(maxItems - 1), (d) => d.count);
  return [...head, { category: "Other", count: otherCount, isOther: true }];
}

function truncateLabel(value, maxLength) {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

export default memo(InteractiveChart);
