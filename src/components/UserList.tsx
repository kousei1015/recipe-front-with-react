import { Link } from "@tanstack/react-router";
import styles from "../styles/Follow.module.css";
import { FOLLOW } from "../types";
import AvatarWithName from "./Avatar";

type UserListProps = {
  users: FOLLOW;
  onUnfollow?: (id: string) => void;
};

export const UserList: React.FC<UserListProps> = ({ users, onUnfollow }) => {
  return (
    <div className={styles.wrapper}>
      {users?.map((user) => (
        <div key={user.id} className={styles.follow_users}>
          <Link to={`${user.followed_id}/recipes`} className={styles.link}>
            <AvatarWithName
              avatar_url={user.avatar_url}
              user_name={user.user_name}
            />
          </Link>
          {onUnfollow && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onUnfollow(user.id);
              }}
            >
              フォローを解除
            </button>
          )}
        </div>
      ))}
    </div>
  );
};