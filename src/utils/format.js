const countFormatter = new Intl.NumberFormat("en-US");

const currency0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currency2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCount(value) {
  return countFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatCurrency(value, digits = 0) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return digits === 0 ? currency0.format(value) : currency2.format(value);
}

export function formatNumber(value, digits = 1) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
