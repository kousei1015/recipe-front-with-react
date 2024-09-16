import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useFetchRecipesByUser,
  useFetchUserInfoByParams,
} from "@/hooks/useQueryHooks";
import Recipes from "@/components/Recipes/Recipes";
import SkeletonRecipes from "@/components/Recipes/SkeletonRecipes";
import Wrapper from "@/components/Common/Wrapper";
import { FollowLinks } from "@/components/Follow/FollowLinks";

export const Route = createLazyFileRoute("/$userId/recipes")({
  component: RecipesByUser,
});

function RecipesByUser() {
  const { useParams } = Route;
  const params = useParams();
  const { data: recipes, isLoading } = useFetchRecipesByUser(params.userId);
  const { data: userInfo, isLoading: userInfoLoading } =
    useFetchUserInfoByParams(params.userId);
  if (isLoading || userInfoLoading) {
    return <SkeletonRecipes />;
  }

  if (!recipes) {
    return <h2>レシピはありません</h2>;
  }
  return (
    <Wrapper>
      <h2>{userInfo?.name}さんの投稿</h2>
      <FollowLinks
        userId={userInfo?.id as string}
        followersCount={userInfo?.followers_count as number}
        followingsCount={userInfo?.followings_count as number}
      />
      <Recipes recipes={recipes.data} />
    </Wrapper>
  );
}

export default RecipesByUser;
