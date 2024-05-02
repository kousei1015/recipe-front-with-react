import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchRecipes, useFetchAuthInfo } from "../hooks/useQueryHooks";
import styles from "./index.module.css";
import AuthHeader from "../components/AuthHeader";
import NoAuthHeader from "../components/NoAuthHeader";
import Recipes from "../components/Recipes";
import SkeletonRecipes from "../components/SkeletonRecipes";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [page, setPage] = useState(1);
  const { data: recipes } = useFetchRecipes();

  const { data: authInfo, refetch } = useFetchAuthInfo();

  if (!recipes || !authInfo) {
    return <SkeletonRecipes />;
  }

  return (
    <>
      <div className={styles.headers}>
        {authInfo.is_login ? (
          <AuthHeader
            refetch={refetch}
            avatar_url={authInfo.avatar_url as string}
            user_name={authInfo.user_name as string}
          />
        ) : (
          <NoAuthHeader />
        )}
      </div>

      <h2 className={styles.heading}>レシピ一覧</h2>

      <Recipes recipes={recipes} />
    </>
  );
}
