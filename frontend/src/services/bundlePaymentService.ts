import { courseAPI } from "./api";

export interface BundlePaymentRequest {
  pathId: number;
  courseIds: number[];
  bundlePrice: number;
  originalPrice: number;
}

export interface BundlePaymentResponse {
  bundleEnrollmentId: string;
  paymentQRCodeUrl: string;
  message: string;
  courseIds: number[];
}

class BundlePaymentService {
  // Simulate bundle payment process
  async processBundlePayment(
    request: BundlePaymentRequest
  ): Promise<BundlePaymentResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock payment response
    const bundleEnrollmentId = `BUNDLE-${request.pathId}-${Date.now()}`;
    const paymentQRCodeUrl = `https://placehold.co/400x400/E9E9E9/000000?text=Bundle+Payment+QR\nID: ${bundleEnrollmentId}`;

    return {
      bundleEnrollmentId,
      paymentQRCodeUrl,
      message: `Vui lòng quét mã QR để thanh toán combo ${
        request.courseIds.length
      } khóa học. Tổng tiền: ${request.bundlePrice.toLocaleString("vi-VN")}đ`,
      courseIds: request.courseIds,
    };
  }

  // Simulate successful bundle payment and enroll in all courses
  async simulateBundlePaymentSuccess(
    bundleEnrollmentId: string,
    courseIds: number[]
  ): Promise<{
    success: boolean;
    enrolledCourses: number[];
    failedCourses: number[];
    message: string;
  }> {
    console.log(
      `🎯 Processing bundle payment success for: ${bundleEnrollmentId}`
    );
    console.log(`📚 Enrolling in courses: ${courseIds.join(", ")}`);

    const enrolledCourses: number[] = [];
    const failedCourses: number[] = [];

    // Enroll in each course individually
    for (const courseId of courseIds) {
      try {
        console.log(`📝 Enrolling in course ${courseId}...`);

        // First enroll in the course
        const enrollResponse = await courseAPI.enrollCourse(courseId);
        console.log(`✅ Enrolled in course ${courseId}:`, enrollResponse);

        // Extract enrollment ID from the response
        const enrollmentIdMatch =
          enrollResponse.result.match(/Enrollment ID: (\d+)/);
        if (enrollmentIdMatch) {
          const enrollmentId = parseInt(enrollmentIdMatch[1]);

          // Simulate payment success for this enrollment
          console.log(
            `💳 Simulating payment for enrollment ${enrollmentId}...`
          );
          const paymentResponse = await courseAPI.simulatePayment(enrollmentId);
          console.log(
            `✅ Payment simulated for course ${courseId}:`,
            paymentResponse
          );

          enrolledCourses.push(courseId);
        } else {
          console.error(
            `❌ Could not extract enrollment ID for course ${courseId}`
          );
          failedCourses.push(courseId);
        }
      } catch (error) {
        console.error(`❌ Failed to enroll in course ${courseId}:`, error);
        failedCourses.push(courseId);
      }

      // Add small delay between enrollments
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const success = enrolledCourses.length > 0;
    const message = success
      ? `🎉 Thanh toán thành công! Đã đăng ký ${enrolledCourses.length}/${courseIds.length} khóa học.`
      : "❌ Thanh toán thất bại. Vui lòng thử lại.";

    return {
      success,
      enrolledCourses,
      failedCourses,
      message,
    };
  }

  // Get bundle pricing information
  getBundlePricing(courses: any[]): {
    originalPrice: number;
    bundlePrice: number;
    savings: number;
    discountPercentage: number;
  } {
    const originalPrice = courses.reduce(
      (sum, course) => sum + course.price,
      0
    );
    const bundlePrice = Math.round(originalPrice * 0.75); // 25% discount
    const savings = originalPrice - bundlePrice;
    const discountPercentage = Math.round((savings / originalPrice) * 100);

    return {
      originalPrice,
      bundlePrice,
      savings,
      discountPercentage,
    };
  }

  // Check if user has access to bundle (all courses enrolled)
  checkBundleAccess(
    courseIds: number[],
    userEnrollments: any[]
  ): {
    hasFullAccess: boolean;
    enrolledCourses: number[];
    pendingCourses: number[];
    progress: number;
  } {
    const enrolledCourses = courseIds.filter((courseId) =>
      userEnrollments.some(
        (enrollment) =>
          enrollment.course.courseId === courseId &&
          enrollment.status === "APPROVED"
      )
    );

    const pendingCourses = courseIds.filter(
      (courseId) => !enrolledCourses.includes(courseId)
    );
    const progress =
      courseIds.length > 0
        ? (enrolledCourses.length / courseIds.length) * 100
        : 0;

    return {
      hasFullAccess: enrolledCourses.length === courseIds.length,
      enrolledCourses,
      pendingCourses,
      progress: Math.round(progress),
    };
  }

  // Generate bundle enrollment tracking
  generateBundleTracking(pathId: number, courseIds: number[]): string {
    return `BUNDLE_${pathId}_${courseIds.join("_")}_${Date.now()}`;
  }
}

export const bundlePaymentService = new BundlePaymentService();
