import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPosts,
  createPost,
  editPost,
  deletePost,
  getPost,
} from "../../services/posts";

const initialState = {
  posts: { result: [], total: 0, user: null },
  selectedPost: null,
  loading: false,
  error: null,
};

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page, limit, sortBy, order, search, category }) => {
    const response = await getPosts({
      page,
      limit,
      sortBy,
      order,
      search,
      category,
    });
    return response; // Return the array of posts
  }
);

export const fetchPost = createAsyncThunk("posts/fetchPost", async (id) => {
  const response = await getPost(id);
  return response;
});

// Create a new post
export const createNewPost = createAsyncThunk(
  "posts/createPost",
  async (postData) => {
    const response = await createPost(postData);
    return response; // Return the created post
  }
);

// Edit an existing post
export const editExistingPost = createAsyncThunk(
  "posts/editPost",
  async ({ id, postData }) => {
    const response = await editPost(id, postData);
    return response; // Return the updated post
  }
);

// Delete a post
export const deleteExistingPost = createAsyncThunk(
  "posts/deletePost",
  async (id) => {
    await deletePost(id); // Perform the delete action
    return id; // Return the id of the deleted post
  }
);

// Post slice definition
export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload; // Set the currently selected post
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // Set the posts array
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle errors
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.posts.result.push(action.payload);
        state.posts.total += 1;
      })
      .addCase(editExistingPost.fulfilled, (state, action) => {
        const index = state.posts.result.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts.result[index] = action.payload;
        }
      })
      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        console.log("Deleting post with ID:", action.payload);
        state.posts.result = state.posts.result.filter(
          (post) => post.id !== action.payload
        );
        state.posts.total -= 1;
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
