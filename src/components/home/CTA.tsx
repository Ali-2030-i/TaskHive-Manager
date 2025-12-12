import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px]"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[128px]"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Gradient Background Card */}
          <motion.div
            className="glass-card p-12 md:p-16 relative overflow-hidden"
            whileHover={{ borderColor: "rgba(var(--primary), 0.4)" }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative">
              {/* Main Heading */}
              <motion.h2
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Ready to Transform Your Workflow?
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of teams already using TaskHive to streamline their projects and deliver faster.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {/* Primary CTA with Pulse */}
                <motion.div
                  animate={{ boxShadow: ["0 0 0 0 rgba(var(--primary), 0.4)", "0 0 0 20px rgba(var(--primary), 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild variant="hero" size="xl" className="gap-2 group">
                      <Link to="/dashboard">
                        Get Started Free
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Secondary CTA */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="heroOutline" size="xl">
                    <a href="#features">Learn More</a>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Trusted by 10K+ Teams</span>
                </motion.div>
                <div className="hidden sm:block w-px h-4 bg-border" />
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>99.9% Uptime SLA</span>
                </motion.div>
                <div className="hidden sm:block w-px h-4 bg-border" />
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Enterprise Security</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
