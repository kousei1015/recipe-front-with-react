import { createLazyFileRoute, Link } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import NoProfileImage from "../../../public/UserIcon.webp";
import { useFetchFollowers } from "../../hooks/useQueryHooks";

export const Route = createLazyFileRoute("/followers/")({
  component: Followers,
});

function Followers() {
  const { data: followers } = useFetchFollowers();

  return (
    <div className={styles.wrapper}>
      <h2>フォロワー</h2>
      {followers?.map((follower) => {
        return (
          <div key={follower.id} className={styles.follow_users}>
            <Link
              to={`${follower.followed_id}/recipes`}
              className={styles.link}
            >
              <img
                src={follower.avatar_url || NoProfileImage}
                alt={follower.avatar_url ? "プロフィール画像" : "画像なし"}
                width={100}
                height={100}
              />
              <h3 className={styles.name}>{follower.user_name}</h3>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default Followers;
