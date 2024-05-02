import { AVATAR_PROPS } from "../types";
import styles from "./Avatar.module.css"
import NoImage from "../../public/NoImg.jpg"
import useModalStore from "../store/useModalStore";

const Avatar = ({avatar_url}: AVATAR_PROPS) => {
  const { onOpen } = useModalStore();
  return (
    <div className={styles.avatar} onClick={onOpen}>
      <img
        src={avatar_url || NoImage}
        alt={avatar_url ? "レシピ画像" : "画像なし"}
        width={100}
        height={100}
      />
    </div>
  );
};

export default Avatar;
