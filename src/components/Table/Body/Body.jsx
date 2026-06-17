import { useVirtualizer } from '@tanstack/react-virtual';
import tableStyles from "../Table.module.css";

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}
const BodyRow = ({ row, visibleCols, selectedIds, onToggleSelectRow, prevRow, showRowSelection }) => {
  return (
    <tr className={styles["ct-table-row"]}>
      {showRowSelection && (
        <td style={{ width: '3rem' }}>
          <input
            type="checkbox"
            className={styles["ct-checkbox"]}
            checked={selectedIds.includes(row.id)}
            onChange={() => onToggleSelectRow(row.id)}
          />
        </td>
      )}
      {visibleCols.map((col) => (
        <td key={`${row.id}-${col.key}`}>
          {col.render ? col.render(row, prevRow) : row[col.key]}
        </td>
      ))}
    </tr>
  );
};

const Body = ({ currentData, visibleCols, selectedIds, onToggleSelectRow, prevData, showRowSelection = true, tableWrapperRef }) => {
  const rowVirtualizer = useVirtualizer({
    count: currentData.length,
    getScrollElement: () => tableWrapperRef.current,
    estimateSize: () => 48, // 48px derives from your 3rem height in Table.css
    overscan: 5, // Buffer rows
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom = virtualItems.length > 0
    ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0;

  return (
    <tbody>
      {currentData.length === 0 ? (
        <tr>
          <td colSpan={visibleCols.length + (showRowSelection ? 1 : 0)} style={{ textAlign: 'center', padding: '40px' }}>
            No records found.
          </td>
        </tr>
      ) : (
        <>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px`, padding: 0, border: 0 }} colSpan={visibleCols.length + (showRowSelection ? 1 : 0)} />
            </tr>
          )}
          {virtualItems.map((virtualRow) => {
            const row = currentData[virtualRow.index];
            const prevRow = prevData ? prevData.find((p) => p.id === row.id) : null;
            return (
              <BodyRow
                key={row.id}
                row={row}
                prevRow={prevRow}
                visibleCols={visibleCols}
                selectedIds={selectedIds}
                onToggleSelectRow={onToggleSelectRow}
                showRowSelection={showRowSelection}
              />
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px`, padding: 0, border: 0 }} colSpan={visibleCols.length + (showRowSelection ? 1 : 0)} />
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

export default Body;

