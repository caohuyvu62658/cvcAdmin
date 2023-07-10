import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface InitialState {
  [table: string]: string[]
}
const initialState: InitialState = {
  "cookie_item": [],
  "cookie_adaccount": [],
  "cookie_business": [],
  "extension": [],
  "user": []
};
const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    toggleColumnHidden: (state, action: PayloadAction<{ table: string, column: string }>) => {
      const { table, column } = action.payload;
      const index = state[table].indexOf(column);
      if (index > -1) state[table].splice(index, 1);
      else state[table].push(column);
    }
  }
})
export const { toggleColumnHidden } = tableSlice.actions;
export default tableSlice.reducer;