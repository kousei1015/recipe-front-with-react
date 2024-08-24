import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { RECIPE } from "../types";

export async function getRecipe(params: string): Promise<RECIPE> {
  try {
    const recipe = await apiClient.get(`/recipes/${params}.json`, {
      headers: addAuthHeaders(),
    });
    return recipe.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
