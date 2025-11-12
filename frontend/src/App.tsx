import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import CourseWatch from "./pages/CourseWatch";
import MyCourses from "./pages/MyCourses";
import LearningPaths from "./pages/LearningPaths";

import ProtectedRoute from "./components/ProtectedRoute";

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CourseManagement from "./pages/admin/CourseManagement";
import EnrollmentManagement from "./pages/admin/EnrollmentManagement";
import CourseImport from "./pages/admin/CourseImport";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Special routes without Layout */}
            <Route path="/course/:id/watch" element={<CourseWatch />} />

            {/* Admin routes with AdminLayout */}
            <Route
              path="/admin/*"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="import" element={<CourseImport />} />
              <Route
                path="users"
                element={<div>User Management - Coming Soon</div>}
              />
              <Route path="enrollments" element={<EnrollmentManagement />} />
              <Route
                path="analytics"
                element={<div>Analytics - Coming Soon</div>}
              />
            </Route>

            {/* Other routes with Layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/learning-paths" element={<LearningPaths />} />

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-courses" element={<MyCourses />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
