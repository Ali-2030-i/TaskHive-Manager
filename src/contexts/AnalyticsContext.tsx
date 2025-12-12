import { createContext, useContext, useCallback } from "react";

export interface AnalyticsEvent {
  id: string;
  event: string;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AnalyticsStats {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsByHour: Record<number, number>;
  lastEvent?: AnalyticsEvent;
}

interface AnalyticsContextType {
  trackEvent: (event: string, category: string, metadata?: Record<string, any>) => void;
  getStats: () => AnalyticsStats;
  clearAnalytics: () => void;
  getEventHistory: () => AnalyticsEvent[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);
const events: AnalyticsEvent[] = [];

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const trackEvent = useCallback((
    event: string,
    category: string,
    metadata?: Record<string, any>
  ) => {
    const newEvent: AnalyticsEvent = {
      id: `${Date.now()}-${Math.random()}`,
      event,
      category,
      timestamp: new Date(),
      metadata,
    };
    events.push(newEvent);

    // Keep only last 1000 events
    if (events.length > 1000) {
      events.shift();
    }

    console.debug("[Analytics]", { event, category, metadata });
  }, []);

  const getStats = useCallback((): AnalyticsStats => {
    const stats: AnalyticsStats = {
      totalEvents: events.length,
      eventsByCategory: {},
      eventsByHour: {},
    };

    events.forEach(e => {
      // Category stats
      stats.eventsByCategory[e.category] = (stats.eventsByCategory[e.category] || 0) + 1;

      // Hour stats
      const hour = e.timestamp.getHours();
      stats.eventsByHour[hour] = (stats.eventsByHour[hour] || 0) + 1;
    });

    if (events.length > 0) {
      stats.lastEvent = events[events.length - 1];
    }

    return stats;
  }, []);

  const getEventHistory = useCallback(() => [...events], []);

  const clearAnalytics = useCallback(() => {
    events.length = 0;
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, getStats, getEventHistory, clearAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}
