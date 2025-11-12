import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Chip, Divider } from "@mui/material";
import { CheckCircle, Schedule, MenuBook } from "@mui/icons-material";
import { LessonContent } from "../../types";

interface TextContentProps {
  content: LessonContent;
  onComplete?: () => void;
}

const TextContent: React.FC<TextContentProps> = ({ content, onComplete }) => {
  const [isRead, setIsRead] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    // Calculate reading time based on content length
    if (content.textContent) {
      const wordCount = content.textContent
        .replace(/<[^>]*>/g, "")
        .split(/\s+/).length;
      const estimatedTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      setReadingTime(content.estimatedReadTime || estimatedTime);
    }
  }, [content.textContent, content.estimatedReadTime]);

  const handleMarkAsRead = () => {
    setIsRead(true);
    onComplete?.();
  };

  // Clean and format HTML content
  const formatContent = (htmlContent: string) => {
    return htmlContent
      .replace(/\n\s*\n/g, "\n") // Remove extra line breaks
      .trim();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 3,
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MenuBook color="primary" />
            <Typography variant="h5" fontWeight="bold">
              {content.contentTitle}
            </Typography>
          </Box>

          <Chip
            icon={<Schedule />}
            label={`${readingTime} phút đọc`}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              fontWeight: "bold",
              mt: 3,
              mb: 2,
              color: "text.primary",
              "&:first-of-type": { mt: 0 },
            },
            "& h1": { fontSize: "2rem" },
            "& h2": { fontSize: "1.75rem", color: "primary.main" },
            "& h3": { fontSize: "1.5rem" },
            "& h4": { fontSize: "1.25rem" },
            "& p": {
              mb: 2,
              lineHeight: 1.8,
              fontSize: "1.1rem",
              color: "text.primary",
            },
            "& ul, & ol": {
              pl: 3,
              mb: 2,
              "& li": {
                mb: 1,
                lineHeight: 1.6,
              },
            },
            "& ul": {
              listStyleType: "disc",
            },
            "& ol": {
              listStyleType: "decimal",
            },
            "& strong": {
              fontWeight: "bold",
              color: "text.primary",
            },
            "& em": {
              fontStyle: "italic",
            },
            "& code": {
              bgcolor: "grey.100",
              color: "error.main",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: "0.9em",
            },
            "& pre": {
              bgcolor: "grey.900",
              color: "common.white",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: "0.9rem",
              lineHeight: 1.5,
              mb: 2,
              "& code": {
                bgcolor: "transparent",
                color: "inherit",
                p: 0,
              },
            },
            "& blockquote": {
              borderLeft: "4px solid",
              borderColor: "primary.main",
              bgcolor: "primary.50",
              p: 2,
              m: 0,
              mb: 2,
              fontStyle: "italic",
              "& p": {
                mb: 0,
              },
            },
            "& a": {
              color: "primary.main",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "none",
              },
            },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              mb: 2,
              "& th, & td": {
                border: "1px solid",
                borderColor: "divider",
                p: 1,
                textAlign: "left",
              },
              "& th": {
                bgcolor: "grey.100",
                fontWeight: "bold",
              },
            },
          }}
          dangerouslySetInnerHTML={{
            __html: formatContent(content.textContent || ""),
          }}
        />
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
        <Button
          variant={isRead ? "outlined" : "contained"}
          startIcon={isRead ? <CheckCircle /> : <MenuBook />}
          onClick={handleMarkAsRead}
          disabled={isRead}
          size="large"
          sx={{
            minWidth: 200,
            ...(isRead && {
              color: "success.main",
              borderColor: "success.main",
            }),
          }}
        >
          {isRead ? "Đã đọc xong" : "Đánh dấu đã đọc"}
        </Button>

        {isRead && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            ✅ Bạn đã hoàn thành nội dung này
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TextContent;
