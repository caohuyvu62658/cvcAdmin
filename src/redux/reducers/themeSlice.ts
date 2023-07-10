import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface InitialState {
  isDark: boolean,
  isDarkMenu: boolean,
  colorPrimary: string,
  borderRadius: number,
  isMobile: boolean
}
const initialState: InitialState = {
  colorPrimary: "#1677FF",
  isDark: false,
  isDarkMenu: true,
  borderRadius: 0,
  isMobile: false
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDark: (state) => {
      state.isDark = !state.isDark;
    },
    toggleDarkMenu: (state) => {
      state.isDarkMenu = !state.isDarkMenu;
    },
    setColorPrimary: (state, action: PayloadAction<string>) => {
      state.colorPrimary = action.payload;
    },
    setBorderRadius: (state, action: PayloadAction<number>) => {
      state.borderRadius = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    reset: (state) => {
      state = initialState;
    }
  }
})
export const { toggleDark, toggleDarkMenu, setColorPrimary, setBorderRadius, setIsMobile, reset } = themeSlice.actions;
export default themeSlice.reducer;