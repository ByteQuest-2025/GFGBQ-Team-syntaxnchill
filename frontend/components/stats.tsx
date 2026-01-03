const stats = [
  { label: "Hours saved", value: "40+ hrs", sub: "on weekly debugging" },
  { label: "Flow state", value: "92% faster", sub: "time to deployment" },
  { label: "Collaboration", value: "10x easier", sub: "team code reviews" },
  { label: "Satisfaction", value: "4.9/5", sub: "developer happiness" },
]

export function Stats() {
  return (
    <section className="border-y border-border/40 bg-muted/10">
      <div className="container px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 divide-x md:divide-x border-x border-border/40">
        {stats.map((stat, i) => (
          <div key={i} className="py-8 md:py-12 px-6 flex flex-col items-start space-y-2 border-border/40">
            <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{stat.value}</span>
            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            <span className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold">{stat.sub}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
