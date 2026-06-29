import tableStyles from "../Table.module.css";
import { useState, useRef, useEffect } from 'react';
import { Columns } from 'lucide-react';

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const ColumnToggle = ({ columns, hiddenColumns, onToggleColumn, localeText = {} }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button className={styles["ct-btn"]} onClick={() => setShowMenu(!showMenu)} title={localeText.columns || "Columns"}>
        <Columns size={16} /> <span className={styles["ct-btn-text"]}>{localeText.columns || "Columns"}</span>
      </button>
      {showMenu && (
        <div className={styles["ct-dropdown"]}>
          {columns.map((col) => (
            <label key={col.key} className={styles["ct-dropdown-item"]}>
              <input
                type="checkbox"
                className={styles["ct-checkbox"]}
                checked={!hiddenColumns.includes(col.key)}
                onChange={() => onToggleColumn(col.key)}
              />
              {col.header}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnToggle;
