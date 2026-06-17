import tableStyles from "../Table.module.css";
import { useState, useRef, useEffect, useMemo } from 'react';
import { Filter as FilterIcon, ChevronRight } from 'lucide-react';
import localStyles from "./Filter.module.css";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const Filter = ({ columns, data, filters, onFilterChange, filterConfig = {}, localeText = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
        setExpandedColumn(null);
        setFilterSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique values for each exact-type column from the data
  const columnValues = useMemo(() => {
    const values = {};
    columns.forEach((col) => {
      const config = filterConfig[col.key];
      // Skip range-type columns — they use config.ranges instead
      if (config?.type === 'range') return;
      const uniqueVals = [...new Set(data.map((row) => String(row[col.key])))].filter(Boolean).sort();
      values[col.key] = uniqueVals;
    });
    return values;
  }, [columns, data, filterConfig]);

  const activeFilterCount = Object.keys(filters).length;

  const toggleValue = (columnKey, value) => {
    const currentValues = filters[columnKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange(columnKey, newValues);
  };

  const clearColumnFilter = (columnKey, e) => {
    e.stopPropagation();
    onFilterChange(columnKey, []);
  };

  const clearAllFilters = () => {
    Object.keys(filters).forEach((key) => onFilterChange(key, []));
  };

  // Get display options for a column (range labels or filtered exact values)
  const getDisplayOptions = (col) => {
    const config = filterConfig[col.key];
    if (config?.type === 'range' && config.ranges) {
      const labels = config.ranges.map((r) => r.label);
      if (!filterSearch.trim()) return labels;
      const lower = filterSearch.toLowerCase();
      return labels.filter((l) => l.toLowerCase().includes(lower));
    }
    const values = columnValues[col.key] || [];
    if (!filterSearch.trim()) return values;
    const lower = filterSearch.toLowerCase();
    return values.filter((v) => v.toLowerCase().includes(lower));
  };

  // Check if search is enabled for a column
  const isSearchable = (colKey) => {
    const config = filterConfig[colKey];
    if (!config || config.searchable === undefined) return true; // default true
    return config.searchable;
  };

  return (
    <div style={{ position: 'relative' }} ref={filterRef}>
      <button className={styles["ct-btn"]} onClick={() => setIsOpen(!isOpen)} title={localeText.filter || "Filter"}>
        <FilterIcon size={16} />
        <span className={styles["ct-btn-text"]}>{localeText.filter || "Filter"}</span>
        {activeFilterCount > 0 && (
          <span className={styles["ct-filter-badge"]}>{activeFilterCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={[styles["ct-glass-dropdown"], styles["ct-filter-dropdown"]].filter(Boolean).join(" ")}>
          <div className={styles["ct-filter-header"]}>
            <span className={styles["ct-filter-title"]}>{localeText.filters || "Filters"}</span>
            {activeFilterCount > 0 && (
              <button className={styles["ct-filter-clear-all"]} onClick={clearAllFilters}>
                {localeText.clearAll || "Clear all"}
              </button>
            )}
          </div>

          <div className={styles["ct-filter-columns"]}>
            {columns.map((col) => {
              const isExpanded = expandedColumn === col.key;
              const selectedValues = filters[col.key] || [];
              const displayOptions = getDisplayOptions(col);
              const searchable = isSearchable(col.key);

              return (
                <div key={col.key} className={styles["ct-filter-column"]}>
                  <div
                    className={`${styles["ct-filter-column-header"]} ${isExpanded ? styles['expanded'] : ''} ${selectedValues.length > 0 ? styles['has-filter'] : ''}`}
                    onClick={() => {
                      setExpandedColumn(isExpanded ? null : col.key);
                      setFilterSearch('');
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span>{col.header}</span>
                    <div className={styles["ct-filter-column-meta"]}>
                      {selectedValues.length > 0 && (
                        <>
                          <span className={styles["ct-filter-count"]}>{selectedValues.length}</span>
                          <div
                            className={styles["ct-filter-clear-col-btn"]}
                            onClick={(e) => clearColumnFilter(col.key, e)}
                            title={localeText.clearFilter || "Clear filter"}
                            role="button"
                            tabIndex={0}
                          >
                            ×
                          </div>
                        </>
                      )}
                      <ChevronRight size={14} className={`${styles["ct-filter-chevron"]} ${isExpanded ? styles['active'] : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles["ct-filter-values"]}>
                      {searchable && (
                        <input
                          type="text"
                          className={styles["ct-filter-search-input"]}
                          placeholder={`${localeText.searchPlaceholder || "Search"} ${col.header}...`}
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                          autoFocus
                        />
                      )}
                      <div className={styles["ct-filter-values-list"]}>
                        {displayOptions.length === 0 ? (
                          <div className={styles["ct-filter-no-results"]}>{localeText.noMatches || "No matches"}</div>
                        ) : (
                          displayOptions.map((val) => (
                            <label key={val} className={[styles["ct-glass-dropdown-item"], styles["ct-filter-value-item"]].filter(Boolean).join(" ")}>
                              <input
                                type="checkbox"
                                className={styles["ct-checkbox"]}
                                checked={selectedValues.includes(val)}
                                onChange={() => toggleValue(col.key, val)}
                              />
                              <span className={styles["ct-filter-value-label"]}>{val}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;

