import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import {
  useFetchAuthInfo,
  useFetchFollowersByUser,
  useFetchUserInfoByParams,
} from "../../hooks/useQueryHooks";
import { FollowersList } from "../../components/UserList/FollowersList";

export const Route = createLazyFileRoute("/$followId/followers")({
  component: Followers,
});

function Followers() {
  const { useParams } = Route;
  const params = useParams();
  const { data: paramsUserFollowers } = useFetchFollowersByUser(params.followId);
  const { data: myUser } = useFetchAuthInfo();
  const { data: paramsUser } = useFetchUserInfoByParams(params.followId);
  return (
    <div className={styles.wrapper}>
      <h2>{paramsUser?.name}</h2>
      <h2>フォロワー</h2>
      {paramsUserFollowers ? (
        <FollowersList users={paramsUserFollowers} loginUserId={myUser?.user_id} />
      ) : null}
    </div>
  );
}

export default Followers;
