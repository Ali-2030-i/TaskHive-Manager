import { useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdvancedSearch } from "@/hooks/use-advanced-search";
import { cn } from "@/lib/utils";

interface SearchFilterProps<T extends Record<string, any>> {
  items: T[];
  searchFields: (keyof T)[];
  onResultsChange: (results: T[]) => void;
  filterOptions?: {
    label: string;
    key: keyof T;
    values: any[];
  }[];
  sortOptions?: {
    label: string;
    key: keyof T;
  }[];
}

export function SearchFilter<T extends Record<string, any>>({
  items,
  searchFields,
  onResultsChange,
  filterOptions = [],
  sortOptions = [],
}: SearchFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    results,
    searchQuery,
    setSearchQuery,
    addFilter,
    removeFilter,
    filters,
    clearFilters,
    sort,
  } = useAdvancedSearch(items, searchFields);

  const handleAddFilter = (key: keyof T, value: any) => {
    addFilter({ key, value, operator: "equals" });
  };

  // Notify parent of results change
  if (JSON.stringify(results) !== JSON.stringify(items)) {
    onResultsChange(results);
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Active Filters & Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {filters.map((filter, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg animate-slide-up-in"
          >
            <span className="text-sm font-medium text-primary">
              {String(filter.key)}: {String(filter.value)}
            </span>
            <button
              onClick={() => removeFilter(idx)}
              className="text-primary/70 hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {(filters.length > 0 || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}

        {/* Filter & Sort Dropdown */}
        <div className="relative ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            More
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
          </Button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-10 animate-slide-up-in">
              <div className="p-4 space-y-4">
                {/* Filter Section */}
                {filterOptions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Filters</p>
                    <div className="space-y-2">
                      {filterOptions.map(option => (
                        <div key={String(option.key)} className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            {option.label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {option.values.map(value => (
                              <button
                                key={value}
                                onClick={() => handleAddFilter(option.key, value)}
                                className="px-2 py-1 text-xs bg-muted rounded hover:bg-muted/80 transition-colors"
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort Section */}
                {sortOptions.length > 0 && (
                  <>
                    {filterOptions.length > 0 && <div className="h-px bg-border" />}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Sort by</p>
                      <div className="flex gap-2">
                        {sortOptions.map(option => (
                          <button
                            key={String(option.key)}
                            onClick={() => sort(option.key, "asc")}
                            className="px-3 py-1 text-xs bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 transition-colors"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-muted-foreground">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
