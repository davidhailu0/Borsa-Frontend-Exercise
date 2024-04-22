import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState:{},
  reducers: {
    login: (state: Object, action: PayloadAction<Object>) => {
      return { ...state, ...action.payload };
    },
    register: (state: Object, action: PayloadAction<Object>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { login, register } = authSlice.actions;

export default authSlice.reducer;
