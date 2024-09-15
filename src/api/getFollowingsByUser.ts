import apiClient from "./apiClient";
import { FOLLOW } from "../types";

export async function getFollowingsByUser(id: string): Promise<FOLLOW> {
  try {
    const followers = await apiClient.get(`/users/${id}/followings.json`);
    return followers.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
