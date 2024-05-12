import { RECIPES } from "../types";
import axios from "axios";
import Cookies from "js-cookie";

export async function getRecipesByUser(id: string): Promise<RECIPES> {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  const recipes = await axios.get(
    `http://localhost:3000/v1/users/${id}/recipes.json`,
    {
      headers,
    }
  );
  return recipes.data;
}
