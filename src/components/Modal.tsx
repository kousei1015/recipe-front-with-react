import { Link } from "@tanstack/react-router";
import styles from "./Modal.module.css";
import NoProfileImage from "../../public/UserIcon.webp";
import { ModalProps } from "../types";
import { clearAuthCookies } from "../utils/clearAuthCookies";
import useModalStore from "../store/useModalStore";

const Modal = ({ user_name, avatar_url, refetch }: ModalProps) => {
  const { isOpen, onClose } = useModalStore();
  return isOpen ? (
    <div className={styles.overlay}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.avatar_wrapper}>
          <img
            src={avatar_url || NoProfileImage}
            alt={avatar_url ? "プロフィール画像" : "画像なし"}
            width={100}
            height={100}
          />
          <p>{user_name}</p>
        </div>

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
            <Link to="/followings">
              <h3>フォロー中</h3>
            </Link>
          </li>
          <li className={styles.links_item}>
            <Link to="/followers">
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
