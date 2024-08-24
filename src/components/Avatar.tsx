import { AVATAR_PROPS } from "../types";
import styles from "./Avatar.module.css"
import NoProfileImage from "../../public/UserIcon.webp"
import useModalStore from "../store/useModalStore";

const Avatar = ({avatar_url}: AVATAR_PROPS) => {
  const { onOpen } = useModalStore();
  return (
    <div className={styles.avatar} onClick={onOpen}>
      <img
        src={avatar_url || NoProfileImage}
        alt={avatar_url ? "プロフィール画像" : "画像なし"}
        width={100}
        height={100}
      />
    </div>
  );
};

export default Avatar;
