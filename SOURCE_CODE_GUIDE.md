# Source Code Guide

This project is a React + D3 dashboard for the NYC Airbnb visualization assignment. React owns the page structure, state, filters, KPI cards, and chart containers. D3 owns data-driven drawing inside each SVG chart.

## Project Structure

```text
d3-dashboard/
+-- data/                         # Local raw data files, ignored by Git except data-link.txt
+-- public/                       # Static public assets if needed
+-- scripts/
|   +-- download-data.js           # Optional helper for restoring local data
|   +-- build-derived-data.js      # Builds src/data/derivedMetrics.json
+-- src/
|   +-- App.jsx                    # Main dashboard state and layout
|   +-- main.jsx                   # React entry point
|   +-- config/dashboardConfig.js  # Data paths, fields, filters, KPIs, chart list
|   +-- data/derivedMetrics.json   # Precomputed metrics for calendar/review-heavy tasks
|   +-- hooks/useCsvData.js        # Loads and parses the primary CSV
|   +-- utils/                     # Data transforms, formatting, selection helpers
|   +-- components/                # Header, filters, KPIs, chart cards, interactions
|   +-- styles/global.css          # Global layout and visual styling
+-- vite.config.js                 # Vite config and /data folder serving plugin
+-- README.md                      # Short run guide
```

## Data Flow

1. `src/App.jsx` imports `DASHBOARD_CONFIG`.
2. `useCsvData(DASHBOARD_CONFIG)` loads the primary table from `DASHBOARD_CONFIG.dataPath`.
3. `src/utils/data.js` parses numeric, boolean, and date fields listed in the config.
4. Dropdown filters are resolved from real CSV columns, then applied to the loaded rows.
5. Chart interactions update `selection` in `App.jsx`.
6. `applyChartSelection()` narrows the filtered rows by selected region, room type, or brush.
7. KPI cards, insight text, and data-backed charts receive the selected rows.
8. Calendar/review-heavy charts use precomputed `src/data/derivedMetrics.json`.

## Data Files

Keep raw files in the root `data/` folder:

```text
data/
+-- cleaned_listings.csv
+-- cleaned_reviews.csv
+-- cleaned_calendar.csv
+-- neighbourhoods.geojson
```

The Vite plugin in `vite.config.js` serves these files at `/data/...` during development and copies them into `dist/data/` during production builds.

The raw data files are ignored by Git through `.gitignore`. `data/data-link.txt` is kept as a lightweight pointer instead of committing large datasets.

## Main Configuration

Most dashboard-level changes should start in `src/config/dashboardConfig.js`.

Important fields:

- `dataPath`: primary CSV path used by the browser.
- `dataSources`: documents the listing, review, calendar, and GeoJSON inputs.
- `numericFields`: fields converted to numbers when the CSV loads.
- `booleanFields`: fields converted to booleans.
- `selectionFields`: columns used for cross-filtering.
- `filters`: dropdown definitions and candidate column names.
- `kpis`: KPI card definitions.
- `chartCards`: the 10 task cards, chart titles, chart kind, and notes.

To add a chart card, add an object to `chartCards`, then implement its `kind` in `InteractiveChart.jsx`.

## React Components

- `App.jsx`: central state owner. It loads data, applies filters, tracks chart selections, computes KPI/insight data, and passes props into the dashboard sections.
- `components/Header.jsx`: title, description, source label, and load status.
- `components/filters/FilterPanel.jsx`: renders configured filters.
- `components/kpi/KpiGrid.jsx`: renders KPI cards.
- `components/interactions/SelectionStrip.jsx`: shows active chart selections and clear buttons.
- `components/charts/ChartGrid.jsx`: renders all chart cards.
- `components/charts/ChartCard.jsx`: wraps each chart with title, description, body, and note.
- `components/charts/InteractiveChart.jsx`: all D3 SVG drawing logic.

## D3 Chart Layer

`InteractiveChart.jsx` is the main D3 file. It receives a `chart.kind` and dispatches to a drawing function:

- `drawChoropleth()` for Task 1
- `drawOccupancyLines()` for Task 2
- `drawStackedRoomTypeBars()` for Task 3
- `drawRatingBoxplot()` for Task 4
- `drawPriceDistributionBoxplot()` for Task 5
- `drawGoodDealScatter()` for Task 6
- `drawPricePerPersonGroupedBars()` for Task 7
- `drawPolicyHeatmap()` for Task 8
- `drawHostPerformanceBars()` for Task 9
- `drawExperienceWordCloud()` for Task 10

Common helpers in the same file handle axes, legends, tooltips, boxplot stats, word layout, and sampling.

## Interaction Model

Global chart selection lives in `App.jsx`:

```js
{
  region: null,
  roomType: null,
  brush: null
}
```

Charts call callbacks passed from `App.jsx`:

- `onRegionToggle(region)` selects or clears a borough.
- `onRoomTypeToggle(roomType)` selects or clears a room type.
- `onBrushChange(brush)` updates scatter brush selection.

Current examples:

- Task 1 supports map zoom/pan and region click.
- Task 2 supports hover highlight on one borough line.
- Task 4 and Task 5 support boxplot hover summaries and region selection.

## Derived Metrics

Some charts should not load the full calendar or review tables in the browser. Instead, `scripts/build-derived-data.js` reads local raw files and writes compact aggregates to:

```text
src/data/derivedMetrics.json
```

Run this after changing raw data or aggregation logic:

```bash
npm run build-derived-data
```

The output is imported directly in `App.jsx`.

## Styling

All global styling is in `src/styles/global.css`.

Key layout classes:

- `.app-shell`: dashboard page width and spacing.
- `.panel`: shared panel styling.
- `.kpi-grid`: KPI card layout.
- `.chart-grid`: responsive chart grid.
- `.chart-card`: chart card shell.
- `.chart-card__body`: SVG container.
- `.interactive-chart`: SVG sizing.
- `.chart-tooltip`: shared D3 tooltip.

Keep chart-specific geometry in `InteractiveChart.jsx`; keep page/card styling in CSS.

## Common Changes

### Change a Field Name

Update `src/config/dashboardConfig.js`:

```js
numericFields: ["price", "review_scores_rating"],
selectionFields: {
  region: "neighbourhood_group_cleansed",
  roomType: "room_type",
}
```

Also update chart drawing functions if they directly reference the old field.

### Add a Filter

Add a filter config:

```js
{
  id: "hostType",
  label: "Host type",
  candidates: ["host_type"],
  helpText: "Dataset field used for host grouping.",
}
```

`FilterPanel` and `applyFilters()` will handle it automatically if the column exists.

### Add a New Chart

1. Add a new item in `DASHBOARD_CONFIG.chartCards`.
2. Add a `case` for its `kind` in `InteractiveChart.jsx`.
3. Implement a `drawYourChart(svg, data, selection, callbacks)` function.
4. Reuse existing helpers for axes, legends, and tooltips.

### Regenerate Review or Calendar Metrics

```bash
npm run build-derived-data
```

Commit the updated `src/data/derivedMetrics.json` if the dashboard should use the new aggregates.

## Run and Verify

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

Build production assets:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Before committing code, run:

```bash
npm run build
```

Check that the dashboard loads data, filters update KPIs, chart interactions work, and no chart shows a missing-data fallback unexpectedly.
