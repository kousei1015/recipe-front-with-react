import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { RECIPES } from "../types";

export async function getRecipes(
  pageParams: number,
  orderType: string
): Promise<RECIPES> {
  let recipes = null;
  try {
    switch (orderType) {
      case "cookingTimeSort":
        recipes = await apiClient.get(
          `/recipes?page=${pageParams}&sort_by=cooking_time&order=asc`,
          {
            headers: addAuthHeaders(),
          }
        );
        break;

      case "":
        recipes = await apiClient.get(`/recipes.json?page=${pageParams}`, {
          headers: addAuthHeaders(),
        });
        break;

      default:
        break;
    }
    return recipes?.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}