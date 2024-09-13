import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const patchProfile = async (data: FormData) => {
  try {
    const res = await apiClient.patch("/auth", data, {
      headers: addAuthHeaders(),
    });
    return res;
  } catch (error) {
    console.error("Error patching profile:", error);
    throw error;
  }
};
