import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  AccountCircle,
  Person,
  Settings,
  ExitToApp,
  School,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleClose();
  };

  if (!user) return null;

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<AccountCircle />}
        sx={{
          color: "white",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
          {user.fullName?.charAt(0)?.toUpperCase() ||
            user.userName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {user.fullName || user.userName}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {user.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 250,
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              {user.fullName?.charAt(0)?.toUpperCase() ||
                user.userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {user.fullName || user.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem onClick={handleProfile}>
          <Person sx={{ mr: 1 }} />
          Thông tin cá nhân
        </MenuItem>

        {user.role === "ADMIN" && (
          <MenuItem
            onClick={() => {
              navigate("/admin");
              handleClose();
            }}
          >
            <Settings sx={{ mr: 1 }} />
            Quản lý khóa học
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ExitToApp sx={{ mr: 1 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
