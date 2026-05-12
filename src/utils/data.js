import * as d3 from "d3";
import { formatCount, formatCurrency } from "./format";

export function createRowParser(config) {
  return (row, index) => {
    const parsed = { ...row };

    config.numericFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(row, field)) {
        parsed[field] = parseNumericValue(row[field]);
      }
    });

    config.booleanFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(row, field)) {
        parsed[field] = parseBooleanValue(row[field]);
      }
    });

    if (config.dateField && Object.prototype.hasOwnProperty.call(row, config.dateField)) {
      parsed[config.dateField] = parseDateValue(row[config.dateField]);
    }

    addInternalSelectionFields(parsed, config, index);

    return parsed;
  };
}

export function parseNumericValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseBooleanValue(value) {
  if (value === true || value === false) {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  return value;
}

export function parseDateValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const text = String(value).trim();
  const parsers = [
    d3.timeParse("%Y-%m-%d"),
    d3.timeParse("%d/%m/%Y"),
    d3.timeParse("%m/%d/%Y"),
  ];

  for (const parser of parsers) {
    const parsed = parser(text);
    if (parsed) {
      return parsed;
    }
  }

  const fallback = new Date(text);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function addInternalSelectionFields(row, config, index) {
  const selectionFields = config.selectionFields ?? {};
  const internals = {
    __index: index,
  };

  if (selectionFields.region && Object.prototype.hasOwnProperty.call(row, selectionFields.region)) {
    internals.__regionKey = normalizeKey(row[selectionFields.region]);
  }

  if (selectionFields.roomType && Object.prototype.hasOwnProperty.call(row, selectionFields.roomType)) {
    internals.__roomTypeKey = normalizeKey(row[selectionFields.roomType]);
  }

  if (selectionFields.scatterX && Object.prototype.hasOwnProperty.call(row, selectionFields.scatterX)) {
    internals.__scatterX = row[selectionFields.scatterX];
  }

  if (selectionFields.scatterY && Object.prototype.hasOwnProperty.call(row, selectionFields.scatterY)) {
    internals.__scatterY = row[selectionFields.scatterY];
  }

  Object.defineProperties(
    row,
    Object.fromEntries(
      Object.entries(internals).map(([key, value]) => [
        key,
        {
          value,
          enumerable: false,
          configurable: false,
          writable: false,
        },
      ])
    )
  );
}

function normalizeKey(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  return String(value).trim();
}

export function resolveField(candidates, columns) {
  return candidates.find((candidate) => columns.includes(candidate)) || "";
}

export function resolveFilterConfigs(filterConfigs, columns) {
  return filterConfigs.map((filter) => {
    const field = resolveField(filter.candidates, columns);
    return {
      ...filter,
      field,
      isAvailable: Boolean(field),
    };
  });
}

export function buildFilterOptionsMap(data, resolvedFilters) {
  return resolvedFilters.reduce((accumulator, filter) => {
    if (!filter.field) {
      accumulator[filter.id] = [];
      return accumulator;
    }

    const values = Array.from(
      new Set(
        data
          .map((row) => row[filter.field])
          .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
          .map((value) => String(value).trim())
      )
    ).sort((left, right) => left.localeCompare(right, undefined, { sensitivity: "base" }));

    accumulator[filter.id] = values;
    return accumulator;
  }, {});
}

export function applyFilters(data, resolvedFilters, selectedFilters) {
  return data.filter((row) => {
    return resolvedFilters.every((filter) => {
      const selectedValue = selectedFilters[filter.id] ?? "all";
      if (selectedValue === "all" || !filter.field) {
        return true;
      }

      const rowValue = row[filter.field];
      if (rowValue === null || rowValue === undefined || rowValue === "") {
        return false;
      }

      return String(rowValue).trim() === selectedValue;
    });
  });
}

export function computeKpis(data, kpiConfig) {
  const metricsById = {};

  kpiConfig.forEach((kpi) => {
    if (kpi.type === "count") {
      metricsById[kpi.id] = {
        label: kpi.label,
        value: formatCount(data.length),
        meta: "Rows after active filters",
      };
      return;
    }

    const numericValues = data
      .map((row) => row[kpi.field])
      .filter((value) => Number.isFinite(value));

    if (!numericValues.length) {
      metricsById[kpi.id] = {
        label: kpi.label,
        value: "N/A",
        meta: `Uses ${kpi.field} field`,
      };
      return;
    }

    const sum = d3.sum(numericValues);
    const average = d3.mean(numericValues);

    metricsById[kpi.id] = {
      label: kpi.label,
      value: kpi.type === "sum" ? formatCurrency(sum, 0) : formatCurrency(average, 2),
      meta: kpi.type === "sum" ? `Total ${kpi.field}` : `Average ${kpi.field}`,
    };
  });

  return metricsById;
}

export function buildInsight(data, config) {
  if (!data.length) {
    return {
      summary:
        "No rows match current filters. Loosen dropdowns or adjust field names in config before swapping in real charts.",
      highlights: [
        { label: "Top region", value: "N/A" },
        { label: "Top room type", value: "N/A" },
        { label: "Average price", value: "N/A" },
      ],
    };
  }

  const columns = Object.keys(data[0] ?? {});
  const regionCandidates =
    config.filters.find((filter) => filter.id === "region")?.candidates ?? [
      "neighbourhood_group_cleansed",
    ];
  const roomTypeCandidates =
    config.filters.find((filter) => filter.id === "roomType")?.candidates ?? ["room_type"];
  const regionField = resolveField(regionCandidates, columns);
  const roomTypeField = resolveField(roomTypeCandidates, columns);
  const topRegion = regionField ? getTopValue(data, regionField) : null;
  const topRoomType = roomTypeField ? getTopValue(data, roomTypeField) : null;
  const prices = data
    .map((row) => row[config.valueField])
    .filter((value) => Number.isFinite(value));

  return {
    summary: `Filtered rows: ${formatCount(
      data.length
    )}. Click region or room type marks, or brush scatter, to narrow the view.`,
    highlights: [
      {
        label: "Top region",
        value: topRegion ? `${topRegion.name} (${formatCount(topRegion.count)})` : "N/A",
      },
      {
        label: "Top room type",
        value: topRoomType ? `${topRoomType.name} (${formatCount(topRoomType.count)})` : "N/A",
      },
      {
        label: "Average price",
        value: prices.length ? formatCurrency(d3.mean(prices), 2) : "N/A",
      },
    ],
  };
}

function getTopValue(data, field) {
  const values = d3.rollups(
    data,
    (rows) => rows.length,
    (row) => {
      const value = row[field];
      return value === null || value === undefined || String(value).trim() === ""
        ? "Unknown"
        : String(value).trim();
    }
  );

  if (!values.length) {
    return null;
  }

  values.sort((left, right) => d3.descending(left[1], right[1]));

  return {
    name: values[0][0],
    count: values[0][1],
  };
}
