import { Link } from "@tanstack/react-router";
import styles from "./FollowLinks.module.css"
type FollowLinksProps = {
  userId: string;
  followingsCount: number;
  followersCount: number;
};

export const FollowLinks: React.FC<FollowLinksProps> = ({
  userId,
  followingsCount,
  followersCount,
}) => {
  return (
    <ul className={styles.links}>
      <Link to={`/${userId}/followings`}>
        <li>フォロー中 {followingsCount}</li>
      </Link>
      <Link to={`/${userId}/followers`}>
        <li>フォロワー {followersCount}</li>
      </Link>
    </ul>
  );
};
