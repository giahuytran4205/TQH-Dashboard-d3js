# React D3 Dashboard

Interactive dashboard scaffold for exploring Airbnb listing data with React, Vite, and D3.js.

## Tech Stack

- React
- Vite
- D3.js v7
- Plain CSS

## Project Structure

```text
d3-dashboard/
|-- data/
|   |-- cleaned_listings.csv
|   |-- cleaned_reviews.csv
|   |-- cleaned_calendar.csv
|   `-- neighbourhoods.geojson
|-- src/
|   |-- components/
|   |-- config/
|   |-- hooks/
|   |-- styles/
|   `-- utils/
|-- index.html
|-- package.json
`-- vite.config.js
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open the app at:

```text
http://127.0.0.1:5173/
```

## Data Model

The dashboard currently loads the primary listing table:

```text
data/cleaned_listings.csv
```

Additional tables are kept in `data/` for future joins:

- `cleaned_reviews.csv`: detail table joined by `listing_id -> listings.id`
- `cleaned_calendar.csv`: detail table joined by `listing_id -> listings.id`
- `neighbourhoods.geojson`: geometry joined by `properties.neighbourhood -> listings.neighbourhood_cleansed`

For performance, large detail tables should be aggregated by `listing_id` before being joined into listing-level charts.

Data paths and join metadata are defined in:

```text
src/config/dashboardConfig.js
```

Vite serves `data/` at `/data/...` during development and copies it to `dist/data/` during production builds.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

- Charts are built with D3.js only.
- Dropdown filters, KPI cards, chart click selections, and scatter brushing are already wired.
- Field names, data paths, and chart settings are centralized in `src/config/dashboardConfig.js`.
