import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  username: string,
  permission: "admin" | "user"
}
interface InitialState {
  isAuthenticated?: boolean,
  token?: string,
  user?: UserState,
  error?: string
}
const initialState: InitialState = {
  isAuthenticated: false,
  token: '',
  error: undefined,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<InitialState>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token || "");
    },
    loginFailed: (state, action: PayloadAction<InitialState>) => {
      state.isAuthenticated = false;
      state.user = undefined;
      state.error = action.payload.error;
      localStorage.removeItem("token");
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.error = undefined;
      state.user = undefined;
      localStorage.removeItem("token");
    }
  }
})
export const { loginSuccess, loginFailed, logoutUser } = authSlice.actions;
export default authSlice.reducer;