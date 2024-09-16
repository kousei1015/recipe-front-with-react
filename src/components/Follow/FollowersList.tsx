import { Link } from "@tanstack/react-router";
import styles from "@/styles/Follow.module.css";
import { useFollow, useCancelFollowing } from "@/hooks/useQueryHooks";
import { FOLLOW } from "@/types";
import AvatarWithName from "../Avatar/Avatar";

type UserListProps = {
  users: FOLLOW;
  loginUserId: string | undefined;
};

export const FollowersList: React.FC<UserListProps> = ({ users, loginUserId }) => {
  const followMutation = useFollow();
  const unfollowMutation = useCancelFollowing();

  return (
    <div className={styles.wrapper}>
      {users?.map((user) => {
        const isFollowing = "already_following" in user && user.already_following;
        const isPending = isFollowing ? unfollowMutation.isPending : followMutation.isPending;

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          if (isFollowing) {
            unfollowMutation.mutate(user.follower_id as string);
          } else {
            followMutation.mutate(user.follower_id as string);
          }
        };

        return (
          <div key={user.id} className={styles.follow_users}>
            <Link to={`/${user.follower_id}/recipes`} className={styles.link}>
              <AvatarWithName
                avatar_url={user.avatar_url}
                user_name={user.user_name}
              />
            </Link>

            {/* ログインユーザー自身でなければボタンを表示 */}
            {user.follower_id !== loginUserId && (
              <button onClick={handleClick} style={{ opacity: isPending ? 0.2 : 1 }}>
                {isFollowing ? "フォローを解除" : "フォロー"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
