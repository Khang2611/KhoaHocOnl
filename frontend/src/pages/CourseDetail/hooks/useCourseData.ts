import { useState, useEffect } from "react";
import { Course, CourseSection, CourseProgress } from "../../../types";
import { courseAPI, userAPI } from "../../../services/api";
import { progressService } from "../../../services/progressService";
import { courseContentService } from "../../../services/courseContentService";

export const useCourseData = (id: string | undefined, user: any) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>("NOT_ENROLLED");
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [courseSections, setCourseSections] = useState<CourseSection[]>([]);
  const [courseProgressData, setCourseProgressData] = useState<CourseProgress>({
    courseId: 0,
    userId: 0,
    completedLessons: [],
    completedSections: [],
    completedContents: [],
    overallProgress: 0,
    timeSpent: 0,
    lastUpdated: new Date(),
  });

  // Helper function to get real progress from enrolled courses
  const getRealCourseProgress = async (
    courseId: number,
    userId: number
  ): Promise<number> => {
    try {
      // Check if user is enrolled in this course
      const enrolledCourses = await userAPI.getEnrolledCourses();
      const isEnrolled = enrolledCourses.some(
        (course) => course.courseId === courseId
      );

      if (!isEnrolled) {
        return 0; // Not enrolled = 0% progress
      }

      // Get progress from localStorage (same logic as MyCourses)
      const courseProgress = progressService.getCourseProgress(
        courseId,
        userId
      );

      if (!courseProgress) {
        // Initialize progress if not exists
        const totalLessons = 5; // Same as MyCourses
        const initialProgress = progressService.initializeCourseProgress(
          courseId,
          userId,
          totalLessons
        );
        return initialProgress.progress || 0;
      }

      return courseProgress.progress || 0;
    } catch (error) {
      console.error("Error getting course progress:", error);
      return 0;
    }
  };

  // Load course data and progress
  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const courseId = parseInt(id);

        // Load course data
        const courseData = await courseAPI.getCourse(courseId);
        setCourse(courseData);

        // Generate course structure
        const sections = courseContentService.generateCourseStructure(
          courseData.courseTitle,
          courseData.courseId
        );
        setCourseSections(sections);

        // Check enrollment status
        if (user) {
          try {
            const enrollmentResponse = await courseAPI.getEnrollmentStatus(
              courseId
            );
            setEnrollmentStatus(enrollmentResponse.result);

            // Get real progress using same logic as MyCourses
            const realProgress = await getRealCourseProgress(
              courseId,
              user.userId
            );
            setCourseProgress(realProgress);

            // Set up course progress data for new components
            setCourseProgressData({
              courseId: courseId,
              userId: user.userId,
              completedLessons: [], // Will be loaded from progressService
              completedSections: [],
              completedContents: [],
              overallProgress: realProgress,
              timeSpent: 0,
              lastUpdated: new Date(),
            });
          } catch (enrollmentError) {
            console.log("User not enrolled or error checking enrollment");
            setEnrollmentStatus("NOT_ENROLLED");
            setCourseProgress(0);
          }
        } else {
          setCourseProgress(0);
        }
      } catch (err: any) {
        console.error("Error loading course:", err);
        setError(
          err.response?.data?.message || "Không thể tải thông tin khóa học"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id, user]);

  return {
    course,
    loading,
    error,
    enrollmentStatus,
    setEnrollmentStatus,
    courseProgress,
    setCourseProgress,
    courseSections,
    courseProgressData,
    setCourse,
    setError,
    setLoading,
  };
};