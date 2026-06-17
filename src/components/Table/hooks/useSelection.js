import { useState, useCallback } from 'react';

const useSelection = () => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = useCallback((currentData) => {
    setSelectedIds((prev) => {
      const allIds = currentData.map((r) => r.id);
      const allSelected = allIds.length > 0 && allIds.every((id) => prev.includes(id));
      return allSelected ? [] : allIds;
    });
  }, []);

  const toggleSelectRow = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return { selectedIds, toggleSelectAll, toggleSelectRow, resetSelection };
};

export default useSelection;
