import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  PlayCircleOutline,
  CheckCircle,
} from "@mui/icons-material";
import { CourseSection, CourseProgress } from "../../types";
import LessonItem from "./LessonItem";

interface SectionAccordionProps {
  section: CourseSection;
  progress: CourseProgress;
  onLessonSelect: (lessonId: number) => void;
  currentLessonId?: number;
  defaultExpanded?: boolean;
}

const SectionAccordion: React.FC<SectionAccordionProps> = ({
  section,
  progress,
  onLessonSelect,
  currentLessonId,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Calculate section progress
  const completedLessonsInSection = section.lessons.filter((lesson) =>
    progress.completedLessons.includes(lesson.lessonId)
  ).length;

  const sectionProgress =
    section.lessons.length > 0
      ? (completedLessonsInSection / section.lessons.length) * 100
      : 0;

  const isCurrentSectionActive = section.lessons.some(
    (lesson) => lesson.lessonId === currentLessonId
  );

  // Auto-expand if current lesson is in this section
  React.useEffect(() => {
    if (isCurrentSectionActive && !expanded) {
      setExpanded(true);
    }
  }, [isCurrentSectionActive, expanded]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const getSectionIcon = () => {
    if (sectionProgress === 100) {
      return <CheckCircle color="success" sx={{ mr: 1 }} />;
    }
    return <PlayCircleOutline color="primary" sx={{ mr: 1 }} />;
  };

  const getProgressColor = ():
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    if (sectionProgress === 100) return "success";
    if (sectionProgress > 0) return "primary";
    return "default";
  };

  const getLinearProgressColor = ():
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    if (sectionProgress === 100) return "success";
    if (sectionProgress > 0) return "primary";
    return "inherit";
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        mb: 1,
        "&:before": { display: "none" },
        border: isCurrentSectionActive ? "2px solid" : "1px solid",
        borderColor: isCurrentSectionActive ? "primary.main" : "divider",
        borderRadius: "8px !important",
        "&.Mui-expanded": {
          margin: "0 0 8px 0",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: isCurrentSectionActive ? "primary.50" : "transparent",
          "&:hover": {
            bgcolor: isCurrentSectionActive ? "primary.100" : "grey.50",
          },
        }}
      >
        <Box sx={{ width: "100%", pr: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              {getSectionIcon()}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: isCurrentSectionActive ? "primary.main" : "inherit",
                }}
              >
                {section.sectionTitle}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`${completedLessonsInSection}/${section.lessons.length}`}
                size="small"
                color={getProgressColor()}
                variant={sectionProgress > 0 ? "filled" : "outlined"}
              />
              <Typography variant="body2" color="text.secondary">
                {section.estimatedDuration} phút
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={sectionProgress}
            color={getLinearProgressColor()}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              mb: section.description ? 1 : 0,
            }}
          />

          {/* Description */}
          {section.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontStyle: "italic",
              }}
            >
              {section.description}
            </Typography>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <List dense sx={{ width: "100%" }}>
          {section.lessons.map((lesson) => (
            <LessonItem
              key={lesson.lessonId}
              lesson={lesson}
              isCompleted={progress.completedLessons.includes(lesson.lessonId)}
              isCurrent={currentLessonId === lesson.lessonId}
              onSelect={() => onLessonSelect(lesson.lessonId)}
            />
          ))}
        </List>

        {/* Section Summary */}
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            📖 Chương này có {section.lessons.length} bài học • Thời gian ước
            tính: {section.estimatedDuration} phút
            {sectionProgress === 100 && " • ✅ Đã hoàn thành"}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SectionAccordion;
