import apiClient from "./apiClient";
import { FOLLOW } from "../types";

export async function getFollowersByUser(id: string): Promise<FOLLOW> {
  try {
    const followers = await apiClient.get(`/users/${id}/followers.json`);
    return followers.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
