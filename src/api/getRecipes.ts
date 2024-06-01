import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { RECIPES } from "../types";

export async function getRecipes(pageParams: number): Promise<RECIPES> {
  try {
    const recipes = await apiClient.get(`/recipes.json?page=${pageParams}`, {
      headers: addAuthHeaders(),
    });
    return recipes.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}
