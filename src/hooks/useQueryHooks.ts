import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getRecipes } from "../api/getRecipes";
import { getLoginUserInfo } from "../api/getLoginUserInfo";
import { getRecipe } from "../api/getRecipe";
import { getFollowings } from "../api/getFollowings";
import { getFollowers } from "../api/getFollowers";
import { getFavorites } from "../api/getFavorites";
import { getUserInfoByParams } from "../api/getUserInfoByParams";
import { getFollowingsByUser } from "../api/getFollowingsByUser";
import { getFollowersByUser } from "../api/getFollowersByUser";
import { deleteFavoriteRecipe } from "../api/deleteFavoriteRecipes";
import { deleteFollowing } from "../api/deleteFollowing";
import { postFollow } from "../api/postFollow";
import { postSignInData } from "../api/postSignInData";
import { postSignUpData } from "../api/postSignUpdata";
import { postFavoriteRecipe } from "../api/postFavoriteRecipe";
import { setCookies } from "../utils/setCookies";
import { patchProfile } from "../api/patchProfile";
import { postRecipe } from "../api/postRecipe";
import deleteRecipe from "../api/deleteRecipe";
import { getRecipesByUser } from "../api/getRecipesByUser";
import { putRecipe } from "../api/putRecipe";
import { getAllRecipes } from "../api/getAllRecipes";

export const usePostSignInData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSignInData,
    onSuccess: (data) => {
      const { uid, client, "access-token": accessToken } = data.headers;
      setCookies(client, accessToken, uid);
      queryClient.invalidateQueries({ queryKey: ["authInfo"] });
    },
  });
};

export const usePostSignUpData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSignUpData,
    onSuccess: (data) => {
      const { uid, client, "access-token": accessToken } = data.headers;
      setCookies(client, accessToken, uid);
      queryClient.invalidateQueries({ queryKey: ["authInfo"] });
    },
  });
};

export const useFetchAllRecipes = () => {
  return useQuery({
    queryKey: ["allRecipes"],
    queryFn: getAllRecipes
  })
}

export const useFetchRecipes = (page: number, option: string) => {
  return useQuery({
    queryKey: ["recipes", page, option],
    queryFn: () => getRecipes(page, option),
    placeholderData: keepPreviousData,
  });
};

export const useFetchAuthInfo = () => {
  return useQuery({ queryKey: ["authInfo"], queryFn: getLoginUserInfo });
};

export const useFetchRecipe = (id: string) => {
  return useQuery({ queryKey: ["recipe", id], queryFn: () => getRecipe(id) });
};

export const usePostRecipe = () => {
  return useMutation({ mutationFn: postRecipe });
};

export const usePutRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};

export const useFetchFollowings = () => {
  return useQuery({ queryKey: ["followings"], queryFn: getFollowings });
};

export const useFetchFollowingsByUser = (id: string) => {
  return useQuery({
    queryKey: ["followings", id],
    queryFn: () => getFollowingsByUser(id),
  });
};

export const useFetchFollowersByUser = (id: string) => {
  return useQuery({
    queryKey: ["followers", id],
    queryFn: () => getFollowersByUser(id),
  });
};

export const useFetchFollowers = () => {
  return useQuery({ queryKey: ["followers"], queryFn: getFollowers });
};

export const useFetchRecipesByUser = (id: string) => {
  return useQuery({
    queryKey: ["followerRecipes", id],
    queryFn: () => getRecipesByUser(id),
  });
};

export const useFetchUserInfoByParams = (id: string) => {
  return useQuery({
    queryKey: ["userInfoByParams", id],
    queryFn: () => getUserInfoByParams(id),
  });
};

export const useFetchFavoritesRecipes = () => {
  return useQuery({ queryKey: ["favoritesRecipes"], queryFn: getFavorites });
};

export const usePostFavoriteRecipe = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFavoriteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
    },
  });
};

export const useCancelFavRecipes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFavoriteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesRecipes"] });
    },
  });
};

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followings"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
    },
  });
};

export const useCancelFollowing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFollowing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followings"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
    },
  });
};

export const usePatchProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authInfo"] }),
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};
