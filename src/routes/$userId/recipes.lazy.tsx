import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useFetchRecipesByUser,
  useFetchUserInfoByParams,
} from "@/hooks/useQueryHooks";
import Recipes from "@/components/Recipes/Recipes";
import Wrapper from "@/components/Common/Wrapper";
import { FollowLinks } from "@/components/Follow/FollowLinks";

export const Route = createLazyFileRoute("/$userId/recipes")({
  component: RecipesByUser,
});

function RecipesByUser() {
  const { useParams } = Route;
  const params = useParams();
  const { data: recipes, isLoading: recipesLoading } = useFetchRecipesByUser(params.userId);
  const { data: userInfo, isLoading: userLoading } = useFetchUserInfoByParams(params.userId);

  if(recipesLoading || userLoading) return
  return (
    <Wrapper>
      <h2>{userInfo?.name}さんの投稿</h2>
      <FollowLinks
        userId={userInfo?.id as string}
        followersCount={userInfo?.followers_count as number}
        followingsCount={userInfo?.followings_count as number}
      />
      {recipes?.data ? <Recipes recipes={recipes.data} /> : "投稿されたレシピはありません"}
    </Wrapper>
  );
}

export default RecipesByUser;
