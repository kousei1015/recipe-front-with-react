import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { FOLLOW } from "../types";

export async function getFollowings(): Promise<FOLLOW> {
  try {
    const followings = await apiClient.get("/users/myfollowings.json", {
      headers: addAuthHeaders(),
    });
    return followings.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
