import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./UserMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debug log
  console.log("🏠 Layout: Current user state:", user);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer", mr: 4 }}
            onClick={() => navigate("/")}
          >
            Khóa Học Online
          </Typography>

          {/* Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            <Button color="inherit" onClick={() => navigate("/courses")}>
              Khóa học
            </Button>
            <Button color="inherit" onClick={() => navigate("/learning-paths")}>
              Lộ trình học
            </Button>
            {user && (
              <Button color="inherit" onClick={() => navigate("/my-courses")}>
                Khóa học của tôi
              </Button>
            )}
          </Box>

          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Đăng Nhập
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Đăng Ký
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
