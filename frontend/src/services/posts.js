import axiosInstance from "../utils/axios";

export const getPosts = async ({
  page,
  limit,
  sortBy,
  order,
  search,
  category,
}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      sortBy,
      order,
      search,
      category,
    }).toString();
    const response = await axiosInstance.get(`/posts?${queryParams}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching posts");
  }
};

export const getPost = async (id) => {
  try {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching post");
  }
};

export const createPost = async (postData) => {
  try {
    console.log(postData);

    const response = await axiosInstance.post("/posts", postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error creating post");
  }
};

export const editPost = async (id, postData) => {
  try {
    const response = await axiosInstance.put(`/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error editing post");
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting post");
  }
};
