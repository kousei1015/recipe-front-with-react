import Cookies from "js-cookie";

export const addAuthHeaders = (headers: any = {}) => {
  headers.client = Cookies.get("client");
  headers.uid = Cookies.get("uid");
  headers["access-token"] = Cookies.get("access-token");
  return headers;
};