import { AxiosResponse } from "axios";
import { ApiResponse } from "../types";
import { createApiInstance } from "./baseApi";

const adminApi = createApiInstance();

export interface AdminStats {
  totalCourses: number;
  totalUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
}

export interface EnrollmentDetail {
  enrollmentId: number;
  userName: string;
  userFullName: string;
  courseTitle: string;
  status: string;
  enrollmentDate: string;
  coursePrice: number;
  transactionId?: string;
}

export interface UserDetail {
  userId: number;
  userName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  registrationDate: string;
}

export const adminAPI = {
  // Get admin dashboard stats
  getStats: async (): Promise<AdminStats> => {
    try {
      // For now, calculate stats from existing endpoints
      const [coursesRes, usersRes] = await Promise.all([
        adminApi.get("/course/all"),
        adminApi.get("/admin/users"),
      ]);

      const courses = coursesRes.data;
      const users = usersRes.data;

      // Calculate basic stats
      const totalRevenue = courses.reduce((sum: number, course: any) => {
        return sum + (course.price || 0);
      }, 0);

      return {
        totalCourses: courses.length,
        totalUsers: users.length,
        totalEnrollments: 0, // Will be implemented later
        totalRevenue: totalRevenue,
      };
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },

  // Get all users
  getUsers: (): Promise<UserDetail[]> =>
    adminApi
      .get("/admin/users")
      .then((res: AxiosResponse<UserDetail[]>) => res.data),

  // Delete user
  deleteUser: (userId: number): Promise<ApiResponse<string>> =>
    adminApi
      .delete(`/admin/users/${userId}`)
      .then((res: AxiosResponse<ApiResponse<string>>) => res.data),

  // Get all courses for admin
  getCourses: () =>
    adminApi.get("/course/all").then((res: AxiosResponse) => res.data),

  // Create new course
  createCourse: (courseData: any): Promise<any> =>
    adminApi
      .post("/admin/courses", courseData)
      .then((res: AxiosResponse) => res.data),

  // Update course
  updateCourse: (courseId: number, courseData: any): Promise<any> =>
    adminApi
      .put(`/admin/courses/${courseId}`, courseData)
      .then((res: AxiosResponse) => res.data),

  // Delete course
  deleteCourse: (courseId: number): Promise<ApiResponse<string>> =>
    adminApi
      .delete(`/admin/courses/${courseId}`)
      .then((res: AxiosResponse<ApiResponse<string>>) => res.data),

  // Get all enrollments
  getEnrollments: async (): Promise<EnrollmentDetail[]> => {
    try {
      const response = await adminApi.get("/admin/enrollments");
      const enrollments = response.data;

      // Transform backend data to frontend format
      return enrollments.map((enrollment: any) => ({
        enrollmentId: enrollment.courseEnrollmentId || enrollment.id,
        userName: enrollment.user?.userName || "N/A",
        userFullName:
          enrollment.user?.fullName || enrollment.user?.userName || "N/A",
        courseTitle: enrollment.course?.courseTitle || "N/A",
        status: enrollment.status || "PENDING",
        enrollmentDate:
          enrollment.requestDate ||
          enrollment.createdDate ||
          new Date().toISOString(),
        coursePrice: enrollment.course?.price || 0,
        transactionId: `TXN-${enrollment.courseEnrollmentId || enrollment.id}`,
      }));
    } catch (error) {
      throw error;
    }
  },

  // Approve enrollment
  approveEnrollment: (enrollmentId: number): Promise<void> =>
    adminApi.put(`/admin/enrollments/${enrollmentId}/approve`).then(() => {}),

  // Reject enrollment
  rejectEnrollment: (enrollmentId: number): Promise<void> =>
    adminApi.put(`/admin/enrollments/${enrollmentId}/reject`).then(() => {}),

  // Import courses from JSON
  importCourses: (coursesData: any[]): Promise<ApiResponse<string>> =>
    adminApi
      .post("/admin/courses/import", coursesData)
      .then((res: AxiosResponse<ApiResponse<string>>) => res.data),
};

export default adminApi;
