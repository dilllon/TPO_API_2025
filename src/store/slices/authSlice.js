import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userName: null,
  imageUrl: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userName, imageUrl } = action.payload;
      state.isLoggedIn = true;
      state.userName = userName;
      state.imageUrl = imageUrl;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = null;
      state.imageUrl = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
