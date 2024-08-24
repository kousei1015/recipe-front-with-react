import apiClient from "./apiClient";
import { addAuthHeaders } from "./addAuthHeader";
import { FOLLOW } from "../types";

export async function getFollowers(): Promise<FOLLOW> {
  try {
    const followers = await apiClient.get("/users/myfollowers.json", {
      headers: addAuthHeaders(),
    });
    return followers.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
