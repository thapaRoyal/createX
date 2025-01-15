// authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "@/services/auth.service"; // Make sure this is correctly imported
import { AppDispatch } from "@/lib/store";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

// Async action using AppDispatch for correct typing
export const loginUser =
  (payload: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());
      const { accessToken, refreshToken } = await AuthService.login(payload);
      dispatch(loginSuccess({ accessToken, refreshToken }));
    } catch (error) {
      dispatch(loginFailure("Login failed!"));
    }
  };

export default authSlice.reducer;
