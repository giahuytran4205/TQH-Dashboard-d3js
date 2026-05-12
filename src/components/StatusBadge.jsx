export default function StatusBadge({ tone, label }) {
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}
