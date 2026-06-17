import { useState, useCallback } from 'react';

const useFilter = (filterConfig = {}) => {
  const [filters, setFilters] = useState({});

  const setColumnFilter = useCallback((columnKey, values) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (!values || values.length === 0) {
        delete next[columnKey];
      } else {
        next[columnKey] = values;
      }
      return next;
    });
  }, []);

  const filterData = useCallback((data) => {
    const activeFilters = Object.entries(filters);
    if (activeFilters.length === 0) return data;

    return data.filter((row) =>
      activeFilters.every(([key, selectedValues]) => {
        const config = filterConfig[key];

        // Range-based filter
        if (config?.type === 'range' && config.ranges && config.valueExtractor) {
          const numericVal = config.valueExtractor(row[key]);
          if (isNaN(numericVal)) return false;
          return selectedValues.some((rangeLabel) => {
            const range = config.ranges.find((r) => r.label === rangeLabel);
            if (!range) return false;
            const max = range.max === null || range.max === undefined ? Infinity : range.max;
            return numericVal >= range.min && numericVal <= max;
          });
        }

        // Exact-match filter (default)
        return selectedValues.includes(String(row[key]));
      })
    );
  }, [filters, filterConfig]);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilterCount = Object.keys(filters).length;

  return { filters, setColumnFilter, filterData, resetFilters, activeFilterCount };
};

export default useFilter;
