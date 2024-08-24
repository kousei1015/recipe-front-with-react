import useSelectForSort from "../store/useSelectForSort";
import styles from "./SelectForSort.module.css";
const SelectForSort = () => {
  const { changeOrderType } = useSelectForSort();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "" || value === "cookingTimeSort") {
      changeOrderType(value);
    }
  };

  return (
    <select name="cooking-time" onChange={handleChange} className={styles.select}>
      <option value="">新規投稿順</option>
      <option value="cookingTimeSort">所要時間が短い順</option>
    </select>
  );
};

export default SelectForSort;
