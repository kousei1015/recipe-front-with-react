import { createFileRoute, useNavigate } from "@tanstack/react-router";
import styles from "../../styles/$recipeId.module.css";
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
import { getCookingTImeLabel } from "../../utils/getCookingTimeLabel";
import NotFound from "../../components/NotFound";

export const Route = createFileRoute("/$recipeId/")({
  component: SinglePost,
});

function SinglePost() {
  const navigate = useNavigate();
  const { useParams } = Route;
  const params = useParams();

  const {
    data: recipe,
    refetch,
    error: recipeError,
  } = useFetchRecipe(params.recipeId);

  const { data: authInfo, error: authError } = useFetchAuthInfo();

  const deleteRecipeMutation = useDeleteRecipe();

  const favoriteMutation = usePostFavoriteRecipe(recipe?.id!);

  const unfavoriteMutation = useCancelFavRecipes();

  const followMutation = useFollow();

  const unfollowMutation = useCancelFollowing();

  if (recipeError || authError) {
    return <NotFound />;
  }
  if (!recipe || !authInfo) {
    return
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
        <h2>所要時間: {getCookingTImeLabel(recipe.cooking_time)}</h2>
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
          <div className={styles.button_wrapper}>
            <button
              onClick={async (e) => {
                e.preventDefault();
                const confirmed = window.confirm("このレシピを削除しますか？");
                if (confirmed) {
                  await deleteRecipeMutation.mutateAsync(params.recipeId);
                  navigate({
                    to: "/",
                  });
                }
              }}
            >
              削除
            </button>

            <button
              className={styles.edit_button}
              onClick={() => {
                navigate({ to: "/$recipeId/edit", params });
              }}
            >
              編集
            </button>
          </div>
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
                  refetch();
                }}
                style={{ opacity: unfavoriteMutation.isPending ? 0.2 : 1 }}
              >
                お気に入りを解除
              </button>
            ) : (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  favoriteMutation.mutate(recipe.id);
                  refetch();
                }}
                style={{ opacity: favoriteMutation.isPending ? 0.2 : 1 }}
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
                  refetch();
                }}
                style={{ opacity: unfollowMutation.isPending ? 0.2 : 1 }}
              >
                フォローを解除
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  followMutation.mutate(recipe?.user_id);
                  refetch();
                }}
                style={{ opacity: followMutation.isPending ? 0.2 : 1 }}
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

export default SinglePost;
