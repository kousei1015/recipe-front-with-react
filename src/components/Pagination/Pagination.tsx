import styles from "./Pagination.module.css";
import usePaginateStore from "@/store/usePaginateStore";
import { usePagination } from "@/hooks/usePagination"; // 修正: usePaginationをフックとしてインポート
import { RECIPES } from "@/types";

const Pagination = ({ pagination }: { pagination: RECIPES["pagination"] }) => {
  const { page, clickPage } = usePaginateStore();
  
  const { total_pages, current_page } = pagination;

  const paginations = usePagination(total_pages, current_page);

  return (
    <div className={styles.wrapper}>
      {paginations.map((pg) => (
        <button
          key={pg}
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
