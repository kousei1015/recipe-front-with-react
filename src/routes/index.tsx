import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import Pagination from "@/components/Pagination/Pagination"
import usePaginateStore from "@/store/usePaginateStore";
import useSelectForSort from "@/store/useSelectForSort";
import {
  useFetchRecipes,
  useFetchAuthInfo,
  useFetchAllRecipes,
} from "@/hooks/useQueryHooks";
import styles from "./index.module.css";
import AuthHeader from "@/components/Auth/AuthHeader";
import NoAuthHeader from "@/components/Auth/NoAuthHeader";
import Recipes from "@/components/Recipes/Recipes";
import SkeletonRecipes from "@/components/Recipes/SkeletonRecipes";
import SelectForSort from "@/components/Search/SelectForSort";
import Search from "@/components/Search/Search";
import useModalStore from "@/store/useModalStore";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { currentPage } = usePaginateStore();
  const { orderType } = useSelectForSort();
  const { data: recipes } = useFetchRecipes(currentPage, orderType);

  const { data: authInfo, refetch } = useFetchAuthInfo();

  const { data: allRecipes, isLoading: isLoadingAllRecipes } =
    useFetchAllRecipes();

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

      <Recipes recipes={recipes.data} />

      <Pagination pagination={recipes.pagination} />
    </>
  );
}

export default Index;
