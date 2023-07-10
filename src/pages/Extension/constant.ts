import api from "../../services/extension";
export const ITEM_NAME = "Checkout page";
export const SEARCH_COLUMNS: string[] = ["name", "description"];
export const API = api;
export interface ExtensionState {
  _id?: string,
  name?: string,
  url?: string,
  token?: string,
  timeout?: number,
  timeout2?: number,
  Task?: number
}