export default function InsightPanel({ insight, loading, error }) {
  return (
    <section className="panel insight-panel">
      <div className="section-head">
        <div>
          <h2>Insight notes</h2>
          <p>Keep final interpretation here after chart replacement.</p>
        </div>
      </div>

      <p className="insight-panel__summary">
        {loading
          ? "Insight placeholder. Load dataset, then replace this text with the final summary."
          : error
            ? "Dataset load failed. Fix source file or path, then refresh before adding final insight."
            : insight.summary}
      </p>

      <div className="insight-strip" aria-label="Insight highlights">
        {insight.highlights.map((item) => (
          <div className="insight-strip__item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
