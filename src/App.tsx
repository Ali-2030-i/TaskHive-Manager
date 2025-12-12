import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useToast } from "@/hooks/use-enhanced-toast";
import { ToastContainer } from "@/components/ToastContainer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectBoard from "./pages/ProjectBoard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<ProjectBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AnalyticsProvider>
          <TooltipProvider>
            <DataProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </DataProvider>
          </TooltipProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
