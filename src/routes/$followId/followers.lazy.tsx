import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import {
  useFetchFollowersByUser,
  useFetchFollowingsAndFollowers,
} from "../../hooks/useQueryHooks";
import { UserList } from "../../components/UserList";

export const Route = createLazyFileRoute("/$followId/followers")({
  component: Followers,
});

function Followers() {
  const { useParams } = Route;
  const params = useParams();
  const { data: followers } = useFetchFollowersByUser(params.followId);
  const { data: userInfo } = useFetchFollowingsAndFollowers(params.followId);
  return (
    <div className={styles.wrapper}>
      <h2>{userInfo?.name}</h2>
      <h2>フォロワー</h2>
      {followers ? <UserList users={followers} linkType="follower" /> : null}
    </div>
  );
}

export default Followers;
