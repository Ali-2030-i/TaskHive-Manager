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
    <div className="relative h-[500px] flex items-center justify-center perspective">
      {/* Multiple Glow Layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent blur-2xl" />

      {/* 3D Container with Transform */}
      <div className="relative group w-full max-w-2xl">
        <div className="glass-card p-8 glow-amber transition-all duration-700 hover:glow-blue hover:shadow-2xl hover:scale-105 cursor-pointer rounded-3xl border border-primary/20 hover:border-primary/40 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-2xl text-foreground group-hover:text-primary transition-all duration-300 flex items-center gap-2 drop-shadow-lg hover:drop-shadow-2xl">
                <span className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse group-hover:scale-125 transition-transform" />
                <span className="hover:scale-110 transition-transform duration-300">Project Alpha</span>
              </h3>
              <p className="text-xs text-muted-foreground group-hover:text-secondary/80 transition-all duration-300 hover:drop-shadow-lg">
                Team Kanban Board
              </p>
            </div>
            <div className="flex -space-x-4 relative z-10">
              {["AZ", "JD", "MK"].map((initials) => (
                <div
                  key={initials}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-150 hover:-translate-y-3 cursor-pointer hover:ring-2 hover:ring-primary/50 hover:z-20 transform hover:shadow-2xl",
                    initials === "AZ" && "bg-gradient-to-br from-primary to-orange-600 text-primary-foreground hover:shadow-primary/50",
                    initials === "JD" && "bg-gradient-to-br from-secondary to-blue-600 text-secondary-foreground hover:shadow-secondary/50",
                    initials === "MK" && "bg-gradient-to-br from-muted to-gray-600 text-muted-foreground hover:shadow-muted/50"
                  )}
                >
                  {initials}
                </div>
              ))}
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-4 gap-5">
            {columns.map((column) => (
              <div key={column.title} className="space-y-3 group/column">
                <div
                  className={cn(
                    "text-xs font-bold px-4 py-3 rounded-2xl text-center transition-all duration-300 border border-transparent group-hover/column:border-primary/30 group-hover/column:scale-110 group-hover/column:text-primary cursor-pointer hover:drop-shadow-xl backdrop-blur-sm",
                    column.color
                  )}
                >
                  {column.title}
                </div>
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task}
                      className="bg-gradient-to-br from-surface/90 to-surface/70 p-4 rounded-2xl text-xs text-foreground border border-border/40 hover:border-primary/60 hover:bg-surface hover:text-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-grab active:cursor-grabbing hover:-translate-y-2 hover:drop-shadow-lg group/card"
                    >
                      <span className="group-hover/card:text-primary transition-colors duration-300">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-xs text-muted-foreground">5 tasks in progress</span>
            <span className="text-xs font-medium text-primary">View all →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
