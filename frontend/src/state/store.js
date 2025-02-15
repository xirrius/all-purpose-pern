import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; 
import postsReducer from './posts/postSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer
  },
});

export default store;
