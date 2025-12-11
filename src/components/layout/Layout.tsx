import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { CustomCursor } from "@/components/effects/CustomCursor";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
