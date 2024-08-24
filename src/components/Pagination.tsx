import styles from "./Pagination.module.css";
import usePaginateStore from "../store/usePaginateStore";
import usePagination from "../hooks/usePagination";
import { RECIPES } from "../types";

const Pagination = ({ recipes }: { recipes: RECIPES }) => {
  const { page, clickPage } = usePaginateStore();
  const pagesArray = Array(recipes.pagination?.total_pages)
    .fill(0)
    .map((_, index) => index + 1);

  const currentPage = recipes.pagination?.current_page;
  const { pagesFunc } = usePagination(pagesArray, currentPage as number);
  const pagination = pagesFunc();

  return (
    <div className={styles.wrapper}>
      {pagination.map((pg) => (
        <button
          className={pg === page ? styles.active_button : styles.button}
          onClick={(e) => {
            e.preventDefault();
            if (typeof pg === "number") clickPage(pg);
          }}
        >
          {pg}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
