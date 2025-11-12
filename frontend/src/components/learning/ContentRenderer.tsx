import React, { Suspense } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { LessonContent } from "../../types";

// Lazy load content components for better performance
const TextContent = React.lazy(() => import("./TextContent"));
const VideoPlayerEmbed = React.lazy(() => import("./VideoPlayerEmbed"));
const DocumentViewer = React.lazy(() => import("./DocumentViewer"));

interface ContentRendererProps {
  content: LessonContent;
  onContentComplete?: (contentId: number) => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  onContentComplete,
}) => {
  if (!content) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Nội dung không khả dụng. Vui lòng thử lại sau.
      </Alert>
    );
  }

  const renderContent = () => {
    switch (content.contentType) {
      case "TEXT":
        return (
          <TextContent
            content={content}
            onComplete={() => onContentComplete?.(content.contentId)}
          />
        );
      case "VIDEO":
        return (
          <VideoPlayerEmbed
            videoUrl={content.videoUrl || ""}
            title={content.contentTitle}
            onVideoComplete={() => onContentComplete?.(content.contentId)}
          />
        );
      case "DOCUMENT":
        return (
          <DocumentViewer
            content={content}
            onComplete={() => onContentComplete?.(content.contentId)}
          />
        );
      case "IMAGE":
        return (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src={content.imageUrl}
              alt={content.contentTitle}
              sx={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 2,
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => {
                // Open image in new tab for full view
                if (content.imageUrl) {
                  window.open(content.imageUrl, "_blank");
                }
              }}
            />
            {content.contentTitle && (
              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                >
                  {content.contentTitle}
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return (
          <Alert severity="error" sx={{ mb: 3 }}>
            Loại nội dung không được hỗ trợ: {content.contentType}
          </Alert>
        );
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        {renderContent()}
      </Suspense>
    </Box>
  );
};

export default ContentRenderer;
