import { Link } from "@tanstack/react-router";
import styles from "./Modal.module.css";
import { ModalProps } from "../../types";
import { clearAuthCookies } from "../../utils/clearAuthCookies";
import useModalStore from "../../store/useModalStore";
import AvatarWithName from "../Avatar/Avatar";

const Modal = ({ user_name, avatar_url, refetch }: ModalProps) => {
  const { isOpen, onClose } = useModalStore();
  return isOpen ? (
    <div className={styles.overlay}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <AvatarWithName avatar_url={avatar_url} user_name={user_name} />

        <button
          onClick={(e) => {
            e.preventDefault();
            clearAuthCookies();
            refetch();
          }}
        >
          ログアウト
        </button>

        <ul className={styles.links_list}>
          <li className={styles.links_item}>
            <Link to="/myfollowings">
              <h3>フォロー中</h3>
            </Link>
          </li>
          <li className={styles.links_item}>
            <Link to="/myfollowers">
              <h3>フォロワー</h3>
            </Link>
          </li>
          <li className={styles.links_item}>
            <Link to="/profile" className={styles.link}>
              プロフィールを編集する
            </Link>
          </li>
        </ul>

        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  ) : null;
};

export default Modal;
