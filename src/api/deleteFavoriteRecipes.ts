import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const deleteFavoriteRecipe = async (params: string) => {
  try {
    await apiClient.delete(`/favorites/${params}`, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting favorite recipe:", error);
    throw error;
  }
};

export default deleteFavoriteRecipe;
