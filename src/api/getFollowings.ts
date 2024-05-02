import axios from "axios";
import Cookies from "js-cookie";
import { FOLLOW } from "../types";

export async function getFollowings(): Promise<FOLLOW> {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  const res = await axios.get(
    "http://localhost:3000//v1/users/myfollowings.json",
    { headers }
  );
  return res.data;
}
