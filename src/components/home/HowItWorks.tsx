import { FolderPlus, ListTodo, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/MotionComponents";

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
        <ScrollReveal delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              How it <span className="gradient-text-blue">works</span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Get started in minutes with our simple three-step process.
            </motion.p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <StaggerContainer staggerDelay={0.15} delay={0.3}>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <motion.div
              className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ originX: 0 }}
            />

            {steps.map((step) => (
              <StaggerItem key={step.step}>
              {/* Step Card */}
              <motion.div
                className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-300 relative"
                whileHover={{ borderColor: "rgba(var(--primary), 0.3)", y: -8 }}
              >
                {/* Step Number */}
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {step.step}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <step.icon className="w-8 h-8 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
