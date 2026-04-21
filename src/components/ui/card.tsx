import { ReactNode } from "react";

export function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="panel kpi-card">
      <div className="panel-inner">
        <div className="badge">{title}</div>
        <div className="kpi-value">{value}</div>
        {subtitle ? <div className="kpi-subtitle">{subtitle}</div> : null}
      </div>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-inner">
        <h2 className="section-title">{title}</h2>
        {subtitle ? <div className="section-subtitle">{subtitle}</div> : null}
        {children}
      </div>
    </section>
  );
}
