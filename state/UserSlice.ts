import { createSlice } from "@reduxjs/toolkit";
import User from "../interfaces/User";
import type { PayloadAction } from "@reduxjs/toolkit";
const initialState: User[] = [];
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    fetchUsersSuccess: (state: User[], action: PayloadAction<User[]>) => {
      state = [...state,...action.payload];
      return state;
    },
  },
});

export const { fetchUsersSuccess } = userSlice.actions;
export default userSlice.reducer;
