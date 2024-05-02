import axios from "axios";
import Cookies from "js-cookie";
import { FavRecipes } from "../types";

export async function getFavorites(): Promise<FavRecipes> {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  const recipes = await axios.get("http://localhost:3000/v1/favorites.json", {
    headers,
  });

  return recipes.data;
}
