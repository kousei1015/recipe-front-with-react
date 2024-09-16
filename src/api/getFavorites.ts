import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { RECIPES } from "../types";

export async function getFavorites(): Promise<RECIPES["data"]> {
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
