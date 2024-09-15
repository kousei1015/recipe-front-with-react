import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useFetchRecipesByUser,
  useFetchFollowingsAndFollowers,
} from "../../hooks/useQueryHooks";
import Recipes from "../../components/Recipes";
import SkeletonRecipes from "../../components/SkeletonRecipes";
import Wrapper from "../../components/Wrapper";
import { FollowLinks } from "../../components/FollowLinks";

export const Route = createLazyFileRoute("/$userId/recipes")({
  component: RecipesByUser,
});

function RecipesByUser() {
  const { useParams } = Route;
  const params = useParams();
  const { data: recipes, isLoading } = useFetchRecipesByUser(params.userId);
  const { data: userInfo, isLoading: userInfoLoading } = useFetchFollowingsAndFollowers(params.userId);
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
      <Recipes recipes={recipes} />
    </Wrapper>
  );
}

export default RecipesByUser;
