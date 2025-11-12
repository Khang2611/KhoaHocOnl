import React from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const username = user?.fullName || user?.userName || "User";

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Chào mừng trở lại, {username}!
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Tiếp tục hành trình học tập của bạn
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/my-courses")}
          >
            Khóa học của tôi
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/courses")}
          >
            Khám phá khóa học
          </Button>
        </Box>
      </Box>

      {/* Course Cards */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Học mọi lúc mọi nơi
              </Typography>
              <Typography color="text.secondary">
                Truy cập khóa học 24/7 từ bất kỳ thiết bị nào
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Giảng viên chuyên nghiệp
              </Typography>
              <Typography color="text.secondary">
                Đội ngũ giảng viên giàu kinh nghiệm và tận tâm
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Chứng chỉ uy tín
              </Typography>
              <Typography color="text.secondary">
                Nhận chứng chỉ sau khi hoàn thành khóa học
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
