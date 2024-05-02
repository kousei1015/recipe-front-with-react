import Cookies from "js-cookie";

export const setCookies = (client: string, accessToken: string, uid: string) => {
    Cookies.set("client", client);
    Cookies.set("access-token", accessToken);
    Cookies.set("uid", uid);
}
