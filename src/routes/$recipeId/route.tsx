import { createFileRoute, useNavigate } from "@tanstack/react-router";
import styles from "../../styles/$recipeId.module.css";
import SkeletonRecipe from "../../components/SkeletonRecipe";
import {
  useDeleteRecipe,
  useCancelFavRecipes,
  useCancelFollowing,
  useFetchAuthInfo,
  useFetchRecipe,
  useFollow,
  usePostFavoriteRecipe,
} from "../../hooks/useQueryHooks";
import NoImage from "../../../public/NoImg.jpg";

export const Route = createFileRoute("/$recipeId")({
  component: SinglePost,
});

function SinglePost() {
  const navigate = useNavigate();
  const { useParams } = Route;
  const params = useParams();

  const { data: recipe } = useFetchRecipe(params.recipeId);

  const { data: authInfo } = useFetchAuthInfo();

  const deleteRecipeMutation = useDeleteRecipe();

  const favoriteMutation = usePostFavoriteRecipe(recipe?.id!);

  const unfavoriteMutation = useCancelFavRecipes(params.recipeId);

  const followMutation = useFollow(params.recipeId);

  const unfollowMutation = useCancelFollowing(params.recipeId);

  if(!recipe || !authInfo) {
    return <SkeletonRecipe />
  }

  const isLogin = authInfo!.is_login;
  const isOwnRecipe = recipe.user_id === authInfo!.user_id;
  const isFavorited = !!recipe.favorite_id;
  const isFollowed = !!recipe.follow_id;


  return (
    <div className={styles.wrapper}>
      <div className={styles.recipe}>
        <h2 className={styles.recipe_name}>{recipe?.recipe_name}</h2>
        <div className={styles.img_wrapper}>
          <img
            src={recipe.image_url || NoImage}
            alt={recipe.image_url ? "レシピ画像" : "画像なし"}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.process}>
          <p>{recipe.process}</p>
        </div>
        <h3>材料</h3>
        <ul className={styles.ingredient_list}>
          {recipe?.ingredients?.map((ingredient) => {
            return (
              <li className={styles.ingredient_item}>
                {ingredient.name} {ingredient.quantity}
              </li>
            );
          })}
        </ul>
        {/*自身の投稿の場合は削除ボタンを表示させる。 そうでない場合は投稿したユーザー名を表示させる */}
        {isOwnRecipe ? (
          <button
            onClick={async (e) => {
              e.preventDefault();
              await deleteRecipeMutation.mutateAsync(params.recipeId);
              navigate({
                to: "/",
              });
            }}
          >
            削除
          </button>
        ) : (
          <div className={styles.avatar_wrapper}>
            <img
              src={recipe?.avatar_url || NoImage}
              alt={recipe?.avatar_url ? "レシピ画像" : "画像なし"}
              width={100}
              height={100}
            />
            <p>{recipe.user_name}</p>
          </div>
        )}

        {/*ログインしていて、かつ既にレシピがお気に入り済みの場合はお気に入りを解除させる そうでない場合は保存させる */}
        {isLogin && !isOwnRecipe && (
          <>
            {isFavorited ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  unfavoriteMutation.mutate(recipe.favorite_id as string);
                }}
              >
                お気に入りを解除
              </button>
            ) : (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  favoriteMutation.mutate(recipe.id);
                }}
              >
                保存
              </button>
            )}
          </>
        )}

        {isLogin && !isOwnRecipe && (
          <>
            {isFollowed ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  unfollowMutation.mutate(recipe?.follow_id as string);
                }}
              >
                フォローを解除
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  followMutation.mutate(recipe?.user_id);
                }}
              >
                フォロー
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
