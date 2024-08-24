import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { RECIPES } from "../types";

export async function getRecipesByUser(id: string): Promise<RECIPES> {
  try {
    const recipes = await apiClient.get(`/users/${id}/recipes.json`, {
      headers: addAuthHeaders(),
    });
    return recipes.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}
