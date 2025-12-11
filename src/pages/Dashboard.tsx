import { Layout } from "@/components/layout/Layout";
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

const Dashboard = () => {
  const { projects, tasks, activities } = useData();

  const stats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      icon: FolderKanban,
      change: `${projects.filter(p => p.status === "active").length} active`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Tasks",
      value: tasks.length.toString(),
      icon: CheckCircle2,
      change: `${tasks.filter(t => t.status === "done").length} completed`,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "In Progress",
      value: tasks.filter(t => t.status === "progress").length.toString(),
      icon: Clock,
      change: `${tasks.filter(t => t.status === "review").length} in review`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: tasks.filter(t => t.status === "done").length.toString(),
      icon: TrendingUp,
      change: `${Math.round((tasks.filter(t => t.status === "done").length / Math.max(tasks.length, 1)) * 100)}% completion`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Layout>
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>
            <Button asChild variant="hero">
              <Link to="/projects">
                <Plus className="w-5 h-5" />
                New Project
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-primary">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progress Chart */}
            <div className="lg:col-span-2 glass-card p-6">
              <h2 className="font-display text-xl font-semibold mb-6">
                Weekly Progress
              </h2>
              <div className="h-64 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all duration-500 hover:from-primary/80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">
                  Recent Activity
                </h2>
              </div>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.project}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
