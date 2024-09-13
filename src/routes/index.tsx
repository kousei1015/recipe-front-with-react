import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import Pagination from "../components/Pagination";
import usePaginateStore from "../store/usePaginateStore";
import useSelectForSort from "../store/useSelectForSort";
import {
  useFetchRecipes,
  useFetchAuthInfo,
  useFetchAllRecipes,
} from "../hooks/useQueryHooks";
import styles from "./index.module.css";
import AuthHeader from "../components/AuthHeader";
import NoAuthHeader from "../components/NoAuthHeader";
import Recipes from "../components/Recipes";
import SkeletonRecipes from "../components/SkeletonRecipes";
import SelectForSort from "../components/SelectForSort";
import Search from "../components/Search";
import useModalStore from "../store/useModalStore";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { page } = usePaginateStore();
  const { orderType } = useSelectForSort();
  const { data: recipes } = useFetchRecipes(page, orderType);

  const { data: authInfo, refetch } = useFetchAuthInfo();

  const { data: allRecipes, isLoading: isLoadingAllRecipes } = useFetchAllRecipes();

  const { isOpen, onClose } = useModalStore();

  useEffect(() => {
    // コンポーネントがアンマウントされる時にモーダルを閉じる
    return () => {
      if (isOpen) {
        onClose();
      }
    };
  }, [isOpen]);

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

      {!isLoadingAllRecipes && <Search recipes={allRecipes} />}

      <SelectForSort />

      <Recipes recipes={recipes} />

      <Pagination recipes={recipes} />
    </>
  );
}

export default Index;
