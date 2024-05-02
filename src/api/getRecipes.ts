import { RECIPES } from "../types";
import axios from "axios";
import Cookies from "js-cookie";

export async function getRecipes(): Promise<RECIPES> {

  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };
  
  const recipes = await axios.get("http://localhost:3000/v1/recipes.json", {
    headers,
  });
  return recipes.data;
}
