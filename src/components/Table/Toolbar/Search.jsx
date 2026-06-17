import tableStyles from "../Table.module.css";
import { Search as SearchIcon } from 'lucide-react';
import localStyles from "./Search.module.css";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const Search = ({ value, onChange, localeText = {} }) => {
  return (
    <div className={styles["ct-search-wrapper"]}>
      <SearchIcon size={16} className={styles["ct-search-icon"]} />
      <input
        type="text"
        placeholder={localeText.searchPlaceholder || "Search..."}
        className={styles["ct-search-input"]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
