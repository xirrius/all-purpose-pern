import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verifyUser } from "../../services/users";

const initialState = {
  user: null, 
  isAuthenticated: false,
  loading: true,
};

export const verifyUserAuth = createAsyncThunk(
  "user/verifyUserAuth",
  async () => {
    const response = await verifyUser();
    return response.user; 
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload; 
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
        state.loading = false;
      })
      .addCase(verifyUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
