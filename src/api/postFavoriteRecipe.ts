import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const postFavoriteRecipe = async (params: string) => {
  try {
    await apiClient.post("/favorites", { recipe_id: params }, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error posting favorite recipe:", error);
  }
};
