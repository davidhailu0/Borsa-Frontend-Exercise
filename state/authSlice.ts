import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  token: string;
  user: Object;
};

const initialState: AuthState = {
  token: "",
  user: "",
};
const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
    register: (state: AuthState, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { login, register } = authSlice.actions;

export default authSlice.reducer;
