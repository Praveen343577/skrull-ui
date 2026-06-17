import tableStyles from "../Table.module.css";
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import localStyles from "./Header.module.css";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const Header = ({ visibleCols, sortConfig, onSort, allSelected, onToggleSelectAll, showRowSelection = true }) => {
  return (
    <thead>
      <tr>
        {showRowSelection && (
          <th style={{ width: '3rem' }}>
            <input
              type="checkbox"
              className={styles["ct-checkbox"]}
              checked={allSelected}
              onChange={onToggleSelectAll}
            />
          </th>
        )}
        {visibleCols.map((col) => (
          <th key={col.key} className={styles["ct-th-sortable"]} onClick={() => onSort(col.key)} style={{ width: col.width || 'auto' }}>
            <div className={styles["ct-th-content"]}>
              {col.header}
              <div className={`${styles["ct-sort-icons"]} ${sortConfig.key === col.key ? styles['active'] : ''}`}>
                {sortConfig.key === col.key ? (
                  sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                ) : (
                  <ArrowUpDown size={14} style={{ opacity: 0.5 }} />
                )}
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;

