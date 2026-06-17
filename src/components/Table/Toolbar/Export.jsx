import tableStyles from "../Table.module.css";
import { Download } from 'lucide-react';
import XLSX from 'xlsx-js-style';

const styles = {};
const localS = typeof localStyles !== "undefined" ? localStyles : {};
for (const key of new Set([...Object.keys(tableStyles || {}), ...Object.keys(localS)])) {
  styles[key] = [tableStyles?.[key], localS[key]].filter(Boolean).join(" ");
}

const Export = ({ data, visibleCols, title = 'Export', localeText = {} }) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const wsData = [];

    // Header row
    const headerRow = visibleCols.map(col => String(col.header || ''));
    wsData.push(headerRow);

    // Data rows
    data.forEach(row => {
      const dataRow = visibleCols.map(col => {
        let val = row[col.key];
        if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        return val;
      });
      wsData.push(dataRow);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const headerStyle = {
      font: { bold: true, sz: 13, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "BADAFF" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    const dataStyle = {
      alignment: { horizontal: "left", vertical: "center" }
    };

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cellRef]) continue;

        if (R === 0) {
          ws[cellRef].s = headerStyle;
        } else {
          ws[cellRef].s = dataStyle;
        }
      }
    }

    // Set column widths
    const wscols = visibleCols.map(() => ({ wpx: 200 }));
    ws['!cols'] = wscols;

    // Set header row height
    ws['!rows'] = [{ hpx: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, "Data");
    
    // Generate timestamp
    const now = new Date();
    const timestamp = now.getFullYear() + "-" + 
      String(now.getMonth() + 1).padStart(2, '0') + "-" + 
      String(now.getDate()).padStart(2, '0') + "_" + 
      String(now.getHours()).padStart(2, '0') + "-" + 
      String(now.getMinutes()).padStart(2, '0') + "-" + 
      String(now.getSeconds()).padStart(2, '0');

    XLSX.writeFile(wb, `${title || 'table_export'} ${timestamp}.xlsx`);
  };

  return (
    <button className={styles["ct-btn"]} onClick={handleExport} title={localeText.export || "Export"}>
      <Download size={16} /> <span className={styles["ct-btn-text"]}>{localeText.export || "Export"}</span>
    </button>
  );
};

export default Export;
