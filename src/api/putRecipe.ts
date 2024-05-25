import axios from "axios";
import Cookies from "js-cookie";

export const putRecipe = async ({ id, data }: { id: string; data: any }) => {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  await axios.put(`http://localhost:3000/v1/recipes/${id}.json`, data, {
    headers,
  });
};
