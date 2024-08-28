import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "../../styles/Follow.module.css";
import { UserList } from "../../components/UserList";
import { useFetchFollowers } from "../../hooks/useQueryHooks";

export const Route = createLazyFileRoute("/followers/")({
  component: Followers,
});

function Followers() {
  const { data: followers } = useFetchFollowers();

  return (
    <div className={styles.wrapper}>
      <h2>フォロワー</h2>
      {followers ? <UserList users={followers} /> : null}
    </div>
  );
}

export default Followers;
