import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  className?: string;
  animate?: boolean;
  duration?: number;
}

export function CheckmarkIcon({ className, animate = true, duration = 600 }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("w-6 h-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {animate && (
        <style>{`
          @keyframes drawCheckmark {
            0% { stroke-dashoffset: 48; }
            100% { stroke-dashoffset: 0; }
          }
          .animated-checkmark {
            stroke-dasharray: 48;
            animation: drawCheckmark ${duration}ms ease-out forwards;
          }
        `}</style>
      )}
      <polyline
        points="20 6 9 17 4 12"
        className={animate ? "animated-checkmark" : ""}
      />
    </svg>
  );
}

export function LoadingSpinner({ className, duration = 1000 }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("w-6 h-6 animate-spin", className)}
      style={{ animationDuration: `${duration}ms` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

export function PulseIcon({ className }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("w-6 h-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <style>{`
        @keyframes pulse-beat {
          0%, 100% { r: 1; }
          50% { r: 4; }
        }
        .pulse-circle {
          animation: pulse-beat 1s ease-in-out infinite;
        }
      `}</style>
      <circle cx="12" cy="12" r="1" className="pulse-circle" fill="currentColor" />
      <circle cx="12" cy="12" r="5" opacity="0.3" />
      <circle cx="12" cy="12" r="9" opacity="0.1" />
    </svg>
  );
}

export function SuccessCheckAnimation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-16 h-16", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <style>{`
        @keyframes drawCircle {
          0% { stroke-dashoffset: 314; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawCheckmark2 {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .animated-circle {
          stroke-dasharray: 314;
          animation: drawCircle 0.6s ease-out forwards;
        }
        .animated-check {
          stroke-dasharray: 100;
          animation: drawCheckmark2 0.4s ease-out 0.3s forwards;
          stroke-dashoffset: 100;
        }
      `}</style>
      <circle cx="50" cy="50" r="50" className="animated-circle" />
      <polyline points="30,50 45,65 70,35" className="animated-check" />
    </svg>
  );
}

export function UploadIcon({ className, animate = true }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("w-6 h-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {animate && (
        <style>{`
          @keyframes float-up {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .floating {
            animation: float-up 2s ease-in-out infinite;
          }
        `}</style>
      )}
      <g className={animate ? "floating" : ""}>
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      </g>
    </svg>
  );
}

export function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 60"
      className={cn("w-full h-auto", className)}
      preserveAspectRatio="none"
    >
      <style>{`
        @keyframes wave {
          0% { d: path('M0,30 Q50,10 100,30 T200,30'); }
          50% { d: path('M0,30 Q50,50 100,30 T200,30'); }
          100% { d: path('M0,30 Q50,10 100,30 T200,30'); }
        }
        .wave-path {
          animation: wave 2s ease-in-out infinite;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
      `}</style>
      <path
        className="wave-path"
        d="M0,30 Q50,10 100,30 T200,30"
      />
    </svg>
  );
}
