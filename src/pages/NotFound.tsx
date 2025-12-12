import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto px-6 text-center space-y-8 animate-slide-up-in">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl md:text-[120px] font-display font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse-glow">
            404
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Page Not Found
          </p>
        </div>

        {/* Message */}
        <div className="space-y-3 py-4">
          <p className="text-foreground text-base leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground">
            Tried to access: <code className="bg-muted/50 px-2 py-1 rounded text-primary/80 font-mono text-xs">{location.pathname}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <Button
            asChild
            size="lg"
            className="gap-2 group bg-primary hover:bg-primary/90"
          >
            <Link to="/">
              <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 group"
            onClick={() => globalThis.history.back()}
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
            Quick Links
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/projects", label: "Projects" },
              { href: "/profile", label: "Profile" },
            ].map(link => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                size="sm"
                className="text-xs h-8"
              >
                <Link to={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
