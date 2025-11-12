import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Person,
  Edit,
  School,
  CheckCircle,
  AccessTime,
  Cancel,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { User, UserUpdateRequest } from "../types";
import { userAPI } from "../services/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  const [allEnrollments, setAllEnrollments] = useState<any[]>([]);

  const [formData, setFormData] = useState<UserUpdateRequest>({
    fullName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userAPI.getMyInfo();
        setUser(userData);
        setFormData({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
        });

        // Fetch all enrollments
        try {
          const allEnrollmentsData = await userAPI.getAllEnrollments();
          setAllEnrollments(allEnrollmentsData);
        } catch (err) {
          console.error("Không thể tải khóa học đã đăng ký:", err);
          setAllEnrollments([]);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Không thể tải thông tin người dùng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await userAPI.updateUser(formData);
      setSuccess("Cập nhật thông tin thành công");
      // Refresh user info
      const userData = await userAPI.getMyInfo();
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Cập nhật thông tin thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thông Tin Cá Nhân
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<Person />} label="Thông tin cá nhân" />
              <Tab icon={<School />} label="Khóa học của tôi" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.main",
                      fontSize: "3rem",
                    }}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() ||
                      user?.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {user?.fullName || user?.userName}
                  </Typography>
                  <Chip
                    label={
                      user?.role === "ADMIN" ? "Quản trị viên" : "Học viên"
                    }
                    color={user?.role === "ADMIN" ? "secondary" : "primary"}
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="userName"
                    label="Tên đăng nhập"
                    value={user?.userName || ""}
                    disabled
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="role"
                    label="Vai trò"
                    value={
                      user?.role === "ADMIN" ? "Quản trị viên" : "Người dùng"
                    }
                    disabled
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="fullName"
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{ mt: 3 }}
                    disabled={saving}
                  >
                    {saving ? "Đang cập nhật..." : "Cập nhật thông tin"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Khóa học đã đăng ký
            </Typography>

            {allEnrollments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <School sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Bạn chưa đăng ký khóa học nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hãy khám phá các khóa học thú vị của chúng tôi
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/courses")}
                >
                  Xem khóa học
                </Button>
              </Box>
            ) : (
              <>
                <Box
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <School color="primary" />
                  <Typography variant="body1">
                    Bạn có <strong>{allEnrollments.length}</strong> khóa học đã
                    đăng ký
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {allEnrollments.map((enrollment) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={enrollment.enrollmentId}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border:
                            enrollment.status === "PENDING"
                              ? "2px solid orange"
                              : enrollment.status === "APPROVED"
                              ? "2px solid green"
                              : "2px solid red",
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {enrollment.course.courseTitle}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            paragraph
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {enrollment.course.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            {enrollment.status === "APPROVED" && (
                              <>
                                <CheckCircle color="success" fontSize="small" />
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                >
                                  Đã thanh toán
                                </Typography>
                              </>
                            )}
                            {enrollment.status === "PENDING" && (
                              <>
                                <AccessTime color="warning" fontSize="small" />
                                <Typography
                                  variant="body2"
                                  color="warning.main"
                                >
                                  Đang chờ thanh toán
                                </Typography>
                              </>
                            )}
                            {enrollment.status === "REJECTED" && (
                              <>
                                <Cancel color="error" fontSize="small" />
                                <Typography variant="body2" color="error.main">
                                  Đã bị từ chối
                                </Typography>
                              </>
                            )}
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Giảng viên:{" "}
                            {enrollment.course.createBy?.fullName ||
                              enrollment.course.createBy?.userName}
                          </Typography>

                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                          >
                            {enrollment.course.price
                              ? enrollment.course.price.toLocaleString("vi-VN")
                              : "0"}{" "}
                            VNĐ
                          </Typography>
                        </CardContent>

                        <CardActions
                          sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                        >
                          <Button
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(`/courses/${enrollment.course.courseId}`)
                            }
                          >
                            Xem chi tiết
                          </Button>
                          {enrollment.status === "APPROVED" &&
                            enrollment.course.urlVideo && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  window.open(
                                    enrollment.course.urlVideo,
                                    "_blank"
                                  )
                                }
                              >
                                Học ngay
                              </Button>
                            )}
                          {enrollment.status === "PENDING" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              onClick={() =>
                                navigate(
                                  `/courses/${enrollment.course.courseId}`
                                )
                              }
                            >
                              Hoàn tất thanh toán
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
