import axios from "axios";
import Cookies from "js-cookie";

export const postRecipe = async (data: any) => {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  await axios.post("http://localhost:3000/v1/recipes", data, { headers });
};
