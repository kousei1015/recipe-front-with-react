import { Link } from "@tanstack/react-router";
import styles from "./AuthHeader.module.css";
import Avatar from "./Avatar";
import Modal from "./Modal";
import { AUTH_HEADER_PROPS } from "../types";

const AuthHeader = ({ avatar_url, user_name, refetch }: AUTH_HEADER_PROPS) => {
  return (
    <>
      <div>
        <Link to="/favorites" className={styles.link}>
          <h3>マイリスト</h3>
        </Link>
      </div>

      <div>
        <Link to="/create"  className={styles.link}>
          <h3>レシピ投稿</h3>
        </Link>
      </div>

      <Avatar avatar_url={avatar_url as string} />

      <Modal
        user_name={user_name as string}
        avatar_url={avatar_url as string}
        refetch={refetch}
      />
    </>
  );
};

export default AuthHeader;
