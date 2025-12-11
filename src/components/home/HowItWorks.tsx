import { FolderPlus, ListTodo, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: FolderPlus,
    step: "01",
    title: "Create Project",
    description:
      "Start by creating a new project and inviting your team members to collaborate.",
  },
  {
    icon: ListTodo,
    step: "02",
    title: "Add Tasks",
    description:
      "Break down your work into manageable tasks and organize them on your Kanban board.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Track Progress",
    description:
      "Monitor your team's progress in real-time and celebrate when goals are achieved.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How it <span className="gradient-text-blue">works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes with our simple three-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" />

          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Step Card */}
              <div className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
