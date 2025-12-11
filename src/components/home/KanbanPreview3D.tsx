import { cn } from "@/lib/utils";

const columns = [
  {
    title: "To Do",
    color: "bg-muted-foreground/20",
    tasks: ["Design system", "API integration"],
  },
  {
    title: "In Progress",
    color: "bg-secondary/30",
    tasks: ["User dashboard", "Auth flow"],
  },
  {
    title: "Review",
    color: "bg-primary/30",
    tasks: ["Landing page"],
  },
  {
    title: "Done",
    color: "bg-green-500/30",
    tasks: ["Setup project", "Database schema"],
  },
];

export function KanbanPreview3D() {
  return (
    <div className="perspective-1000 relative">
      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl scale-110" />

      {/* 3D Container */}
      <div className="transform-3d rotate-y-15 animate-float relative">
        <div className="glass-card p-6 glow-amber">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-foreground">
              Project Alpha
            </h3>
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((initial, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold",
                    i === 0 && "bg-primary text-primary-foreground",
                    i === 1 && "bg-secondary text-secondary-foreground",
                    i === 2 && "bg-muted text-muted-foreground"
                  )}
                >
                  {initial}
                </div>
              ))}
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-4 gap-3">
            {columns.map((column) => (
              <div key={column.title} className="space-y-2">
                <div
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded text-center",
                    column.color
                  )}
                >
                  {column.title}
                </div>
                <div className="space-y-2">
                  {column.tasks.map((task, i) => (
                    <div
                      key={i}
                      className="bg-surface/80 p-2 rounded text-xs text-muted-foreground border border-border/30 hover:border-primary/30 transition-colors"
                    >
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
