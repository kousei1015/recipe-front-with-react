import styles from "./Wrapper.module.css";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;
