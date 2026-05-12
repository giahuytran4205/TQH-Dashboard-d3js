import * as d3 from "d3";
import { formatCount, formatCurrency, formatNumber } from "./format";

export function aggregateCategoryData(data, categoryField, metricField, options = {}) {
  const mode = options.mode || "mean";

  const groups = new Map();
  data.forEach((row) => {
    const category = normalizeCategory(row[categoryField]);
    if (category === "Unknown") {
      return;
    }

    const current = groups.get(category) ?? {
      count: 0,
      numericCount: 0,
      sum: 0,
    };
    const value = row[metricField];

    current.count += 1;
    if (Number.isFinite(value)) {
      current.numericCount += 1;
      current.sum += value;
    }

    groups.set(category, current);
  });

  return Array.from(groups, ([category, stats]) => ({
      category,
      count: stats.count,
      value:
        mode === "sum"
          ? stats.sum
          : mode === "count"
            ? stats.count
            : stats.numericCount
              ? stats.sum / stats.numericCount
              : null,
    }))
    .sort((left, right) => d3.descending(left.value ?? -Infinity, right.value ?? -Infinity));
}

export function aggregateCountData(data, categoryField) {
  const groups = new Map();
  data.forEach((row) => {
    const category = normalizeCategory(row[categoryField]);
    if (category === "Unknown") {
      return;
    }

    groups.set(category, (groups.get(category) ?? 0) + 1);
  });

  return Array.from(groups, ([category, count]) => ({ category, count }))
    .sort((left, right) => d3.descending(left.count, right.count));
}

export function prepareScatterData(data, xField, yField, colorField) {
  return data
    .map((row, index) => ({
      ...row,
      __index: index,
      x: row[xField],
      y: row[yField],
      colorKey: colorField ? normalizeCategory(row[colorField]) : "All",
    }))
    .filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
}

export function applyChartSelection(data, selection, config) {
  if (!selection.region && !selection.roomType && !selection.brush) {
    return data;
  }

  const regionField = config.selectionFields.region;
  const roomTypeField = config.selectionFields.roomType;
  const scatterXField = config.selectionFields.scatterX;
  const scatterYField = config.selectionFields.scatterY;

  return data.filter((row) => {
    if (selection.region && getRegionKey(row, regionField) !== selection.region) {
      return false;
    }

    if (selection.roomType && getRoomTypeKey(row, roomTypeField) !== selection.roomType) {
      return false;
    }

    if (!selection.brush) {
      return true;
    }

    const x = getScatterX(row, scatterXField);
    const y = getScatterY(row, scatterYField);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return false;
    }

    return (
      x >= selection.brush.xMin &&
      x <= selection.brush.xMax &&
      y >= selection.brush.yMin &&
      y <= selection.brush.yMax
    );
  });
}

export function isPointInsideBrush(row, brush, config) {
  if (!brush) {
    return false;
  }

  const x = getScatterX(row, config.selectionFields.scatterX);
  const y = getScatterY(row, config.selectionFields.scatterY);
  return (
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    x >= brush.xMin &&
    x <= brush.xMax &&
    y >= brush.yMin &&
    y <= brush.yMax
  );
}

export function describeBrush(brush) {
  if (!brush) {
    return "No brush active";
  }

  return `Price ${formatCurrency(brush.yMin, 0)} - ${formatCurrency(brush.yMax, 0)}, reviews ${formatNumber(
    brush.xMin,
    0
  )} - ${formatNumber(brush.xMax, 0)}`;
}

export function buildSelectionSummary(selection, data, config) {
  const parts = [];

  if (selection.region) {
    parts.push(`Region: ${selection.region}`);
  }

  if (selection.roomType) {
    parts.push(`Room type: ${selection.roomType}`);
  }

  if (selection.brush) {
    parts.push(`Brush: ${describeBrush(selection.brush)}`);
  }

  if (!parts.length) {
    return `No chart selection active. ${formatCount(data.length)} rows available in current view.`;
  }

  return `${parts.join(" | ")}. ${formatCount(data.length)} rows in current view.`;
}

export function getPointTooltip(row, config) {
  return [
    { label: "Region", value: normalizeCategory(row[config.selectionFields.region]) },
    { label: "Room type", value: normalizeCategory(row[config.selectionFields.roomType]) },
    { label: "Price", value: formatCurrency(row[config.valueField], 0) },
    {
      label: "Reviews",
      value: formatNumber(row[config.selectionFields.scatterX], 0),
    },
    {
      label: "Availability",
      value: formatNumber(row.availability_365, 0),
    },
  ];
}

export function normalizeCategory(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  return String(value).trim();
}

function getRegionKey(row, field) {
  return row.__regionKey ?? normalizeCategory(row[field]);
}

function getRoomTypeKey(row, field) {
  return row.__roomTypeKey ?? normalizeCategory(row[field]);
}

function getScatterX(row, field) {
  return row.__scatterX ?? row[field];
}

function getScatterY(row, field) {
  return row.__scatterY ?? row[field];
}

export function sameBrushExtent(left, right) {
  if (!left || !right) {
    return left === right;
  }

  return (
    left.xMin === right.xMin &&
    left.xMax === right.xMax &&
    left.yMin === right.yMin &&
    left.yMax === right.yMax
  );
}

export function getBrushFromPixelExtent(pixelExtent, xScale, yScale) {
  const [[x0, y0], [x1, y1]] = pixelExtent;
  const xMin = Math.min(xScale.invert(x0), xScale.invert(x1));
  const xMax = Math.max(xScale.invert(x0), xScale.invert(x1));
  const yMin = Math.min(yScale.invert(y1), yScale.invert(y0));
  const yMax = Math.max(yScale.invert(y1), yScale.invert(y0));

  return { xMin, xMax, yMin, yMax };
}

export function getPixelExtentFromBrush(brush, xScale, yScale) {
  if (!brush) {
    return null;
  }

  return [
    [xScale(brush.xMin), yScale(brush.yMax)],
    [xScale(brush.xMax), yScale(brush.yMin)],
  ];
}
