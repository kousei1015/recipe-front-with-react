import axios from "axios";
import Cookies from "js-cookie";
import { FOLLOW } from "../types";

export async function getFollowers(): Promise<FOLLOW> {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  const followers = await axios.get(
    "http://localhost:3000/v1/users/myfollowers.json",
    { headers }
  );
  return followers.data;
}
