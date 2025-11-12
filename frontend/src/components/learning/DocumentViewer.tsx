import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Download,
  PictureAsPdf,
  Description,
  CheckCircle,
  OpenInNew,
  Visibility,
} from "@mui/icons-material";
import { LessonContent } from "../../types";

interface DocumentViewerProps {
  content: LessonContent;
  onComplete?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  content,
  onComplete,
}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [downloadError, setDownloadError] = useState<string>("");

  const handleDownload = async () => {
    if (!content.documentUrl) {
      setDownloadError("Không tìm thấy đường dẫn tài liệu");
      return;
    }

    try {
      setDownloadError("");

      // Create download link
      const link = document.createElement("a");
      link.href = content.documentUrl;
      link.download = content.contentTitle || "document";
      link.target = "_blank";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloaded(true);
      onComplete?.();
    } catch (error) {
      setDownloadError("Không thể tải xuống tài liệu. Vui lòng thử lại.");
    }
  };

  const handleView = () => {
    if (content.documentUrl) {
      window.open(content.documentUrl, "_blank");
      setIsViewing(true);
      onComplete?.();
    }
  };

  const getFileIcon = () => {
    const fileType = content.fileType?.toLowerCase();

    if (fileType?.includes("pdf")) {
      return <PictureAsPdf sx={{ fontSize: 40, color: "error.main" }} />;
    }
    if (fileType?.includes("doc") || fileType?.includes("docx")) {
      return <Description sx={{ fontSize: 40, color: "primary.main" }} />;
    }
    if (fileType?.includes("ppt") || fileType?.includes("pptx")) {
      return <Description sx={{ fontSize: 40, color: "warning.main" }} />;
    }
    if (fileType?.includes("xls") || fileType?.includes("xlsx")) {
      return <Description sx={{ fontSize: 40, color: "success.main" }} />;
    }

    return <Description sx={{ fontSize: 40, color: "primary.main" }} />;
  };

  const getFileTypeLabel = () => {
    const fileType = content.fileType?.toUpperCase();
    if (fileType) return fileType;

    // Try to determine from URL extension
    if (content.documentUrl) {
      const extension = content.documentUrl.split(".").pop()?.toUpperCase();
      return extension || "DOCUMENT";
    }

    return "DOCUMENT";
  };

  const canPreview = content.fileType?.toLowerCase().includes("pdf");

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
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          {content.contentTitle}
        </Typography>

        {/* File Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {getFileIcon()}
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {content.contentTitle}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                <Chip label={getFileTypeLabel()} size="small" color="primary" />
                {content.fileSize && (
                  <Chip
                    label={content.fileSize}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Status Indicators */}
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            {isDownloaded && (
              <Chip
                icon={<CheckCircle />}
                label="Đã tải xuống"
                color="success"
                size="small"
              />
            )}
            {isViewing && (
              <Chip
                icon={<Visibility />}
                label="Đã xem"
                color="info"
                size="small"
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* PDF Preview */}
      {canPreview && content.documentUrl && (
        <Box sx={{ height: 500, position: "relative" }}>
          <iframe
            src={`${content.documentUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title={content.contentTitle}
            onLoad={() => setIsViewing(true)}
          />

          {/* Overlay for external link */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Tooltip title="Mở trong tab mới">
              <IconButton
                onClick={handleView}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                }}
                size="small"
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Content Description */}
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            📄 Tài liệu này chứa thông tin quan trọng cho bài học.
            {canPreview
              ? " Bạn có thể xem trước ở trên hoặc tải xuống để xem offline."
              : " Tải xuống để xem nội dung chi tiết."}
          </Typography>
        </Alert>

        {downloadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {downloadError}
          </Alert>
        )}
      </Box>

      {/* Footer Actions */}
      <Divider />
      <Box sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          {canPreview && (
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handleView}
              disabled={!content.documentUrl}
            >
              Xem tài liệu
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={!content.documentUrl}
          >
            Tải xuống
          </Button>

          {(isDownloaded || isViewing) && (
            <Button
              variant="outlined"
              startIcon={<CheckCircle />}
              color="success"
              disabled
            >
              Đã hoàn thành
            </Button>
          )}
        </Box>

        {(isDownloaded || isViewing) && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            ✅ Bạn đã hoàn thành nội dung này
          </Typography>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          💡 Mẹo: Tải xuống tài liệu để tham khảo sau này khi không có internet
        </Typography>
      </Box>
    </Paper>
  );
};

export default DocumentViewer;
