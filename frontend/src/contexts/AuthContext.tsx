import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, LoginRequest, RegisterRequest } from "../types";
import { authAPI, userAPI } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user info
  const fetchUserInfo = async (authToken: string) => {
    try {
      const userData = await userAPI.getMyInfo();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("👤 AuthContext: User info fetched:", userData);
    } catch (error: any) {
      console.error("Error fetching user info:", error);
      // If fetch fails due to 401/403 (token expired/invalid), clear token
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(
          "🔒 AuthContext: Token expired/invalid, clearing auth state"
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          // If stored user is invalid, fetch fresh user info
          fetchUserInfo(storedToken);
        }
      } else {
        // If no stored user but have token, fetch user info
        fetchUserInfo(storedToken);
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      console.log("🔐 AuthContext: Attempting login...");
      const response = await authAPI.login(data);
      console.log("✅ AuthContext: API response:", response);

      if (!response.token) {
        throw new Error("No token in response");
      }

      // Save token to localStorage and state
      setToken(response.token);
      localStorage.setItem("token", response.token);

      // Fetch user info after successful login
      await fetchUserInfo(response.token);

      console.log("💾 AuthContext: Login completed successfully");
    } catch (error) {
      console.error("❌ AuthContext: Login failed:", error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authAPI.register(data);
      // Sau khi đăng ký thành công, tự động đăng nhập
      await login({ userName: data.userName, password: data.password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
