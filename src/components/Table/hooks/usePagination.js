import { useState, useMemo, useCallback } from 'react';

const usePagination = (totalEntries) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const paginationItems = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, 'right', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 'left', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'left', currentPage - 1, currentPage, currentPage + 1, 'right', totalPages);
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const paginateData = useCallback((data) => {
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [startIndex, rowsPerPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setRowsPerPage(10);
  }, []);

  return {
    currentPage, setCurrentPage,
    rowsPerPage, setRowsPerPage,
    totalPages, startIndex,
    paginationItems,
    paginateData,
    resetPagination,
  };
};

export default usePagination;
