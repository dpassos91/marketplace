import { useState, useMemo, useCallback } from 'react';

const usePaginationTable = (data, itemsPerPage = 10, sortFn = null) => {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!data) return [];
    const cloned = [...data];
    return sortFn ? cloned.sort(sortFn) : cloned;
  }, [data, sortFn]);

  const totalPages = useMemo(() => {
    return Math.ceil((sortedData.length || 0) / itemsPerPage);
  }, [sortedData, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    setCurrentPage,
  };
};

export default usePaginationTable;
