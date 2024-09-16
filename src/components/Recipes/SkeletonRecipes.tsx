import styles from "./SkeletonRecipes.module.css";

const SkeletonRecipes = () => {
  // スケルトンが表示される数を指定
  const itemCount = 9;

  return (
    <>
      <h2 className={styles.heading}>レシピ一覧</h2>
      <div className={styles.skeleton_wrapper}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <article key={index} className={styles.skeletonItem} data-testid="skeletonsTest">
            <div className={styles.skeleton_block}></div>
          </article>
        ))}
      </div>
    </>
  );
};

export default SkeletonRecipes;
