import { Layout } from "@/components/layout/Layout";
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus,
  Activity,
  ArrowUpRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScrollReveal,
  HoverScale,
} from "@/components/MotionComponents";

const Dashboard = () => {
  const { projects, tasks, activities, isLoading } = useData();
  useTheme();

  const stats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      icon: FolderKanban,
      change: `${projects.filter(p => p.status === "active").length} active`,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      label: "Total Tasks",
      value: tasks.length.toString(),
      icon: CheckCircle2,
      change: `${tasks.filter(t => t.status === "done").length} completed`,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
      gradient: "from-secondary/20 to-secondary/5"
    },
    {
      label: "In Progress",
      value: tasks.filter(t => t.status === "progress").length.toString(),
      icon: Clock,
      change: `${tasks.filter(t => t.status === "review").length} in review`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      gradient: "from-amber-500/20 to-amber-500/5"
    },
    {
      label: "Completed",
      value: tasks.filter(t => t.status === "done").length.toString(),
      icon: TrendingUp,
      change: `${Math.round((tasks.filter(t => t.status === "done").length / Math.max(tasks.length, 1)) * 100)}% completion`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      gradient: "from-green-500/20 to-green-500/5"
    },
  ];

  return (
    <Layout>
      <div className="pt-28 pb-16 min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-6">
          {/* Header */}
          <FadeIn direction="down" duration={0.6}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Welcome back! Here's what's happening with your projects.
                </p>
              </div>
              <HoverScale scale={1.08}>
                <Button asChild variant="hero" className="gap-2 group">
                  <Link to="/projects">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Project
                  </Link>
                </Button>
              </HoverScale>
            </div>
          </FadeIn>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={`skeleton-card-${idx}`} className="bg-card border border-border/40 rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-muted rounded-xl"></div>
                    <div className="w-5 h-5 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StaggerContainer staggerDelay={0.08} delay={0.2}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                  <StaggerItem key={stat.label}>
                    <HoverScale scale={1.05}>
                      <motion.div
                        className={cn(
                          "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                          "bg-gradient-to-br", stat.gradient,
                          stat.borderColor,
                          "hover:border-primary/40"
                        )}
                        whileHover={{ y: -4 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <motion.div
                              className={cn("p-3 rounded-xl transition-all duration-300", stat.bgColor)}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </motion.div>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <ArrowUpRight className={cn("w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300", stat.color)} />
                            </motion.div>
                          </div>
                          <div className="font-display text-4xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2 font-medium">
                            {stat.label}
                          </div>
                          <div className="text-xs text-primary/80 font-semibold">
                            {stat.change}
                          </div>
                        </div>
                      </motion.div>
                    </HoverScale>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progress Chart */}
            <ScrollReveal delay={0.3}>
              <motion.div 
                className="lg:col-span-2 bg-gradient-to-br from-background/40 to-background/20 border border-border/40 rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg group"
                whileHover={{ borderColor: "rgba(var(--primary), 0.3)" }}
              >
                <div className="flex items-center gap-2 mb-8">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-semibold group-hover:text-primary transition-colors">
                    Weekly Progress
                  </h2>
                </div>
                <div className="h-64 flex items-end gap-3">
                  {[40, 65, 45, 80, 55, 90, 75].map((height, idx) => (
                    <motion.div
                      key={`progress-bar-${idx}`}
                      className="flex-1 flex flex-col items-center gap-3 group/bar"
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-full bg-gradient-to-t from-primary via-primary to-primary/60 rounded-t-xl transition-all duration-500 group-hover/bar:from-primary/80 group-hover/bar:to-primary/40 group-hover/bar:shadow-lg cursor-pointer hover:scale-y-110 origin-bottom"
                        style={{ height: `${height}%` }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      />
                      <span className="text-xs text-muted-foreground font-medium group-hover/bar:text-primary transition-colors">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Recent Activity */}
            <ScrollReveal delay={0.4}>
              <motion.div 
                className="bg-gradient-to-br from-background/40 to-background/20 border border-border/40 rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg group"
                whileHover={{ borderColor: "rgba(var(--primary), 0.3)" }}
              >
                <div className="flex items-center gap-2 mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-semibold group-hover:text-primary transition-colors">
                    Recent Activity
                  </h2>
                </div>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity, idx) => (
                    <motion.div 
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-all duration-200 group/activity cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover/activity:text-primary transition-colors truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground truncate group-hover/activity:text-muted-foreground/70 transition-colors">
                          {activity.project}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap font-medium group-hover/activity:text-primary/60 transition-colors">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No recent activity yet
                    </p>
                  )}
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
