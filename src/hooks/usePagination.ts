const usePagination = (pagesArray: number[], page: number) => {
    const pagesFunc = () => {
      const leftArrow = "<";
      const rightArrow = ">";
      if (pagesArray.length <= 5) {
        return pagesArray;
      }
  
      if (page >= 1 && page <= 3) {
        const firstPageArrays = [1, 2, 3, 4, rightArrow, pagesArray.length];
        return firstPageArrays;
      } else if (page >= pagesArray.length - 1) {
        const lastPageArrays = [
          1,
          leftArrow,
          pagesArray.length - 2,
          pagesArray.length - 1,
          pagesArray.length,
        ];
        return lastPageArrays;
      } else {
        const slicedArrays = pagesArray.slice(page - 2, page + 1);
        const middlePageArrays = [
          1,
          leftArrow,
          ...slicedArrays,
          rightArrow,
          pagesArray.length,
        ];
        return middlePageArrays;
      }
    };
    return { pagesFunc } as const;
  };
  
  export default usePagination;