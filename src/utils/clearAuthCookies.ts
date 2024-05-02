import Cookies from "js-cookie";

export const clearAuthCookies = () => {
  Cookies.remove("client");
  Cookies.remove("uid");
  Cookies.remove("access-token");
};
