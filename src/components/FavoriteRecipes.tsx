import { Link } from "@tanstack/react-router";
import styles from "./FavoriteRecipes.module.css";
import { useCancelFavRecipes } from "../hooks/useQueryHooks";
import NoImage from "../../public/NoImg.jpg";
import { FavRecipes } from "../types";
import { getBackColorByTime } from "../utils/getBackColorByTime";
import { getCookingTImeLabel } from "../utils/getCookingTimeLabel";

const FavoriteRecipes = ({
  favoriteRecipes,
}: {
  favoriteRecipes: FavRecipes | undefined;
}) => {
  const unfavoriteMutation = useCancelFavRecipes();
  return (
    <>
      {favoriteRecipes?.map((recipe) => {
        return (
          <article key={recipe.favorite_id} className={styles.recipe}>
            <Link to={`/${recipe.recipe_id}`}>
              <div className={styles.img_wrapper}>
                <img
                  src={recipe.image_url || NoImage}
                  alt={recipe.image_url ? "レシピ画像" : "画像なし"}
                  width={100}
                  height={100}
                />
                <div
                  className={styles.cooking_time}
                  style={{
                    backgroundColor: getBackColorByTime(recipe.cooking_time),
                  }}
                >
                  {getCookingTImeLabel(recipe.cooking_time)}
                </div>
                <span className={styles.recipe_name}>{recipe.recipe_name}</span>
              </div>
              <p className={styles.user_name}>ユーザー名: {recipe.user_name}</p>

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
    </>
  );
};

export default FavoriteRecipes;
