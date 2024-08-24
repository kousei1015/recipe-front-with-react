import styles from "./SkeletonRecipe.module.css";

const SkeletonRecipe = () => {
  return (
    <div className={styles.skeleton_wrapper} data-testid="skeletonTest">
      <h2 className={styles.skeleton_heading}>&nbsp;</h2>
      <div className={styles.skeleton_img}></div>
      {Array.from({ length: 6 })
        .map(() => {
          return (
            <>
              <div className={styles.skeleton_text}>&nbsp;</div>
              <br />
            </>
          );
        })}
    </div>
  );
};

export default SkeletonRecipe;
