import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "@/styles/Follow.module.css";
import { FollowersList } from "@/components/Follow/FollowersList";
import { useFetchFollowers, useFetchAuthInfo } from "@/hooks/useQueryHooks";

export const Route = createLazyFileRoute("/myfollowers/")({
  component: Followers,
});

function Followers() {
  const { data: followers } = useFetchFollowers();
  const { data: myUser } = useFetchAuthInfo();
  return (
    <div className={styles.wrapper}>
      <h2>フォロワー</h2>
      {followers ? (
        <FollowersList users={followers} loginUserId={myUser?.user_id} />
      ) : null}
    </div>
  );
}

export default Followers;
