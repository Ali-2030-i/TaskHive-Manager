import { useMemo, useState, useCallback } from "react";

export interface FilterOption<T> {
  key: keyof T;
  value: any;
  operator?: "equals" | "includes" | "gt" | "lt" | "between";
}

export function useAdvancedSearch<T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[] = []
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOption<T>[]>([]);
  const [sortBy, setSortBy] = useState<{ key: keyof T; order: "asc" | "desc" } | null>(null);

  const results = useMemo(() => {
    let filtered = [...items];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = String(item[field]).toLowerCase();
          return value.includes(query);
        })
      );
    }

    // Apply filters
    filters.forEach(filter => {
      filtered = filtered.filter(item => {
        const itemValue = item[filter.key];
        const filterValue = filter.value;

        switch (filter.operator || "equals") {
          case "equals":
            return itemValue === filterValue;
          case "includes":
            return String(itemValue).includes(String(filterValue));
          case "gt":
            return itemValue > filterValue;
          case "lt":
            return itemValue < filterValue;
          case "between":
            return (
              Array.isArray(filterValue) &&
              itemValue >= filterValue[0] &&
              itemValue <= filterValue[1]
            );
          default:
            return true;
        }
      });
    });

    // Sort
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy.key];
        const bVal = b[sortBy.key];

        if (aVal < bVal) return sortBy.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortBy.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, searchQuery, filters, sortBy, searchFields]);

  const addFilter = useCallback((filter: FilterOption<T>) => {
    setFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setSearchQuery("");
    setSortBy(null);
  }, []);

  const sort = useCallback((key: keyof T, order: "asc" | "desc" = "asc") => {
    setSortBy({ key, order });
  }, []);

  return {
    results,
    searchQuery,
    setSearchQuery,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    sortBy,
    sort,
    resultCount: results.length,
  };
}
