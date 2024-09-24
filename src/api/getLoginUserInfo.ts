import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { AUTHINFO } from "../types";

export const getLoginUserInfo = async (): Promise<AUTHINFO | undefined> => {
 try {
   const authInfo = await apiClient.get("/users/current_user_info.json", {
     headers: addAuthHeaders(),
   });
   return authInfo.data;
 } catch (error) {
   console.error(error);
   throw error;
 }
};
