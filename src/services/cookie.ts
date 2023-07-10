import axios from "./axios";
import ApiState, { ApiResponse } from "../typings/api";
import { CookieState } from "../pages/Cookie/constant";
import { AxiosResponse } from "axios";
const pathApi = "cookie";
interface ProxyGroupApiState extends ApiState<CookieState> {
  all: () => Promise<AxiosResponse<ApiResponse<CookieState[]>>>;
}
const api: ProxyGroupApiState = {
  getAll: (data) => {
    const url = `/${pathApi}/ajax`;
    return axios.post(url, data);
  },
  addItem: (data) => {
    const url = `/${pathApi}/add`;
    return axios.post(url, data);
  },
  editItem: (id, data) => {
    const url = `/${pathApi}/edit/${id}`;
    return axios.post(url, data);
  },
  deleteItem: (id) => {
    const url = `/${pathApi}/delete/${id}`;
    return axios.post(url);
  },
  all: () => {
    const url = `/${pathApi}/all`;
    return axios.get(url);
  }
};
export default api;