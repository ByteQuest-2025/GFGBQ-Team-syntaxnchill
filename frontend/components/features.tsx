import { Headphones, Share2, Zap, Sparkles, Shield, Cpu } from "lucide-react"

const features = [
  {
    title: "Deep Focus Audio",
    description: "Integrated lofi engine with curated playlists designed for algorithmic thinking.",
    icon: Headphones,
  },
  {
    title: "Ghost Collaboration",
    description: "Real-time pair programming without the lag. See cursors like ghosts in the machine.",
    icon: Share2,
  },
  {
    title: "Instant Deploy",
    description: "Push code and relax. Our edge network handles the rest globally in seconds.",
    icon: Zap,
  },
  {
    title: "AI Flow Assistant",
    description: "Context-aware AI that helps you refactor while keeping your cognitive load low.",
    icon: Sparkles,
  },
  {
    title: "Secure Sandboxes",
    description: "Isolated environments for every branch. Test everything without breaking anything.",
    icon: Shield,
  },
  {
    title: "Edge Runtime",
    description: "Compute that lives where your users are. Millisecond latency, infinite scale.",
    icon: Cpu,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container px-4 md:px-8">
        <div className="flex flex-col space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Built for the modern <span className="text-primary">flow.</span>
          </h2>
          <p className="max-w-[42rem] text-muted-foreground text-lg">
            Everything you need to build, test, and ship high-performance applications without the stress.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
