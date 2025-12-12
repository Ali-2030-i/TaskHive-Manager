import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toastIcons = {
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  error: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const { icon: Icon, color, bg } = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={`${bg} border border-${color.split('-')[1]}-500/20 rounded-lg p-4 flex items-start gap-3 animate-slide-up-in shadow-lg pointer-events-auto backdrop-blur-sm`}
          >
            <Icon className={`${color} w-5 h-5 shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
