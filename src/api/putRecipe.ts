import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const putRecipe = async ({ id, data }: { id: string; data: any }) => {
  try {
    await apiClient.put(`/recipes/${id}.json`, data, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};
