import axios from "axios";
import Cookies from "js-cookie";

export const deleteFavoriteRecipe = async (params: string) => {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  try {
    await axios.delete(`http://localhost:3000/v1/favorites/${params}`, {
      headers,
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};
