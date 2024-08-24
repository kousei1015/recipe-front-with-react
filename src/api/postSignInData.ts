import { SignInProps } from "../types";
import apiClient from "./apiClient";

export const postSignInData = async (data: SignInProps) => {
  const res = await apiClient.post("/auth/sign_in", data);
  return res;
};
