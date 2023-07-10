import axios from "./axios";
import ApiState, { ApiResponse } from "../typings/api";
import { UserState } from "../pages/User/constant";
import { AxiosResponse } from "axios";
const pathApi = "user";
interface UserApiState extends ApiState<UserState> {
  assignGoogle: (id: string, data: any) => Promise<AxiosResponse<ApiResponse<any>>>;
  all: () => Promise<AxiosResponse<ApiResponse<UserState[]>>>;
}
const api: UserApiState = {
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
  },
  assignGoogle: (id, data) => {
    const url = `/${pathApi}/assign/${id}`;
    return axios.post(url, data);
  }
};
export default api;