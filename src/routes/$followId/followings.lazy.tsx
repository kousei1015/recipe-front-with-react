import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import { useFetchFollowingsByUser } from "../../hooks/useQueryHooks";
import { UserList } from "../../components/UserList";

export const Route = createLazyFileRoute("/$followId/followings")({
  component: Followings,
});

function Followings() {
  const { useParams } = Route;
  const params = useParams();
  const { data: followings } = useFetchFollowingsByUser(params.followId);

  return (
    <div className={styles.wrapper}>
      <h2>フォロー中</h2>
      {followings ? <UserList users={followings} linkType="followed"/> : null}
    </div>
  );
}

export default Followings;
