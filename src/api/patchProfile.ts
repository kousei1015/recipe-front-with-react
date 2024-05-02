import axios from "axios";
import Cookies from "js-cookie";
import { ProfileEditProps } from "../types";

export const patchProfile = async (data: ProfileEditProps) => {
  const headers = {
    client: Cookies.get("client"),
    uid: Cookies.get("uid"),
    "access-token": Cookies.get("access-token"),
  };

  const res = await axios.patch("http://localhost:3000/v1/auth", data, {
    headers,
  });
  return res;
};
