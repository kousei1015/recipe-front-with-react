import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "./route.module.css";
import { useFetchFavoritesRecipes } from "@/hooks/useQueryHooks";
import Recipes from "@/components/Recipes/Recipes";
export const Route = createLazyFileRoute("/favorites")({
  component: Favorites,
});

function Favorites() {
  const { data: favoriteRecipes } = useFetchFavoritesRecipes();
  if (!favoriteRecipes) return;
  return (
    <>
      <h2 className={styles.heading}>保存済みレシピ</h2>
      <Recipes recipes={favoriteRecipes} />
    </>
  );
}

export default Favorites;
