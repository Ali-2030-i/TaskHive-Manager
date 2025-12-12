export function SkeletonCard() {
  return (
    <div className="p-6 bg-card border border-border/50 rounded-xl space-y-4 animate-pulse">
      <div className="h-6 bg-muted rounded-lg w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 pt-4">
        <div className="h-10 bg-muted rounded-lg flex-1"></div>
        <div className="h-10 bg-muted rounded-lg w-10"></div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-card border border-border/50 rounded-lg">
          <div className="h-10 w-10 bg-muted rounded-lg shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
          <div className="h-10 w-20 bg-muted rounded-lg shrink-0"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4 p-6 bg-card border border-border/50 rounded-xl">
          <div className="h-6 bg-muted rounded w-2/3"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="p-6 bg-card border border-border/50 rounded-xl space-y-6 animate-pulse">
      <div className="h-6 bg-muted rounded w-1/4"></div>
      <div className="flex gap-4 items-end h-64">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 space-y-2">
            <div className="bg-muted rounded-t w-full" style={{ height: `${Math.random() * 200 + 50}px` }}></div>
            <div className="h-3 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-6 items-center">
        <div className="w-24 h-24 bg-muted rounded-full shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 bg-card border border-border/50 rounded-lg space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
