import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { FavRecipes } from "../types";

export async function getFavorites(): Promise<FavRecipes> {
  try {
    const recipes = await apiClient.get("/favorites.json", {
      headers: addAuthHeaders(),
    });
    return recipes.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
