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
├── public/data/dataset.csv
├── src/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── styles/
│   └── utils/
├── index.html
├── package.json
└── vite.config.js
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

## Data

The dashboard loads CSV data from:

```text
public/data/dataset.csv
```

To use another dataset, replace that file or update `dataPath` in:

```text
src/config/dashboardConfig.js
```

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
- Field names and chart settings are centralized in `src/config/dashboardConfig.js`.
