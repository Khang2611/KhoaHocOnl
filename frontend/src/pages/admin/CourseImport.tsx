import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Upload, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { adminAPI } from "../../services/adminApi";

const CourseImport: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);
  const [jsonData, setJsonData] = useState<any[] | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setJsonData(Array.isArray(json) ? json : [json]);
        setResult(null);
      } catch (error) {
        setResult({
          success: false,
          message: "Invalid JSON file format",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonData) return;

    setLoading(true);
    try {
      const response = await adminAPI.importCourses(jsonData);
      setResult({
        success: true,
        message: response.message || "Import successful",
        count: jsonData.length,
      });

      // Auto redirect to Course Management after 2 seconds
      setTimeout(() => {
        navigate("/admin/courses");
      }, 2000);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || "Import failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseDefaultData = async () => {
    // Load default JSON from public folder
    try {
      const response = await fetch("/data/courses.json");
      const json = await response.json();
      setJsonData(json);
      setResult(null);
    } catch (error) {
      setResult({
        success: false,
        message:
          "Could not load default data. Make sure courses.json exists in public/data/",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Import Course Data
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload JSON File
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Upload a JSON file containing course data with objectives,
            curriculum, and prerequisites.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<Upload />}
              sx={{ bgcolor: "#ff6b35", "&:hover": { bgcolor: "#e55a2b" } }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleFileUpload}
              />
            </Button>

            <Button variant="outlined" onClick={handleUseDefaultData}>
              Use Default Data
            </Button>
          </Box>

          {jsonData && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Loaded {jsonData.length} course(s) from JSON
            </Alert>
          )}
        </CardContent>
      </Card>

      {jsonData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Paper
              sx={{
                maxHeight: 300,
                overflow: "auto",
                p: 2,
                bgcolor: "#f5f5f5",
              }}
            >
              <List dense>
                {jsonData.map((course, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`${course.courseId}. ${course.courseTitle}`}
                        secondary={`Price: ${course.price?.toLocaleString()} VND | Objectives: ${
                          course.learningObjectives?.length || 0
                        } | Curriculum: ${course.curriculum?.length || 0}`}
                      />
                    </ListItem>
                    {index < jsonData.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <CheckCircle />
                }
                sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
              >
                {loading ? "Importing..." : "Import to Database"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setJsonData(null);
                  setResult(null);
                }}
                disabled={loading}
              >
                Clear
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {result && (
        <Alert
          severity={result.success ? "success" : "error"}
          icon={result.success ? <CheckCircle /> : <ErrorIcon />}
        >
          <Typography variant="body1" fontWeight="bold">
            {result.message}
          </Typography>
          {result.count && (
            <Typography variant="body2">
              Successfully imported {result.count} courses. Redirecting to
              Course Management...
            </Typography>
          )}
        </Alert>
      )}
    </Box>
  );
};

export default CourseImport;
