import { createLazyFileRoute } from "@tanstack/react-router";
import styles from "./route.module.css"
import {
  useFetchFavoritesRecipes,
} from "../../hooks/useQueryHooks";
import FavoriteRecipes from "../../components/FavoriteRecipes";
export const Route = createLazyFileRoute("/favorites")({
  component: Favorites,
});

function Favorites() {
  const { data: favoriteRecipes } = useFetchFavoritesRecipes();

  return (
    <>
      <h2 className={styles.heading}>保存済みレシピ</h2>
      <div className={styles.wrapper}>
        <FavoriteRecipes favoriteRecipes={favoriteRecipes} />
      </div>
    </>
  );
}

export default Favorites;