import { createFileRoute, Link } from "@tanstack/react-router";
import styles from "../../styles/Recipes.module.css";
import NoImage from "../../../public/NoImg.jpg";
import {
  useCancelFavRecipes,
  useFetchFavoritesRecipes,
} from "../../hooks/useQueryHooks";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
});

function Favorites() {
  const { data: favoriteRecipes } = useFetchFavoritesRecipes();

  const unfavoriteMutation = useCancelFavRecipes();

  return (
    <>
      <h2 className={styles.heading}>保存済みレシピ</h2>
      <div className={styles.wrapper}>
        {favoriteRecipes?.map((recipe) => {
          return (
            <article key={recipe.favorite_id} className={styles.recipe}>
              <Link href={`/${recipe.recipe_id}`}>
                <div className={styles.img_wrapper}>
                  <img
                    src={recipe.image_url || NoImage}
                    alt={recipe.image_url ? "レシピ画像" : "画像なし"}
                    width={100}
                    height={100}
                  />
                  <span className={styles.recipe_name}>
                    {recipe.recipe_name}
                  </span>
                </div>
                <p className={styles.user_name}>
                  ユーザー名: {recipe.user_name}
                </p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    unfavoriteMutation.mutate(recipe.favorite_id);
                  }}
                >
                  お気に入りを解除
                </button>
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
