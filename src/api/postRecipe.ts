import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const postRecipe = async (data: FormData) => {
  try {
    await apiClient.post("/recipes", data, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error posting recipe:", error);
  }
};
