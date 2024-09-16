import { Link } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import { useFollow, useCancelFollowing } from "../../hooks/useQueryHooks";
import { FOLLOW } from "../../types";
import AvatarWithName from "../Avatar";

type UserListProps = {
  users: FOLLOW;
  loginUserId: string | undefined; // ログインユーザーIDを受け取るプロパティを追加
};

export const FollowingsList: React.FC<UserListProps> = ({
  users,
  loginUserId,
}) => {
  const followMutation = useFollow();
  const unfollowMutation = useCancelFollowing();

  const handleFollowClick =
    (userId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      followMutation.mutate(userId);
    };

  const handleUnfollowClick =
    (userId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      unfollowMutation.mutate(userId);
    };

  return (
    <div className={styles.wrapper}>
      {users?.map((user) => {
        const isFollowing =
          "already_following" in user && user.already_following;
        const isPending = isFollowing
          ? unfollowMutation.isPending
          : followMutation.isPending;
        const showButtons = user.followed_id !== loginUserId; // ボタンを表示する条件

        return (
          <div key={user.id} className={styles.follow_users}>
            <Link to={`/${user.followed_id}/recipes`} className={styles.link}>
              <AvatarWithName
                avatar_url={user.avatar_url}
                user_name={user.user_name}
              />
            </Link>

            {showButtons && (
              <button
                onClick={
                  isFollowing
                    ? handleUnfollowClick(user.followed_id as string)
                    : handleFollowClick(user.followed_id as string)
                }
                style={{ opacity: isPending ? 0.2 : 1 }}
              >
                {isFollowing ? "フォローを解除" : "フォロー"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
