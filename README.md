# D3 Dashboard

Task-driven React + D3 dashboard for the NYC Airbnb midterm project.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Data

Keep the raw files in `data/`:

- `cleaned_listings.csv`
- `cleaned_reviews.csv`
- `cleaned_calendar.csv`
- `neighbourhoods.geojson`

The app also uses derived metrics from `src/data/derivedMetrics.json`.

## Scripts

- `npm run build-derived-data` - regenerate derived metrics
- `npm run build` - production build
- `npm run preview` - preview the build

## Config

Main field names, joins, filters, and chart definitions are centralized in `src/config/dashboardConfig.js`.
