import { useState, useCallback } from 'react';

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterBySearch = useCallback((data) => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery]);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return { searchQuery, setSearchQuery, filterBySearch, resetSearch };
};

export default useSearch;
