import { createSlice } from "@reduxjs/toolkit";

/**
 * Safely retrieve token from localStorage
 * @returns {string|null} The stored token or null
 */
const getStoredToken = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;