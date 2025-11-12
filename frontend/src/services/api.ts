import { AxiosResponse, AxiosError } from "axios";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  Course,
  User,
  PaymentResponse,
  CourseUpdateRequest,
  UserUpdateRequest,
  Lesson,
} from "../types";
import { createApiInstance } from "./baseApi";

const api = createApiInstance();

export const authAPI = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api
      .post("/auth/login", data)
      .then((res: AxiosResponse<AuthResponse>) => {
        console.log("🔍 Raw API response:", res.data);
        // Check if response is wrapped in ApiResponse format
        if (res.data && typeof res.data === "object" && "result" in res.data) {
          console.log(
            "📦 Response is wrapped, extracting result:",
            res.data.result
          );
          return res.data.result as AuthResponse;
        }
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error("❌ Login API error:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        throw error;
      }),

  register: (data: RegisterRequest): Promise<User> =>
    api
      .post("/auth/register", data)
      .then((res: AxiosResponse<User>) => res.data),
};

export const courseAPI = {
  getAllCourses: (): Promise<Course[]> =>
    api.get("/course/all").then((res: AxiosResponse<Course[]>) => {
      // Add mock createBy data if missing
      const courses = res.data.map((course) => ({
        ...course,
        createBy: course.createBy || {
          userId: 1,
          userName: "instructor",
          fullName: "Giảng viên",
          phoneNumber: "0123456789",
          role: "USER" as const,
        },
      }));
      return courses;
    }),

  getCourse: (id: number): Promise<Course> =>
    api.get(`/course/${id}`).then((res: AxiosResponse<Course>) => {
      const course = res.data;
      // Add mock createBy data if missing
      return {
        ...course,
        createBy: course.createBy || {
          userId: 1,
          userName: "instructor",
          fullName: "Giảng viên",
          phoneNumber: "0123456789",
          role: "USER" as const,
        },
      };
    }),

  getCourseDetails: (id: number): Promise<import("../types").EnhancedCourse> =>
    api
      .get(`/course/${id}/details`)
      .then((res: AxiosResponse<import("../types").EnhancedCourse>) => {
        const course = res.data;
        // Add mock createBy data if missing
        return {
          ...course,
          createBy: course.createBy || {
            userId: 1,
            userName: "instructor",
            fullName: "Giảng viên",
            phoneNumber: "0123456789",
            role: "USER" as const,
          },
        };
      }),

  // Get lessons for a course (placeholder - will be implemented when backend is ready)
  getCourseLessons: (courseId: number): Promise<Lesson[]> => {
    // Use courseContentService to generate structured lessons
    return api.get(`/course/${courseId}`).then((res: AxiosResponse<Course>) => {
      const course = res.data;

      // Import courseContentService dynamically to avoid circular dependency
      const { courseContentService } = require("./courseContentService");
      const sections = courseContentService.generateCourseStructure(
        course.courseTitle,
        course.courseId
      );

      // Flatten all lessons from all sections
      const lessons: Lesson[] = [];
      sections.forEach((section: any) => {
        section.lessons.forEach((lesson: any) => {
          lessons.push({
            ...lesson,
            // Add legacy support for backward compatibility
            id: lesson.lessonId,
            courseId: courseId,
            title: lesson.lessonTitle,
            videoUrl:
              lesson.contents?.find((c: any) => c.contentType === "VIDEO")
                ?.videoUrl ||
              course.urlVideo ||
              "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration:
              lesson.estimatedDuration < 60
                ? `${lesson.estimatedDuration} phút`
                : `${Math.floor(lesson.estimatedDuration / 60)}h ${
                    lesson.estimatedDuration % 60
                  }p`,
            order: lesson.orderIndex,
            completed: false,
          });
        });
      });

      return lessons;
    });
  },

  updateCourse: (
    id: number,
    data: CourseUpdateRequest
  ): Promise<ApiResponse<Course>> =>
    api
      .put(`/course/update/${id}`, data)
      .then((res: AxiosResponse<ApiResponse<Course>>) => res.data),

  enrollCourse: (courseId: number): Promise<ApiResponse<string>> =>
    api
      .post(`/course/enroll/${courseId}`)
      .then((res: AxiosResponse<ApiResponse<string>>) => res.data),

  processPayment: (courseId: number): Promise<ApiResponse<PaymentResponse>> =>
    api
      .post(`/course/payment/${courseId}`)
      .then((res: AxiosResponse<ApiResponse<PaymentResponse>>) => res.data),

  simulatePayment: (enrollmentId: number): Promise<ApiResponse<string>> =>
    api
      .post(`/course/simulate-payment/${enrollmentId}`)
      .then((res: AxiosResponse<ApiResponse<string>>) => res.data),

  getEnrollmentStatus: (courseId: number): Promise<ApiResponse<string>> =>
    api
      .get(`/course/enrollment-status/${courseId}`)
      .then((res: AxiosResponse<ApiResponse<string>>) => res.data),
};

export const userAPI = {
  getMyInfo: (): Promise<User> =>
    api.get("/v1/users/myinfo").then((res: AxiosResponse<User>) => res.data),

  updateUser: (data: UserUpdateRequest): Promise<ApiResponse<User>> =>
    api
      .put("/v1/users/update", data)
      .then((res: AxiosResponse<ApiResponse<User>>) => res.data),

  getEnrolledCourses: (): Promise<Course[]> =>
    api
      .get("/v1/users/enrolled-courses")
      .then((res: AxiosResponse<ApiResponse<Course[]>>) => res.data.result),

  getAllEnrollments: (): Promise<any[]> =>
    api
      .get("/v1/users/all-enrollments")
      .then((res: AxiosResponse<ApiResponse<any[]>>) => res.data.result),
};

export default api;
