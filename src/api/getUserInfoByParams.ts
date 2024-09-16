import apiClient from "./apiClient";
type UserInfo = {
    id: string;
    name: string;
    avatar_url: string;
    followings_count: number;
    followers_count: number;
}

export async function getUserInfoByParams(id: string): Promise<UserInfo> {
  try {
    const followers = await apiClient.get(`/users/${id}.json`);
    return followers.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
