import axios from "axios";

export const apiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL;

  console.log(apiUrl)
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Accept": "application/json"
  }
});

export default apiClient;
