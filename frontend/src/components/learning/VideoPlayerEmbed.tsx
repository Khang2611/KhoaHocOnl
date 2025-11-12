import React, { useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { PlayCircleOutline, OpenInNew } from "@mui/icons-material";

interface VideoPlayerEmbedProps {
  videoUrl: string;
  title: string;
  onVideoComplete?: () => void;
}

const VideoPlayerEmbed: React.FC<VideoPlayerEmbedProps> = ({
  videoUrl,
  title,
  onVideoComplete,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // If already embed URL, return as is
    if (url.includes("/embed/")) {
      // Add additional parameters for better embedding
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}enablejsapi=1&origin=${encodeURIComponent(
        window.location.origin
      )}&rel=0&modestbranding=1`;
    }

    // Convert YouTube watch URL to embed
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(
        window.location.origin
      )}&rel=0&modestbranding=1`;
    }

    // Convert youtu.be URL to embed
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(
        window.location.origin
      )}&rel=0&modestbranding=1`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    // Simulate video completion after 3 seconds for demo
    setTimeout(() => {
      onVideoComplete?.();
    }, 3000);
  };

  const handleIframeError = () => {
    setHasError(true);
  };

  const openInYouTube = () => {
    // Convert embed URL back to watch URL for opening
    let watchUrl = videoUrl;
    if (videoUrl.includes("/embed/")) {
      const videoId = videoUrl.split("/embed/")[1]?.split("?")[0];
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    window.open(watchUrl, "_blank");
  };

  if (hasError || !embedUrl) {
    return (
      <Box
        sx={{
          position: "relative",
          height: 300,
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.100",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          borderColor: "grey.300",
        }}
      >
        <PlayCircleOutline sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Video không thể tải
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center", px: 2 }}
        >
          Video có thể bị hạn chế embed hoặc có vấn đề kết nối
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={openInYouTube}
            startIcon={<OpenInNew />}
          >
            Xem trên YouTube
          </Button>
          <Button variant="outlined" onClick={() => onVideoComplete?.()}>
            Đánh dấu đã xem
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {!isLoaded && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Đang tải video... Nếu video không hiển thị, hãy thử tải lại trang hoặc
          xem trực tiếp trên YouTube.
        </Alert>
      )}

      <Box
        sx={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.100",
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Button
          variant="text"
          onClick={openInYouTube}
          startIcon={<OpenInNew />}
          size="small"
        >
          Xem trên YouTube
        </Button>

        <Button
          variant="outlined"
          onClick={() => onVideoComplete?.()}
          size="small"
        >
          Đánh dấu đã xem
        </Button>
      </Box>
    </Box>
  );
};

export default VideoPlayerEmbed;
