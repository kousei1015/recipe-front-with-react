import { Link } from "@tanstack/react-router";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>ページが見つかりません</h1>
      <p className={styles.message}>申し訳ありませんが、お探しのページが見つかりませんでした。</p>
      <Link to="/" className={styles.link}>トップページに戻る</Link>
    </div>
  );
};

export default NotFound;