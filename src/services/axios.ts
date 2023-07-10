import axios from "axios";
import { API_BASE_URL, API_PREFIX } from "../configs";
const axiosAuthInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_PREFIX}`,
  headers: {
    "content-type": "application/json"
  },
});
axiosAuthInstance.interceptors.request.use(async (config: any) => {
  const jwtToken = localStorage.getItem("token");
  if (jwtToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${jwtToken}`,
    }
  }
  return config;
});
axiosAuthInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  throw error;
});
export default axiosAuthInstance;