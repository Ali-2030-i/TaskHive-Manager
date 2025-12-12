import { ReactNode, Component, ErrorInfo } from "react";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-md w-full text-center space-y-6 animate-slide-up-in">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-destructive animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Oops! Something went wrong</h1>
              <p className="text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details className="text-left p-4 bg-muted/50 rounded-lg border border-border">
                <summary className="cursor-pointer font-semibold text-sm">Error Details</summary>
                <pre className="mt-3 text-xs overflow-auto max-h-48 text-destructive/70">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
