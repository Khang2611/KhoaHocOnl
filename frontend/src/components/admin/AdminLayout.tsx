import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard,
  School,
  People,
  Assignment,
  Analytics,
  ExitToApp,
  AdminPanelSettings,
  AccountCircle,
  Upload,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 280;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { text: "Course Management", icon: <School />, path: "/admin/courses" },
    { text: "Import Courses", icon: <Upload />, path: "/admin/import" },
    { text: "User Management", icon: <People />, path: "/admin/users" },
    {
      text: "Enrollment Management",
      icon: <Assignment />,
      path: "/admin/enrollments",
    },
    { text: "Analytics", icon: <Analytics />, path: "/admin/analytics" },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleMenuClose();
  };

  const handleBackToUser = () => {
    navigate("/");
    handleMenuClose();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#1a1a1a",
          borderBottom: "1px solid #333",
        }}
      >
        <Toolbar>
          <Badge
            badgeContent="ADMIN"
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.6rem",
                height: "16px",
                minWidth: "16px",
              },
            }}
          >
            <AdminPanelSettings sx={{ mr: 2, color: "#ff6b35" }} />
          </Badge>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            Admin Dashboard
          </Typography>

          <Typography variant="body2" sx={{ mr: 2, color: "#ccc" }}>
            Welcome, {user?.fullName || user?.userName}
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleBackToUser}>
              <ListItemIcon>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              Back to User View
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#2d2d2d",
            color: "white",
            borderRight: "1px solid #444",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ bgcolor: "#1a1a1a", borderBottom: "1px solid #444" }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <AdminPanelSettings sx={{ mr: 2, color: "#ff6b35" }} />
            <Typography
              variant="h6"
              noWrap
              sx={{ color: "#ff6b35", fontWeight: "bold" }}
            >
              KhoaHocOnline
            </Typography>
          </Box>
        </Toolbar>

        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "#ff6b35",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#e55a2b",
                    },
                  },
                  "&:hover": {
                    bgcolor: "#404040",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Footer info */}
        <Box sx={{ p: 2, borderTop: "1px solid #444", bgcolor: "#1a1a1a" }}>
          <Typography
            variant="caption"
            sx={{ color: "#888", display: "block" }}
          >
            Admin Panel v1.0
          </Typography>
          <Typography variant="caption" sx={{ color: "#888" }}>
            Logged in as: {user?.role}
          </Typography>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
