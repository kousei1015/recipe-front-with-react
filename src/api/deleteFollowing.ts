import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const deleteFollowing = async (params: string) => {
  try {
    await apiClient.delete(`/relationships/${params}`, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting following:", error);
    throw error;
  }
};

export default deleteFollowing;
