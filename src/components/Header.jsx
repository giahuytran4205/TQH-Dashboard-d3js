import StatusBadge from "./StatusBadge";

export default function Header({
  eyebrow,
  title,
  description,
  sourceLabel,
  rowCountLabel,
  status,
}) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="dashboard-header__description">{description}</p>
        <p className="dashboard-header__source">
          <span>Example source:</span> {sourceLabel}
          <span className="dashboard-header__divider">|</span>
          <span>{rowCountLabel}</span>
        </p>
      </div>

      <div className="dashboard-header__status">
        <StatusBadge tone={status.tone} label={status.label} />
        <p className="dashboard-header__status-copy">{status.message}</p>
      </div>
    </header>
  );
}
