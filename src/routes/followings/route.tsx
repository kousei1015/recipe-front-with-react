import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import NoImage from "../../../public/NoImg.jpg";
import {
  useFetchFollowings,
  useCancelFollowing,
} from "../../hooks/useQueryHooks";

export const Route = createFileRoute("/followings")({
  component: Followings,
});

function Followings() {
  const { data: followings } = useFetchFollowings();

  const unfollowMutation = useCancelFollowing();

  return (
    <div className={styles.wrapper}>
      <h2>フォロー中</h2>
      {followings?.map((following) => {
        return (
          <div key={following.id} className={styles.follow_users}>
            <Link
              href={`followings/${following.followed_id}/recipes`}
              className={styles.link}
            >
              <img
                src={following.avatar_url || NoImage}
                alt={following.avatar_url ? "レシピ画像" : "画像なし"}
                width={100}
                height={100}
              />
              <h3 className={styles.name}>{following.user_name}</h3>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                unfollowMutation.mutate(following.id);
              }}
            >
              フォローを解除
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Followings;
