import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { ProfileEditProps } from "../types";

export const patchProfile = async (data: ProfileEditProps) => {
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
