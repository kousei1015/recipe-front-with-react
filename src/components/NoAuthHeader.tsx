import { Link } from "@tanstack/react-router";
import styles from "./NoAuthHeader.module.css";

export const NoAuthHeader = () => {
  return (
    <>
      <div>
        <Link to="/signin" className={styles.link}>ログイン</Link>
      </div>
      <div>
        <Link to="/signup" className={styles.link} >新規登録</Link>
      </div>
    </>
  );
};

export default NoAuthHeader;
