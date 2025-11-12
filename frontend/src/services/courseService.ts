import { Course } from "../types";

export interface CourseBundle {
  bundleId: number;
  bundleTitle: string;
  description: string;
  courses: Course[];
  originalPrice: number;
  bundlePrice: number;
  discount: number; // percentage
  estimatedDuration: string;
}

class CourseService {
  // Get course bundles (Learning Path packages) - these reference database courses
  getCourseBundles(): CourseBundle[] {
    return [
      {
        bundleId: 2001,
        bundleTitle: "Full-Stack Web Developer Bundle",
        description:
          "Combo hoàn chỉnh để trở thành Full-Stack Developer với các khóa học từ cơ bản đến nâng cao",
        courses: [], // Will be populated with actual database courses
        originalPrice: 2500000, // Estimated total
        bundlePrice: 1999000, // Discounted price
        discount: 20, // 20% discount
        estimatedDuration: "6-8 tháng",
      },
      {
        bundleId: 2002,
        bundleTitle: "Java Enterprise Developer Bundle",
        description:
          "Chuyên sâu Java Enterprise với Spring Boot, Security và dự án thực tế",
        courses: [], // Will be populated with actual database courses
        originalPrice: 2800000,
        bundlePrice: 2299000,
        discount: 18,
        estimatedDuration: "4-6 tháng",
      },
      {
        bundleId: 2003,
        bundleTitle: "DevOps Engineer Bundle",
        description:
          "Trở thành DevOps Engineer với Docker, Kubernetes, CI/CD và AWS",
        courses: [], // Will be populated with actual database courses
        originalPrice: 3000000,
        bundlePrice: 2599000,
        discount: 13,
        estimatedDuration: "5-7 tháng",
      },
      {
        bundleId: 2004,
        bundleTitle: "Data Science & AI Bundle",
        description:
          "Combo Data Science hoàn chỉnh từ Python đến Machine Learning và Deep Learning",
        courses: [], // Will be populated with actual database courses
        originalPrice: 3500000,
        bundlePrice: 2899000,
        discount: 17,
        estimatedDuration: "6-9 tháng",
      },
    ];
  }

  // Check if user has access to course (either individual purchase or bundle)
  hasAccessToCourse(courseId: number, userEnrollments: any[]): boolean {
    // Check individual course enrollment
    const directEnrollment = userEnrollments.find(
      (enrollment) =>
        enrollment.course.courseId === courseId &&
        enrollment.status === "APPROVED"
    );

    if (directEnrollment) return true;

    // Check bundle enrollment (bundle IDs are 2001-2004)
    const bundles = this.getCourseBundles();
    for (const bundle of bundles) {
      const bundleEnrollment = userEnrollments.find(
        (enrollment) =>
          enrollment.course.courseId === bundle.bundleId &&
          enrollment.status === "APPROVED"
      );

      if (bundleEnrollment) {
        // If user has bundle access, they have access to all courses in that bundle
        // This would need to be implemented based on your bundle-course mapping logic
        return true;
      }
    }

    return false;
  }

  // Get courses by category (for filtering database courses)
  getCoursesByCategory(category: string, allCourses: Course[]): Course[] {
    const categoryKeywords: { [key: string]: string[] } = {
      web: [
        "html",
        "css",
        "javascript",
        "js",
        "react",
        "vue",
        "angular",
        "web",
        "frontend",
        "backend",
        "node",
        "express",
        "api",
        "responsive",
      ],
      java: [
        "java",
        "spring",
        "boot",
        "jpa",
        "hibernate",
        "maven",
        "gradle",
        "microservice",
        "enterprise",
        "mvc",
        "security",
        "jwt",
      ],
      devops: [
        "docker",
        "kubernetes",
        "devops",
        "ci/cd",
        "aws",
        "azure",
        "gcp",
        "cloud",
        "container",
        "deployment",
        "infrastructure",
        "monitoring",
        "jenkins",
        "gitlab",
        "github",
        "terraform",
      ],
      data: [
        "python",
        "data",
        "machine",
        "learning",
        "ai",
        "artificial",
        "analytics",
        "statistics",
        "pandas",
        "numpy",
        "tensorflow",
        "pytorch",
        "ml",
        "deep",
        "neural",
      ],
      database: [
        "mysql",
        "postgresql",
        "mongodb",
        "database",
        "sql",
        "nosql",
        "redis",
        "elasticsearch",
        "data",
        "query",
        "schema",
      ],
    };

    const keywords = categoryKeywords[category] || [];
    return allCourses.filter((course) =>
      keywords.some(
        (keyword) =>
          course.courseTitle.toLowerCase().includes(keyword) ||
          course.description.toLowerCase().includes(keyword)
      )
    );
  }

  // Get recommended courses based on user's current enrollments
  getRecommendedCourses(
    userEnrollments: any[],
    allCourses: Course[],
    limit: number = 6
  ): Course[] {
    const enrolledCourseIds = userEnrollments
      .filter((e) => e.status === "APPROVED")
      .map((e) => e.course.courseId);

    // Simple recommendation logic based on course titles
    const recommendations: Course[] = [];

    // If user has web courses, recommend related ones
    const hasWebCourses = enrolledCourseIds.some((id) => {
      const course = allCourses.find((c) => c.courseId === id);
      return (
        course &&
        (course.courseTitle.toLowerCase().includes("html") ||
          course.courseTitle.toLowerCase().includes("javascript") ||
          course.courseTitle.toLowerCase().includes("react"))
      );
    });

    if (hasWebCourses) {
      const webRelated = allCourses.filter(
        (c) =>
          (c.courseTitle.toLowerCase().includes("node") ||
            c.courseTitle.toLowerCase().includes("database") ||
            c.courseTitle.toLowerCase().includes("typescript")) &&
          !enrolledCourseIds.includes(c.courseId)
      );
      recommendations.push(...webRelated);
    }

    // If user has Java courses, recommend Spring ecosystem
    const hasJavaCourses = enrolledCourseIds.some((id) => {
      const course = allCourses.find((c) => c.courseId === id);
      return course && course.courseTitle.toLowerCase().includes("java");
    });

    if (hasJavaCourses) {
      const javaRelated = allCourses.filter(
        (c) =>
          (c.courseTitle.toLowerCase().includes("spring") ||
            c.courseTitle.toLowerCase().includes("database")) &&
          !enrolledCourseIds.includes(c.courseId)
      );
      recommendations.push(...javaRelated);
    }

    // Remove duplicates and limit results
    const filtered = recommendations.filter(
      (course, index, self) =>
        index === self.findIndex((c) => c.courseId === course.courseId)
    );

    // If not enough recommendations, add popular courses
    if (filtered.length < limit) {
      const popular = allCourses
        .filter((c) => !enrolledCourseIds.includes(c.courseId))
        .filter((c) => !filtered.some((f) => f.courseId === c.courseId))
        .sort((a, b) => b.price - a.price) // Sort by price as popularity indicator
        .slice(0, limit - filtered.length);

      filtered.push(...popular);
    }

    return filtered.slice(0, limit);
  }

  // Calculate bundle savings
  calculateBundleSavings(bundleId: number): {
    savings: number;
    percentage: number;
  } {
    const bundle = this.getCourseBundles().find((b) => b.bundleId === bundleId);
    if (!bundle) return { savings: 0, percentage: 0 };

    const savings = bundle.originalPrice - bundle.bundlePrice;
    const percentage = Math.round((savings / bundle.originalPrice) * 100);

    return { savings, percentage };
  }

  // Check if user is enrolled in a bundle
  isUserEnrolledInBundle(bundleId: number, userEnrollments: any[]): boolean {
    return userEnrollments.some(
      (enrollment) =>
        enrollment.course.courseId === bundleId &&
        enrollment.status === "APPROVED"
    );
  }
}

export const courseService = new CourseService();
