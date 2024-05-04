import { Link } from "@tanstack/react-router";
import { RECIPES } from "../types";
import styles from "./Recipes.module.css";
import NoImage from "../../public/NoImg.jpg";
import { getBackColorByTime } from "../utils/getBackColorByTime";
import { getCookingTImeLabel } from "../utils/getCookingTimeLabel";

const Recipes = ({ recipes }: { recipes: RECIPES }) => {
  console.log(recipes.data);
  return (
    <div className={styles.recipe_wrapper}>
      {recipes?.data?.map((recipe) => (
        <article key={recipe.id} className={styles.recipe}>
          <Link to={`/${recipe.id}`}>
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
                  backgroundColor: getBackColorByTime(
                    recipe.cooking_time
                  ),
                }}
              >
                {getCookingTImeLabel(recipe.cooking_time)}
              </div>
              <span className={styles.recipe_name}>{recipe.recipe_name}</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default Recipes;
