import tableStyles from "../Table/Table.module.css";
import localStyles from "./DeltaPill.module.css";
import { ArrowUp, ArrowDown } from "lucide-react";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const DeltaPill = ({ delta, unit }) => {
  if (!delta) return null;

  const { value, direction } = delta;

  if (direction === 'none') {
    return (
      <span className={[styles["ct-delta-pill"], styles["ct-delta-neutral"]].filter(Boolean).join(" ")}>
        <span className={styles["ct-delta-value"]}>~</span>
      </span>
    );
  }

  if (direction === 'same') {
    return null;
  }

  const isUp = direction === 'up';
  let formattedValue = value;

  if (typeof formattedValue === 'number' && formattedValue % 1 !== 0) {
    formattedValue = formattedValue.toFixed(1);
  }

  return (
    <span className={`${styles["ct-delta-pill"]} ${isUp ? styles['ct-delta-up'] : styles['ct-delta-down']}`}>
      <span className={styles["ct-delta-icon"]}>
        {isUp ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
      </span>
      <span className={styles["ct-delta-value"]}>
        {isUp ? '+' : '-'}{formattedValue}{unit}
      </span>
    </span>
  );
};

export default DeltaPill;
