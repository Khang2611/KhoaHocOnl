import React from "react";
import { Box, Typography } from "@mui/material";
import { CourseSection, CourseProgress } from "../../types";
import SectionAccordion from "./SectionAccordion";
import ProgressIndicator from "./ProgressIndicator";

interface CourseStructureProps {
  sections: CourseSection[];
  progress: CourseProgress;
  onLessonSelect: (lessonId: number) => void;
  currentLessonId?: number;
  showProgress?: boolean;
}

const CourseStructure: React.FC<CourseStructureProps> = ({
  sections,
  progress,
  onLessonSelect,
  currentLessonId,
  showProgress = true,
}) => {
  const totalLessons = sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );
  const completedLessons = progress.completedLessons.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (!sections || sections.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Chưa có nội dung khóa học
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Nội dung sẽ được cập nhật sớm
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Overall Progress */}
      {showProgress && (
        <ProgressIndicator
          progress={progressPercentage}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
        />
      )}

      {/* Course Title */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, mt: showProgress ? 2 : 0 }}
      >
        Nội dung khóa học
      </Typography>

      {/* Sections */}
      {sections.map((section) => (
        <SectionAccordion
          key={section.sectionId}
          section={section}
          progress={progress}
          onLessonSelect={onLessonSelect}
          currentLessonId={currentLessonId}
        />
      ))}

      {/* Summary */}
      <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          📚 Tổng cộng: {sections.length} chương • {totalLessons} bài học •
          {sections.reduce(
            (acc, section) => acc + section.estimatedDuration,
            0
          )}{" "}
          phút
        </Typography>
      </Box>
    </Box>
  );
};

export default CourseStructure;
