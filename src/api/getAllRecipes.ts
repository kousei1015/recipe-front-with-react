import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { SUGGESTED_RECIPES } from "../types";

export async function getAllRecipes(): Promise<SUGGESTED_RECIPES> {
  try {
    const recipe = await apiClient.get(`/recipes/all.json`, {
      headers: addAuthHeaders(),
    });
    return recipe.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
