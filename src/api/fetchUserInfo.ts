import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { AUTHINFO } from "../types";

export const fetchUserInfo = async (): Promise<AUTHINFO | undefined> => {
  try {
    const authInfo = await apiClient.get("/users.json", {
      headers: addAuthHeaders(),
    });
    return authInfo.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
