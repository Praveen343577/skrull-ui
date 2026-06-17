import tableStyles from "../Table.module.css";
import { RotateCcw } from 'lucide-react';

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const Refresh = ({ onRefresh, localeText = {} }) => {
  return (
    <button className={styles["ct-btn"]} onClick={onRefresh} title={localeText.refresh || "Reset all filters, sort, and search"}>
      <RotateCcw size={16} />
    </button>
  );
};

export default Refresh;
