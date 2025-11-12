import React from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {user
            ? `Chào mừng trở lại, ${user.fullName || user.userName}!`
            : "Chào mừng đến với Khóa Học Online"}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {user
            ? "Tiếp tục hành trình học tập của bạn"
            : "Nền tảng học tập trực tuyến hàng đầu Việt Nam"}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/courses")}
          >
            {user ? "Xem khóa học" : "Khám phá khóa học"}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/learning-paths")}
          >
            Lộ trình học tập
          </Button>
        </Box>
      </Box>

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

export default Home;
