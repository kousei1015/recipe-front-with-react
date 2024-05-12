import { createFileRoute } from "@tanstack/react-router";
import { useFetchRecipesByUser } from "../../hooks/useQueryHooks";
import Recipes from "../../components/Recipes";
import SkeletonRecipes from "../../components/SkeletonRecipes";
import Wrapper from "../../components/Wrapper";
export const Route = createFileRoute("/followings/$followingsId/recipes")({
  component: RecipesByUser,
});

function RecipesByUser() {
  const { useParams } = Route;
  const params = useParams();
  const { data: recipes, isLoading } = useFetchRecipesByUser(
    params.followingsId
  );

  if (isLoading) {
    return <SkeletonRecipes />;
  }

  if (!recipes) {
    return <h2>レシピはありません</h2>;
  }
  return (
    <Wrapper>
      <h2>{recipes.data[0].user_name}さんの投稿</h2>
      <Recipes recipes={recipes} />
    </Wrapper>
  );
}

export default RecipesByUser;
