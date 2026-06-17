import { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import useSort from './hooks/useSort';
import useSearch from './hooks/useSearch';
import useFilter from './hooks/useFilter';
import usePagination from './hooks/usePagination';
import useSelection from './hooks/useSelection';

import Toolbar from './Toolbar/Toolbar';
import Search from './Toolbar/Search';
import Filter from './Toolbar/Filter';
import ColumnToggle from './Toolbar/ColumnToggle';
import Export from './Toolbar/Export';
import Refresh from './Toolbar/Refresh';
import Header from './Header/Header';
import Body from './Body/Body';
import Pagination from './Pagination/Pagination';

import localStyles from "./Table.module.css";

const styles = localStyles;

const defaultLocaleText = {
  searchPlaceholder: "Search",
  filter: "Filter",
  filters: "Filters",
  clearAll: "Clear all",
  noMatches: "No matches",
  clearFilter: "Clear filter",
  columns: "Columns",
  export: "Export",
  refresh: "Refresh",
  showing: "Showing",
  of: "of",
  page: "page",
  rows: "rows",
  previous: "Previous",
  next: "Next",
  goToPage: "Go to page",
};

const Table = ({
  data = [],
  columns = [],
  tabs = [],
  defaultTab = '',
  tabKey = 'status',
  prevData = null,
  showTabs = true,
  title = '',
  showSearch = true,
  showFilter = true,
  showColumnToggle = true,
  showExport = true,
  showRowSelection = true,
  showPagination = true,
  mode = 'client',
  totalServerEntries = 0,
  onPageChange,
  onSortChange,
  onFilterChange,
  filterableColumns,
  filterConfig = {},
  localeText = {},
}) => {
  const mergedLocale = { ...defaultLocaleText, ...localeText };
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.label || ''));
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const tableWrapperRef = useRef(null);

  // Dev-mode warnings for invalid filterableColumns keys
  if (process.env.NODE_ENV === 'development' && filterableColumns) {
    filterableColumns.forEach((key) => {
      if (!columns.find((c) => c.key === key)) {
        console.warn(`[Table] filterableColumns: "${key}" not found in columns`);
      }
    });
  }

  const { searchQuery, setSearchQuery, filterBySearch, resetSearch } = useSearch();
  const { sortConfig, handleSort, sortData, resetSort } = useSort();
  const { filters, setColumnFilter, filterData, resetFilters } = useFilter(filterConfig);
  const { selectedIds, toggleSelectAll, toggleSelectRow, resetSelection } = useSelection();

  // Compute filterable columns list
  const filterableCols = useMemo(() => {
    if (!filterableColumns || filterableColumns.length === 0) return columns;
    return columns.filter((col) => filterableColumns.includes(col.key));
  }, [columns, filterableColumns]);

  // Tab filter — skip when tabs are hidden
  const tabFilteredData = useMemo(() => {
    if (!showTabs || !tabKey) return data;
    if (!activeTab || activeTab === 'ALL' || activeTab === 'All') return data;
    return data.filter((row) => row[tabKey] === activeTab);
  }, [data, activeTab, showTabs, tabKey]);

  // Pipeline: tab → search → column filter → sort
  const processedData = useMemo(() => {
    if (mode === 'server') return data;
    let result = tabFilteredData;
    result = filterBySearch(result);
    result = filterData(result);
    result = sortData(result);
    return result;
  }, [tabFilteredData, filterBySearch, filterData, sortData, mode, data]);

  const {
    currentPage, setCurrentPage,
    rowsPerPage, setRowsPerPage,
    totalPages, startIndex,
    paginationItems,
    paginateData,
    resetPagination,
  } = usePagination(mode === 'server' ? totalServerEntries : processedData.length);

  const currentData = (mode === 'server' || !showPagination) ? processedData : paginateData(processedData);
  const visibleCols = columns.filter((col) => !hiddenColumns.includes(col.key));

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleRefresh = () => {
    resetSearch();
    resetSort();
    resetFilters();
    resetSelection();
    resetPagination();
    setHiddenColumns([]);
    setActiveTab(defaultTab || (tabs[0]?.label || ''));
  };

  const handleTabChange = (label) => {
    setActiveTab(label);
    setCurrentPage(1);
    if (mode === 'server' && onFilterChange) onFilterChange({ tab: label });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    if (mode === 'server' && onFilterChange) onFilterChange({ search: value });
  };

  const handleSortProxy = (key) => {
    handleSort(key);
    if (mode === 'server' && onSortChange) {
      const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      onSortChange(key, newDirection);
    }
  };

  const handleFilterProxy = (columnKey, values) => {
    setColumnFilter(columnKey, values);
    if (mode === 'server' && onFilterChange) {
      const newFilters = { ...filters };
      if (!values || values.length === 0) delete newFilters[columnKey];
      else newFilters[columnKey] = values;
      onFilterChange(newFilters);
    }
  };

  const handlePageChangeProxy = (page) => {
    setCurrentPage(page);
    if (mode === 'server' && onPageChange) onPageChange(page, rowsPerPage);
  };

  const handleRowsPerPageProxy = (rows) => {
    setRowsPerPage(rows);
    if (mode === 'server' && onPageChange) onPageChange(1, rows);
  };

  const allSelected = currentData.length > 0 && currentData.every((row) => selectedIds.includes(row.id));

  const hasToolbarActions = showSearch || showFilter || showColumnToggle || showExport;

  return (
    <div className={styles["ct-container"]}>
      <Toolbar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showTabs={showTabs}
        title={title}
      >
        {hasToolbarActions && (
          <>
            {showSearch && 
              <Search 
                value={searchQuery} 
                onChange={handleSearchChange}
                localeText={mergedLocale}
              />
            }
            {showFilter && (
              <Filter
                columns={filterableCols}
                data={mode === 'server' ? data : tabFilteredData}
                filters={filters}
                onFilterChange={handleFilterProxy}
                filterConfig={filterConfig}
                localeText={mergedLocale}
              />
            )}
            {showColumnToggle && (
              <ColumnToggle
                columns={columns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
                localeText={mergedLocale}
              />
            )}
            {showExport && 
              <Export 
                data={processedData} 
                visibleCols={visibleCols} 
                title={title} 
                localeText={mergedLocale}
              />
            }
            <Refresh onRefresh={handleRefresh} localeText={mergedLocale} />
          </>
        )}
      </Toolbar>

      <div className={styles["ct-table-wrapper"]} ref={tableWrapperRef}>
        <table className={styles["ct-table"]}>
          <Header
            visibleCols={visibleCols}
            sortConfig={sortConfig}
            onSort={handleSortProxy}
            allSelected={allSelected}
            onToggleSelectAll={() => toggleSelectAll(currentData)}
            showRowSelection={showRowSelection}
          />
          <Body
            currentData={currentData}
            tableWrapperRef={tableWrapperRef}
            prevData={prevData}
            visibleCols={visibleCols}
            selectedIds={selectedIds}
            onToggleSelectRow={toggleSelectRow}
            showRowSelection={showRowSelection}
          />
        </table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={handlePageChangeProxy}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={handleRowsPerPageProxy}
          totalPages={totalPages}
          startIndex={startIndex}
          totalEntries={mode === 'server' ? totalServerEntries : processedData.length}
          paginationItems={paginationItems}
          localeText={mergedLocale}
        />
      )}
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  tabs: PropTypes.array,
  tabKey: PropTypes.string,
  defaultTab: PropTypes.string,
  prevData: PropTypes.array,
  showTabs: PropTypes.bool,
  title: PropTypes.string,
  showSearch: PropTypes.bool,
  showFilter: PropTypes.bool,
  showColumnToggle: PropTypes.bool,
  showExport: PropTypes.bool,
  showRowSelection: PropTypes.bool,
  showPagination: PropTypes.bool,
  mode: PropTypes.oneOf(['client', 'server']),
  totalServerEntries: PropTypes.number,
  onPageChange: PropTypes.func,
  onSortChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  filterableColumns: PropTypes.arrayOf(PropTypes.string),
  filterConfig: PropTypes.object,
};

export default Table;

