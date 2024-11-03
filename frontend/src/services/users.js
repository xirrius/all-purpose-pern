import axiosInstance from "../utils/axios";


export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error registering user");
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error logging in user");
  }
};

export const verifyUser = async () => {
  try {
    const response = await axiosInstance.get("/users/verify");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error verifying user");
  }
};
