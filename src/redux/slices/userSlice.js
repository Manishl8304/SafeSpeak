import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    userInfo: null,
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
