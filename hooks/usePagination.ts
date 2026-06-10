import { useState } from "react";

interface PaginationState {
  page: number;
  limit: number;
}

interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

export function usePagination(initialLimit = 10): UsePaginationReturn {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  function reset() {
    setPage(1);
  }

  function handleSetLimit(newLimit: number) {
    setLimit(newLimit);
    setPage(1);
  }

  return { page, limit, setPage, setLimit: handleSetLimit, reset };
}
