import { Layers, Zap, Users, Shield, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Layers,
    title: "Kanban Boards",
    description:
      "Organize tasks with beautiful drag-and-drop Kanban boards. Visualize your workflow at a glance.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "See changes instantly as your team collaborates. No refresh needed.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Assign tasks, mention teammates, and work together seamlessly.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and protected. Enterprise-grade security.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track team performance with detailed insights and progress reports.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description:
      "Monitor time spent on tasks and optimize your team's productivity.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text-amber">succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help your team work smarter, not
            harder.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
