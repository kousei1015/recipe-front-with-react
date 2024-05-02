import axios, { AxiosResponse } from "axios";
import { AUTHINFO } from "../types";
import Cookies from "js-cookie";

export const fetchUserInfo = async () => {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };
  try {
  const authInfo: AxiosResponse<AUTHINFO> =  await axios.get("http://localhost:3000/v1/users.json", { headers });
  return authInfo.data
  } catch (error) {
    console.error(error);
  }
};
