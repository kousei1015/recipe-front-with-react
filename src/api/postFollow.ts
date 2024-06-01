import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";

export const postFollow = async (params: string) => {
  try {
    await apiClient.post("/relationships", { user_id: params }, {
      headers: addAuthHeaders(),
    });
  } catch (error) {
    console.error("Error posting follow:", error);
  }
};