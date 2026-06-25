import tableStyles from "../Table.module.css";
import { useState, useRef, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';
import localStyles from "./Pagination.module.css";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const ROWS_OPTIONS = [10, 25, 50, 100];

const Pagination = ({
  currentPage, setCurrentPage,
  rowsPerPage, setRowsPerPage,
  totalPages, startIndex,
  totalEntries, paginationItems, localeText = {},
}) => {
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const rowsDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setShowRowsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles["ct-footer"]}>
      <div className={styles["ct-showing-text"]}>
        <span className={styles["ct-showing-label"]}>
          {localeText.showing || "Showing"} {totalEntries === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalEntries)} {localeText.of || "of"} {totalEntries} {localeText.page || "page"}
        </span>
        <div style={{ position: 'relative' }} ref={rowsDropdownRef}>
          <button
            className={styles["ct-rows-trigger"]}
            onClick={() => setShowRowsDropdown(!showRowsDropdown)}
          >
            {rowsPerPage} {localeText.rows || "rows"}
            <ChevronDown size={12} className={`${styles["ct-rows-chevron"]} ${showRowsDropdown ? styles['rotated'] : ''}`} />
          </button>
          {showRowsDropdown && (
            <div className={[styles["ct-glass-dropdown"], styles["ct-rows-dropdown"]].filter(Boolean).join(" ")}>
              {ROWS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`${styles["ct-glass-dropdown-item"]} ${rowsPerPage === opt ? styles['active'] : ''}`}
                  onClick={() => {
                    setRowsPerPage(opt);
                    setCurrentPage(1);
                    setShowRowsDropdown(false);
                  }}
                >
                  {opt} {localeText.rows || "rows"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles["ct-pagination-controls"]}>
        <button className={styles["ct-page-btn"]} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
          {localeText.previous || "Previous"}
        </button>

        <div className={styles["ct-pagination-numbers"]}>

          {paginationItems.map((item, index) => {
            if (item === 'left') {
              return (
                <button key={`left-${index}`} className={[styles["ct-page-btn"], styles["ct-ellipsis"]].filter(Boolean).join(" ")} onClick={() => setCurrentPage(Math.max(1, currentPage - 5))}>
                  <ChevronsLeft size={16} />
                </button>
              );
            }
            if (item === 'right') {
              return (
                <button key={`right-${index}`} className={[styles["ct-page-btn"], styles["ct-ellipsis"]].filter(Boolean).join(" ")} onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 5))}>
                  <ChevronsRight size={16} />
                </button>
              );
            }
            return (
              <button key={item} className={`${styles["ct-page-btn"]} ${currentPage === item ? styles['active'] : ''}`} onClick={() => setCurrentPage(item)}>
                {item}
              </button>
            );
          })}

        </div>

        <button className={styles["ct-page-btn"]} disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}>
          {localeText.next || "Next"}
        </button>

        <div className={styles["ct-go-to"]}>
          {localeText.goToPage || "Go to page"} <input
            type="number"
            min={1}
            max={totalPages}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= totalPages) setCurrentPage(val);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
