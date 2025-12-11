import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { KanbanPreview3D } from "./KanbanPreview3D";

export function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Team Collaboration Made Easy
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              Organize your team with{" "}
              <span className="gradient-text-amber">TaskHive</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-lg animate-slide-up"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              The modern task management platform that helps teams collaborate,
              track progress, and deliver projects on time with beautiful Kanban
              boards.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-4 animate-slide-up"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <a href="#features">Learn More</a>
              </Button>
            </div>

            {/* Stats */}
            <div
              className="flex gap-8 pt-4 animate-fade-in"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              {[
                { value: "10K+", label: "Active Teams" },
                { value: "500K+", label: "Tasks Completed" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Kanban Preview */}
          <div
            className="relative animate-fade-in"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <KanbanPreview3D />
          </div>
        </div>
      </div>
    </section>
  );
}
