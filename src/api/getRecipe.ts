import axios from "axios";
import Cookies from "js-cookie";
import { RECIPE } from "../types";


export async function getRecipe(params: string): Promise<RECIPE> {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  const recipe = await axios.get(
    `http://localhost:3000/v1/recipes/${params}.json`,
    { headers }
  );
  return recipe.data;
}
