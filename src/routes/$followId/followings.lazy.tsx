import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "@/styles/Follow.module.css";
import {
  useFetchAuthInfo,
  useFetchUserInfoByParams,
  useFetchFollowingsByUser,
} from "@/hooks/useQueryHooks";
import { FollowingsList } from "@/components/Follow/FollowingsList";

export const Route = createLazyFileRoute("/$followId/followings")({
  component: Followings,
});

function Followings() {
  const { useParams } = Route;
  const params = useParams();
  const { data: paramsUserFollowings } = useFetchFollowingsByUser(
    params.followId
  );
  const { data: myUser } = useFetchAuthInfo();
  const { data: paramsUser } = useFetchUserInfoByParams(params.followId);

  return (
    <div className={styles.wrapper}>
      <h2>{paramsUser?.name}</h2>
      <h2>フォロー中</h2>
      {paramsUserFollowings ? (
        <FollowingsList
          users={paramsUserFollowings}
          loginUserId={myUser?.user_id}
        />
      ) : null}
    </div>
  );
}

export default Followings;
