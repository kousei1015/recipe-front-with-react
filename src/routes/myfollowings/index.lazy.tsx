import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "@/styles/Follow.module.css";
import { FollowingsList } from "@/components/Follow/FollowingsList";
import {
  useFetchFollowings,
  useFetchAuthInfo,
} from "@/hooks/useQueryHooks";

export const Route = createLazyFileRoute("/myfollowings/")({
  component: Followings,
});

function Followings() {
  const { data: followings } = useFetchFollowings();
  const { data: myUser } = useFetchAuthInfo();

  return (
    <div className={styles.wrapper}>
      <h2>フォロー中</h2>
      {followings ? (
        <FollowingsList users={followings} loginUserId={myUser?.user_id} />
      ) : null}
    </div>
  );
}

export default Followings;
