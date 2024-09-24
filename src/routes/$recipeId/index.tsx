import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import styles from "@/styles/$recipeId.module.css";
import {
  useDeleteRecipe,
  useCancelFavRecipes,
  useCancelFollowing,
  useFetchAuthInfo,
  useFetchRecipe,
  useFollow,
  usePostFavoriteRecipe,
} from "@/hooks/useQueryHooks";
import NoImage from "@/assets/NoImg.jpg";
import { getCookingTImeLabel } from "@/utils/getCookingTimeLabel";
import NotFound from "@/components/Common/NotFound";
import AvatarWithName from "@/components/Avatar/Avatar";

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
    return;
  }

  const isLogin = authInfo!.is_login;
  const isOwnRecipe = recipe.user_id === authInfo!.user_id;
  const isFavorited = !!recipe.favorite_id;
  const isFollowed = !!recipe.follow_id;

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = window.confirm("このレシピを削除しますか？");
    if (confirmed) {
      await deleteRecipeMutation.mutateAsync(params.recipeId);
      navigate({ to: "/" });
    }
  };

  const handleFavoriteToggle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (isFavorited) {
      unfavoriteMutation.mutate(recipe.favorite_id as string);
    } else {
      favoriteMutation.mutate(recipe.id);
    }
    refetch();
  };

  const handleFollowToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isFollowed) {
      unfollowMutation.mutate(recipe?.user_id as string);
    } else {
      followMutation.mutate(recipe?.user_id);
    }
    refetch();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.recipe}>
        <div>
          <h2 className={styles.recipe_name}>{recipe?.recipe_name}</h2>
          <div className={styles.img_wrapper}>
            <img
              src={recipe.image_url || NoImage}
              alt={recipe.image_url ? "レシピ画像" : "画像なし"}
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className={styles.texts}>
          <h2 className={styles.instructions_title}>作り方</h2>
          <div className={styles.process}>
            <p>{recipe.process}</p>
          </div>
          <h3 className={styles.cooking_time}>
            所要時間: {getCookingTImeLabel(recipe.cooking_time)}
          </h3>
          <h3>材料</h3>
          <ul className={styles.ingredient_list}>
            {recipe?.ingredients?.map((ingredient) => (
              <li key={ingredient.name} className={styles.ingredient_item}>
                <span className={styles.ingredient_name}>
                  {ingredient.name}{" "}
                </span>
                <span className={styles.ingredient_quantity}>
                  {ingredient.quantity}
                </span>
              </li>
            ))}
          </ul>
           {/*自身の投稿の場合は削除ボタンを表示させる。 そうでない場合は投稿したユーザー名を表示させる */}
          {isOwnRecipe ? (
            <div className={styles.button_wrapper}>
              <button onClick={handleDelete}>削除</button>
              <button
                className={styles.edit_button}
                onClick={() => navigate({ to: "/$recipeId/edit", params })}
              >
                編集
              </button>
            </div>
          ) : (
            <div>
              <Link to={`/${recipe.user_id}/recipes`} className={styles.link}>
                <AvatarWithName
                  avatar_url={recipe.avatar_url}
                  user_name={recipe.user_name}
                />
              </Link>
            </div>
          )}
          <div className={styles.button_wrapper}>
            {isLogin && !isOwnRecipe && (
              <>
                <button
                  onClick={handleFavoriteToggle}
                  style={{
                    opacity:
                      favoriteMutation.isPending || unfavoriteMutation.isPending
                        ? 0.2
                        : 1,
                  }}
                >
                  {isFavorited ? "お気に入りを解除" : "保存"}
                </button>
                <button
                  onClick={handleFollowToggle}
                  style={{
                    opacity:
                      followMutation.isPending || unfollowMutation.isPending
                        ? 0.2
                        : 1,
                  }}
                >
                  {isFollowed ? "フォローを解除" : "フォロー"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
