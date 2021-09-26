import axios from "axios";
import { API_PREFIX } from "@env";

const authService = {
  get: async (endpoint, token) => {
    try {
      const response = await axios.get(`${API_PREFIX}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  create: async (endpoint, token, obj) => {
    try {
      const response = await axios.post(`${API_PREFIX}${endpoint}`, obj, {
        timeout: 1000 * 15,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status <= 500;
        },
        onUploadProgress: (progressEvent) => {
          console.log("waiting");
        },
      });
      return response;
    } catch (error) {
      console.log(error.message);
    }
  },
  update: async (endpoint, token, obj) => {
    try {
      const response = await axios.put(`${API_PREFIX}${endpoint}`, obj, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        },
        onUploadProgress: (progressEvent) => {
          console.log("waiting");
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  remove: async (endpoint, token) => {
    try {
      const response = await axios.delete(`${API_PREFIX}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  authentication: async (account) => {
    try {
      console.log(API_PREFIX);
      const response = await axios.post(`${API_PREFIX}/auth/login`, account, {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
};

export default authService;
