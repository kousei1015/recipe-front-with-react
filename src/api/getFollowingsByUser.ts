import apiClient from "./apiClient";
import { FOLLOW } from "../types";
import { addAuthHeaders } from "./addAuthHeader";

export async function getFollowingsByUser(id: string): Promise<FOLLOW> {
  try {
    const followers = await apiClient.get(`/users/${id}/followings.json`, {
      headers: addAuthHeaders(),
    });
    return followers.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
