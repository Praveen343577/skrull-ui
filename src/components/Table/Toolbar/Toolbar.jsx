import tableStyles from "../Table.module.css";
import localStyles from "./Toolbar.module.css";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const Toolbar = ({ tabs, activeTab, onTabChange, showTabs = true, title, children }) => {
  return (
    <div className={styles["ct-toolbar"]}>
      {showTabs && tabs.length > 0 ? (
        <>
          <div className={styles["ct-tabs"]}>
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`${styles["ct-tab"]} ${activeTab === tab.label ? styles['active'] : ''}`}
                onClick={() => onTabChange(tab.label)}
              >
                {tab.label} {tab.count !== undefined && <span className={styles["ct-tab-badge"]}>{tab.count}</span>}
              </button>
            ))}
          </div>
          <div className={[styles["ct-toolbar-title-block"], styles["mobile-only"]].filter(Boolean).join(" ")} style={{ display: 'none' }}>
            {title && <h2 className={styles["ct-toolbar-title"]}>{title}</h2>}
          </div>
        </>
      ) : (
        <div className={styles["ct-toolbar-title-block"]}>
          {title && <h2 className={styles["ct-toolbar-title"]}>{title}</h2>}
        </div>
      )}
      {children && (
        <div className={styles["ct-toolbar-actions"]}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Toolbar;

