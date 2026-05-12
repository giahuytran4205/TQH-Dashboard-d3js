export default function Tooltip({ tooltip }) {
  if (!tooltip?.visible) {
    return null;
  }

  return (
    <div
      className="chart-tooltip"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
      }}
    >
      <div className="chart-tooltip__title">{tooltip.title}</div>
      <div className="chart-tooltip__body">
        {tooltip.lines.map((line) => (
          <div key={line.label} className="chart-tooltip__line">
            <span>{line.label}</span>
            <strong>{line.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
