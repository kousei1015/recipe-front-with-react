import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const deleteRecipe = async (params: string) => {
  try {
    await apiClient.delete(`/recipes/${params}`, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

export default deleteRecipe;
