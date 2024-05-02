import axios from "axios";
import { SignUpProps } from "../types";

export const postSignUpData = async (data: SignUpProps) => {
  const res = await axios.post("http://localhost:3000/v1/auth/sign_up", data);
  return res;
};
