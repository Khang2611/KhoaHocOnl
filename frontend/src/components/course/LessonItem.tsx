import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  PlayArrow,
  CheckCircle,
  VideoLibrary,
  Article,
  Description,
  Image,
  Quiz,
} from "@mui/icons-material";
import { Lesson } from "../../types";

interface LessonItemProps {
  lesson: Lesson;
  isCompleted: boolean;
  isCurrent: boolean;
  onSelect: () => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  isCompleted,
  isCurrent,
  onSelect,
}) => {
  // Get content type icons and counts
  const getContentInfo = () => {
    if (!lesson.contents || lesson.contents.length === 0) {
      return {
        icon: <Article sx={{ fontSize: 16 }} />,
        types: ["Nội dung"],
        count: 1,
      };
    }

    const contentTypes = lesson.contents.reduce((acc, content) => {
      acc[content.contentType] = (acc[content.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeLabels = [];
    let primaryIcon = <Article sx={{ fontSize: 16 }} />;

    if (contentTypes.VIDEO) {
      typeLabels.push(`${contentTypes.VIDEO} video`);
      primaryIcon = <VideoLibrary sx={{ fontSize: 16 }} />;
    }
    if (contentTypes.TEXT) {
      typeLabels.push(`${contentTypes.TEXT} bài đọc`);
      if (!contentTypes.VIDEO) primaryIcon = <Article sx={{ fontSize: 16 }} />;
    }
    if (contentTypes.DOCUMENT) {
      typeLabels.push(`${contentTypes.DOCUMENT} tài liệu`);
      if (!contentTypes.VIDEO && !contentTypes.TEXT)
        primaryIcon = <Description sx={{ fontSize: 16 }} />;
    }
    if (contentTypes.IMAGE) {
      typeLabels.push(`${contentTypes.IMAGE} hình ảnh`);
      if (!contentTypes.VIDEO && !contentTypes.TEXT && !contentTypes.DOCUMENT) {
        primaryIcon = <Image sx={{ fontSize: 16 }} />;
      }
    }

    return {
      icon: primaryIcon,
      types: typeLabels,
      count: lesson.contents.length,
    };
  };

  const contentInfo = getContentInfo();

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}p`
      : `${hours} giờ`;
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isCurrent}
        onClick={onSelect}
        sx={{
          borderRadius: 1,
          mb: 0.5,
          border: isCurrent ? "2px solid" : "1px solid transparent",
          borderColor: isCurrent ? "primary.main" : "transparent",
          bgcolor: isCompleted ? "success.50" : "transparent",
          "&.Mui-selected": {
            bgcolor: isCurrent ? "primary.50" : "success.50",
          },
          "&:hover": {
            bgcolor: isCurrent
              ? "primary.100"
              : isCompleted
              ? "success.100"
              : "grey.50",
          },
          transition: "all 0.2s ease",
        }}
      >
        <ListItemIcon>
          {isCompleted ? (
            <CheckCircle color="success" />
          ) : (
            <PlayArrow color="primary" />
          )}
        </ListItemIcon>

        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: isCompleted ? "line-through" : "none",
                  opacity: isCompleted ? 0.8 : 1,
                  fontWeight: isCurrent ? "bold" : "normal",
                  color: isCurrent ? "primary.main" : "inherit",
                }}
              >
                {lesson.lessonTitle}
              </Typography>

              {/* Content type icon */}
              <Tooltip title={contentInfo.types.join(", ")}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                  }}
                >
                  {contentInfo.icon}
                </Box>
              </Tooltip>

              {/* Quiz indicator */}
              {lesson.quiz && (
                <Tooltip title="Có bài quiz">
                  <Quiz sx={{ fontSize: 16, color: "warning.main" }} />
                </Tooltip>
              )}
            </Box>
          }
          secondary={
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                {formatDuration(lesson.estimatedDuration)}
              </Typography>

              <Chip
                label={`${contentInfo.count} nội dung`}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  borderColor: isCurrent ? "primary.main" : "divider",
                }}
              />

              {lesson.description && (
                <Tooltip title={lesson.description}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lesson.description}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          }
        />

        {/* Status indicator */}
        <Box sx={{ ml: 1 }}>
          {isCompleted && (
            <Chip
              label="Hoàn thành"
              size="small"
              color="success"
              sx={{ fontSize: "0.7rem", height: 24 }}
            />
          )}
          {isCurrent && !isCompleted && (
            <Chip
              label="Đang học"
              size="small"
              color="primary"
              sx={{ fontSize: "0.7rem", height: 24 }}
            />
          )}
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default LessonItem;
