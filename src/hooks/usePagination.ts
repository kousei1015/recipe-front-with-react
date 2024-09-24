import { useMemo } from "react";

export const usePagination = (total_pages: number, current_page: number) => {
  const paginationRange = useMemo(() => {
    const leftArrow = "<";
    const rightArrow = ">";

    if (total_pages <= 5) {
      return Array.from({ length: total_pages }, (_, index) => index + 1);
    }

    if (current_page <= 3) {
      return [1, 2, 3, 4, rightArrow, total_pages];
    }

    if (current_page >= total_pages - 1) {
      return [1, leftArrow, total_pages - 2, total_pages - 1, total_pages];
    }

    const start = current_page - 1;
    const end = current_page + 1;
    const middlePages = Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );

    return [1, leftArrow, ...middlePages, rightArrow, total_pages];
  }, [total_pages, current_page]);

  return paginationRange;
};
