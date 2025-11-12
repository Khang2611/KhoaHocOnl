import { CourseProgress } from "../types";

const PROGRESS_STORAGE_KEY = "course_progress";

export const progressService = {
  // Get progress for a specific course
  getCourseProgress: (
    courseId: number,
    userId: number
  ): CourseProgress | null => {
    try {
      const allProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!allProgress) return null;

      const progressData: CourseProgress[] = JSON.parse(allProgress);
      return (
        progressData.find(
          (p) => p.courseId === courseId && p.userId === userId
        ) || null
      );
    } catch (error) {
      console.error("Error getting course progress:", error);
      return null;
    }
  },

  // Save progress for a course
  saveCourseProgress: (progress: CourseProgress): void => {
    try {
      const allProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      let progressData: CourseProgress[] = allProgress
        ? JSON.parse(allProgress)
        : [];

      // Remove existing progress for this course/user
      progressData = progressData.filter(
        (p) =>
          !(p.courseId === progress.courseId && p.userId === progress.userId)
      );

      // Add new progress
      progressData.push(progress);

      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error("Error saving course progress:", error);
    }
  },

  // Mark a lesson as completed
  markLessonCompleted: (
    courseId: number,
    userId: number,
    lessonId: number,
    totalLessons: number
  ): void => {
    const existingProgress = progressService.getCourseProgress(
      courseId,
      userId
    );

    const completedLessons = existingProgress?.completedLessons || [];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const progressPercentage = Math.round(
      (completedLessons.length / totalLessons) * 100
    );

    const progress: CourseProgress = {
      courseId,
      userId,
      completedLessons,
      completedSections: existingProgress?.completedSections || [],
      completedContents: existingProgress?.completedContents || [],
      overallProgress: progressPercentage,
      timeSpent: existingProgress?.timeSpent || 0,
      lastUpdated: new Date(),
      // Legacy support
      totalLessons,
      progress: progressPercentage,
      lastAccessedLesson: lessonId,
      lastAccessedDate: new Date().toISOString(),
    };

    progressService.saveCourseProgress(progress);
  },

  // Update last accessed lesson
  updateLastAccessedLesson: (
    courseId: number,
    userId: number,
    lessonId: number
  ): void => {
    const existingProgress = progressService.getCourseProgress(
      courseId,
      userId
    );
    if (existingProgress) {
      existingProgress.lastAccessedLesson = lessonId;
      existingProgress.lastAccessedDate = new Date().toISOString();
      existingProgress.lastUpdated = new Date();
      progressService.saveCourseProgress(existingProgress);
    }
  },

  // Get all progress for a user
  getAllUserProgress: (userId: number): CourseProgress[] => {
    try {
      const allProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!allProgress) return [];

      const progressData: CourseProgress[] = JSON.parse(allProgress);
      return progressData.filter((p) => p.userId === userId);
    } catch (error) {
      console.error("Error getting user progress:", error);
      return [];
    }
  },

  // Initialize progress for a new course enrollment
  initializeCourseProgress: (
    courseId: number,
    userId: number,
    totalLessons: number
  ): CourseProgress => {
    const progress: CourseProgress = {
      courseId,
      userId,
      completedLessons: [],
      completedSections: [],
      completedContents: [],
      overallProgress: 0,
      timeSpent: 0,
      lastUpdated: new Date(),
      // Legacy support
      totalLessons,
      progress: 0,
      lastAccessedDate: new Date().toISOString(),
    };

    progressService.saveCourseProgress(progress);
    return progress;
  },
};
