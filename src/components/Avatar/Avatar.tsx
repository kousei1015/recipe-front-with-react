import { AVATAR_PROPS } from "@/types";
import styles from "./Avatar.module.css";
import { ClickableAvatarImage, NonClickableAvatarImage } from "./AvatarImage";
import useModalStore from "@/store/useModalStore";

export const Avatar = ({ avatar_url }: AVATAR_PROPS) => {
  const { onOpen } = useModalStore();
  return (
    <div className={styles.avatar_wrapper} onClick={onOpen}>
      <ClickableAvatarImage avatar_url={avatar_url} />
    </div>
  );
};

export const AvatarWithName = ({
  avatar_url,
  user_name,
}: AVATAR_PROPS & { user_name: string }) => {
  return (
    <div
      className={`${styles.avatar_wrapper} ${styles.avatar_with_name_wrapper}`}
    >
      <NonClickableAvatarImage avatar_url={avatar_url} />
      <p>{user_name}</p>
    </div>
  );
};

export default AvatarWithName;
