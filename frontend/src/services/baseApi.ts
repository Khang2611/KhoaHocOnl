import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create base API instance with common configuration
export const createApiInstance = (customConfig = {}) => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    ...customConfig,
  });

  // Request interceptor để thêm token vào header
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor để xử lý lỗi authentication
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        const currentPath = window.location.pathname;
        const hasToken = localStorage.getItem("token");

        // Only redirect if user was previously authenticated and not on auth pages
        if (
          hasToken &&
          !currentPath.includes("/login") &&
          !currentPath.includes("/register")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else if (error.response?.status === 403) {
        console.error("Access denied - insufficient permissions");
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Default API instance
export const baseApi = createApiInstance();
