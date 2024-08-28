import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import { UserList } from "../../components/UserList";
import {
  useFetchFollowings,
  useCancelFollowing,
} from "../../hooks/useQueryHooks";

export const Route = createLazyFileRoute("/followings/")({
  component: Followings,
});

function Followings() {
  const { data: followings } = useFetchFollowings();

  const unfollowMutation = useCancelFollowing();

  return (
    <div className={styles.wrapper}>
      <h2>フォロー中</h2>
      {followings ? (
        <UserList
          users={followings}
          onUnfollow={(id: string) => unfollowMutation.mutate(id)}
        />
      ) : null}
    </div>
  );
}

export default Followings;
