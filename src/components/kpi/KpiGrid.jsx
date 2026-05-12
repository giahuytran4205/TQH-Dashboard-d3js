import KpiCard from "./KpiCard";

export default function KpiGrid({ items }) {
  return (
    <section className="kpi-grid" aria-label="KPI cards">
      {items.map((item) => (
        <KpiCard key={item.id} {...item} />
      ))}
    </section>
  );
}
