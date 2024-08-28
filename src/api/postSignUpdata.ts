import { SignUpProps } from "../types";
import apiClient from "./apiClient";

export const postSignUpData = async (data: SignUpProps) => {
  const res = await apiClient.post("/auth", data);
  return res;
};
