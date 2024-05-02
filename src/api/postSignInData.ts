import axios from "axios";
import { SignInProps } from "../types";

export const postSignInData = async (data: SignInProps) => {
  const res = await axios.post("http://localhost:3000/v1/auth/sign_in", data);
  return res;
};
