import { Course } from "../types";

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration: string; // e.g., "3-4 months"
  courses: Course[];
  prerequisites: string[];
  outcomes: string[];
  careerPaths: string[];
}

export interface CoursePrerequisite {
  courseId: number;
  prerequisites: {
    required: string[];
    recommended: string[];
  };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  nextCourses: number[];
}

class LearningPathService {
  // Get learning paths with courses populated from database
  getLearningPathsWithCourses(allCourses: Course[]): LearningPath[] {
    const basePaths = this.getLearningPaths();

    return basePaths.map((path) => ({
      ...path,
      courses: this.getCoursesForPath(path.id, allCourses),
    }));
  }

  // Get courses for a specific learning path based on predefined course sequences
  private getCoursesForPath(pathId: number, allCourses: Course[]): Course[] {
    // Define specific course titles for each learning path in order
    const pathCourseMapping: { [key: number]: string[] } = {
      1: [
        // Full-Stack Web Developer - in learning order (using actual database course names)
        "JavaScript ES6+ Complete Guide",
        "React.js Frontend Development",
        "Node.js Backend Development",
        "Full-Stack Web Project",
        "Database Design & Management",
        "Git & Version Control",
      ],
      2: [
        // Java Enterprise Developer - in learning order
        "Java Programming Fundamentals",
        "Spring Boot Microservices",
        "Database Design & Management",
        "API Design & Development",
        "Software Testing & QA",
      ],
      3: [
        // DevOps Engineer - in learning order
        "Git & Version Control",
        "Docker & Containerization",
        "Kubernetes Container Orchestration",
        "CI/CD Pipeline Automation",
        "AWS Cloud Infrastructure",
        "DevOps Monitoring & Security",
      ],
      4: [
        // Data Science & Analytics - in learning order
        "Python for Data Science",
        "Data Analysis & Visualization",
        "Machine Learning Fundamentals",
        "Deep Learning & Neural Networks",
        "AI & Data Science Capstone",
        "Database Design & Management",
      ],
    };

    const courseNames = pathCourseMapping[pathId] || [];
    const pathCourses: Course[] = [];

    // Find courses by exact title match in the specified order
    courseNames.forEach((courseName) => {
      const course = allCourses.find(
        (c) => c.courseTitle.toLowerCase() === courseName.toLowerCase()
      );
      if (course) {
        pathCourses.push(course);
      }
    });

    // If we don't have enough courses from exact matches, fall back to keyword matching
    if (pathCourses.length < 4) {
      const keywordFallback: { [key: number]: string[] } = {
        1: [
          "html",
          "css",
          "javascript",
          "react",
          "node",
          "web",
          "frontend",
          "backend",
          "api",
        ],
        2: [
          "java",
          "spring",
          "boot",
          "enterprise",
          "microservice",
          "security",
          "jwt",
        ],
        3: [
          "docker",
          "kubernetes",
          "devops",
          "ci/cd",
          "aws",
          "cloud",
          "container",
          "jenkins",
        ],
        4: [
          "python",
          "data",
          "machine",
          "learning",
          "pandas",
          "numpy",
          "tensorflow",
          "analytics",
        ],
      };

      const keywords = keywordFallback[pathId] || [];
      const remainingCourses = allCourses.filter(
        (course) => !pathCourses.some((pc) => pc.courseId === course.courseId)
      );

      const scoredCourses = remainingCourses.map((course) => {
        const title = course.courseTitle.toLowerCase();
        const description = course.description.toLowerCase();

        let score = 0;
        keywords.forEach((keyword) => {
          if (title.includes(keyword)) score += 3;
          if (description.includes(keyword)) score += 1;
        });

        return { course, score };
      });

      const additionalCourses = scoredCourses
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.course)
        .slice(0, 6 - pathCourses.length);

      pathCourses.push(...additionalCourses);
    }

    return pathCourses;
  }

  // Get learning paths based on career goals (base structure without courses)
  getLearningPaths(): LearningPath[] {
    return [
      {
        id: 1,
        title: "Full-Stack Web Developer",
        description:
          "Trở thành full-stack developer với khả năng xây dựng ứng dụng web hoàn chỉnh từ frontend đến backend",
        difficulty: "Beginner",
        estimatedDuration: "6-8 tháng",
        courses: [], // Will be populated from database
        prerequisites: [
          "Kiến thức cơ bản về máy tính",
          "Tư duy logic cơ bản",
          "Tiếng Anh đọc hiểu (để đọc documentation)",
        ],
        outcomes: [
          "Xây dựng website responsive với HTML, CSS, JavaScript",
          "Phát triển ứng dụng React.js với state management",
          "Tạo REST API với Node.js và Express",
          "Quản lý cơ sở dữ liệu với MySQL/PostgreSQL",
          "Deploy ứng dụng lên cloud platforms",
          "Sử dụng Git và GitHub cho version control",
        ],
        careerPaths: [
          "Frontend Developer",
          "Backend Developer",
          "Full-Stack Developer",
          "Web Developer",
          "JavaScript Developer",
        ],
      },
      {
        id: 2,
        title: "Java Enterprise Developer",
        description:
          "Chuyên sâu về Java và Spring Framework để phát triển ứng dụng enterprise",
        difficulty: "Intermediate",
        estimatedDuration: "4-6 tháng",
        courses: [], // Will be populated from database
        prerequisites: [
          "Kiến thức lập trình cơ bản",
          "Hiểu biết về OOP",
          "Kinh nghiệm với ít nhất 1 ngôn ngữ lập trình",
        ],
        outcomes: [
          "Thành thạo Java Core và Advanced concepts",
          "Xây dựng REST API với Spring Boot",
          "Quản lý database với Spring Data JPA",
          "Implement security với Spring Security",
          "Microservices architecture với Spring Cloud",
          "Testing với JUnit và Mockito",
        ],
        careerPaths: [
          "Java Developer",
          "Backend Developer",
          "Enterprise Application Developer",
          "Spring Developer",
          "Microservices Architect",
        ],
      },
      {
        id: 3,
        title: "DevOps Engineer",
        description:
          "Học cách tự động hóa deployment, quản lý infrastructure và CI/CD pipelines",
        difficulty: "Advanced",
        estimatedDuration: "5-7 tháng",
        courses: [], // Will be populated from database
        prerequisites: [
          "Kinh nghiệm phát triển phần mềm 1-2 năm",
          "Hiểu biết về Linux/Unix systems",
          "Kiến thức cơ bản về networking",
          "Kinh nghiệm với cloud platforms",
        ],
        outcomes: [
          "Containerization với Docker và Kubernetes",
          "CI/CD pipelines với Jenkins/GitHub Actions",
          "Infrastructure as Code với Terraform",
          "Monitoring và logging với ELK stack",
          "Cloud deployment (AWS/Azure/GCP)",
          "Security best practices",
        ],
        careerPaths: [
          "DevOps Engineer",
          "Site Reliability Engineer (SRE)",
          "Cloud Engineer",
          "Infrastructure Engineer",
          "Platform Engineer",
        ],
      },
      {
        id: 4,
        title: "Data Science & Analytics",
        description: "Phân tích dữ liệu và machine learning với Python",
        difficulty: "Intermediate",
        estimatedDuration: "6-9 tháng",
        courses: [], // Will be populated from database
        prerequisites: [
          "Toán học cơ bản (thống kê, đại số tuyến tính)",
          "Kiến thức lập trình cơ bản",
          "Tư duy phân tích",
        ],
        outcomes: [
          "Python programming cho data science",
          "Data analysis với Pandas và NumPy",
          "Data visualization với Matplotlib/Seaborn",
          "Machine learning với Scikit-learn",
          "Deep learning basics với TensorFlow",
          "SQL cho data analysis",
        ],
        careerPaths: [
          "Data Scientist",
          "Data Analyst",
          "Machine Learning Engineer",
          "Business Intelligence Analyst",
          "Research Scientist",
        ],
      },
    ];
  }

  // Get course prerequisites and recommendations based on actual database course IDs
  getCoursePrerequisites(): { [courseId: number]: CoursePrerequisite } {
    // Updated mapping based on actual database course IDs (11-30)
    return {
      // Full-Stack Web Developer Path (using actual database course IDs)
      11: {
        // JavaScript ES6+ Complete Guide
        courseId: 11,
        prerequisites: {
          required: [],
          recommended: ["Kiến thức cơ bản về lập trình", "HTML/CSS cơ bản"],
        },
        difficulty: "Beginner",
        estimatedTime: "6-8 tuần",
        nextCourses: [12, 28], // React, Git
      },
      12: {
        // React.js Frontend Development
        courseId: 12,
        prerequisites: {
          required: ["JavaScript ES6+ Complete Guide"],
          recommended: ["HTML/CSS cơ bản"],
        },
        difficulty: "Intermediate",
        estimatedTime: "6-8 tuần",
        nextCourses: [13, 27], // Node.js, Database
      },
      13: {
        // Node.js Backend Development
        courseId: 13,
        prerequisites: {
          required: ["JavaScript ES6+ Complete Guide"],
          recommended: ["React.js Frontend Development"],
        },
        difficulty: "Intermediate",
        estimatedTime: "6-8 tuần",
        nextCourses: [14, 29], // Full-Stack Project, API Design
      },
      14: {
        // Full-Stack Web Project
        courseId: 14,
        prerequisites: {
          required: [
            "React.js Frontend Development",
            "Node.js Backend Development",
          ],
          recommended: ["Database Design & Management"],
        },
        difficulty: "Advanced",
        estimatedTime: "8-10 tuần",
        nextCourses: [],
      },

      // Java Enterprise Developer Path
      15: {
        // Java Programming Fundamentals
        courseId: 15,
        prerequisites: {
          required: [],
          recommended: ["Kiến thức lập trình cơ bản", "Tư duy logic"],
        },
        difficulty: "Beginner",
        estimatedTime: "6-8 tuần",
        nextCourses: [16, 27], // Spring Boot, Database
      },
      16: {
        // Spring Boot Microservices
        courseId: 16,
        prerequisites: {
          required: ["Java Programming Fundamentals"],
          recommended: ["Database Design & Management"],
        },
        difficulty: "Intermediate",
        estimatedTime: "8-10 tuần",
        nextCourses: [29, 30], // API Design, Testing
      },

      // DevOps Engineer Path
      17: {
        // Docker & Containerization
        courseId: 17,
        prerequisites: {
          required: [],
          recommended: ["Linux/Unix basics", "Kinh nghiệm phát triển phần mềm"],
        },
        difficulty: "Intermediate",
        estimatedTime: "4-6 tuần",
        nextCourses: [18, 28], // Kubernetes, Git
      },
      18: {
        // Kubernetes Container Orchestration
        courseId: 18,
        prerequisites: {
          required: ["Docker & Containerization"],
          recommended: ["Networking basics"],
        },
        difficulty: "Advanced",
        estimatedTime: "6-8 tuần",
        nextCourses: [19, 20], // CI/CD, AWS
      },

      // Data Science Path
      22: {
        // Python for Data Science
        courseId: 22,
        prerequisites: {
          required: [],
          recommended: ["Toán học cơ bản", "Thống kê cơ bản"],
        },
        difficulty: "Beginner",
        estimatedTime: "4-6 tuần",
        nextCourses: [23, 27], // Data Analysis, Database
      },
      23: {
        // Data Analysis & Visualization
        courseId: 23,
        prerequisites: {
          required: ["Python for Data Science"],
          recommended: [],
        },
        difficulty: "Intermediate",
        estimatedTime: "6-8 tuần",
        nextCourses: [24, 25], // Machine Learning, Deep Learning
      },

      // Common/Shared Courses
      27: {
        // Database Design & Management
        courseId: 27,
        prerequisites: {
          required: [],
          recommended: ["Tư duy logic cơ bản"],
        },
        difficulty: "Beginner",
        estimatedTime: "4-6 tuần",
        nextCourses: [13, 16, 23], // Node.js, Spring Boot, Data Analysis
      },
      28: {
        // Git & Version Control
        courseId: 28,
        prerequisites: {
          required: [],
          recommended: ["Kiến thức cơ bản về lập trình"],
        },
        difficulty: "Beginner",
        estimatedTime: "2-3 tuần",
        nextCourses: [19], // CI/CD
      },
    };
  }

  // Check if user is enrolled in a course
  isUserEnrolledInCourse(courseId: number, userEnrollments: any[]): boolean {
    return userEnrollments.some(
      (enrollment) =>
        enrollment.course.courseId === courseId &&
        enrollment.status === "APPROVED"
    );
  }

  // Get user's enrolled courses from a learning path
  getUserPathProgress(
    pathId: number,
    userEnrollments: any[]
  ): {
    enrolledCourses: number[];
    completedCourses: number[];
    progress: number;
    nextRecommendedCourse?: number;
  } {
    const path = this.getLearningPaths().find((p) => p.id === pathId);
    if (!path) {
      return { enrolledCourses: [], completedCourses: [], progress: 0 };
    }

    const enrolledCourses = path.courses
      .filter((course) =>
        this.isUserEnrolledInCourse(course.courseId, userEnrollments)
      )
      .map((course) => course.courseId);

    // For demo, assume completed courses are those enrolled for more than 30 days
    const completedCourses = enrolledCourses.filter((courseId) => {
      const enrollment = userEnrollments.find(
        (e) => e.course.courseId === courseId
      );
      if (!enrollment) return false;

      const enrollmentDate = new Date(
        enrollment.requestDate || enrollment.createdDate
      );
      const daysSinceEnrollment =
        (Date.now() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceEnrollment > 30; // Assume completed after 30 days
    });

    const totalCourses = path.courses.length;
    const progress =
      totalCourses > 0 ? (completedCourses.length / totalCourses) * 100 : 0;

    // Find next recommended course (first non-enrolled course)
    const nextCourse = path.courses.find(
      (course) => !enrolledCourses.includes(course.courseId)
    );

    return {
      enrolledCourses,
      completedCourses,
      progress: Math.round(progress),
      nextRecommendedCourse: nextCourse?.courseId,
    };
  }

  // Get skill assessment questions
  getSkillAssessment(): {
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      category: string;
    }>;
  } {
    return {
      questions: [
        {
          id: 1,
          question: "Bạn có kinh nghiệm lập trình không?",
          options: [
            "Chưa có kinh nghiệm",
            "Đã học cơ bản",
            "Có kinh nghiệm 1-2 năm",
            "Có kinh nghiệm trên 2 năm",
          ],
          category: "experience",
        },
        {
          id: 2,
          question: "Bạn muốn phát triển theo hướng nào?",
          options: [
            "Frontend Development",
            "Backend Development",
            "Full-Stack Development",
            "Mobile Development",
            "Data Science",
            "DevOps/Cloud",
          ],
          category: "career-goal",
        },
        {
          id: 3,
          question: "Bạn có thời gian học mỗi tuần?",
          options: ["Dưới 5 giờ", "5-10 giờ", "10-15 giờ", "Trên 15 giờ"],
          category: "time-commitment",
        },
        {
          id: 4,
          question: "Bạn đã biết ngôn ngữ lập trình nào?",
          options: [
            "Chưa biết ngôn ngữ nào",
            "HTML/CSS/JavaScript",
            "Python",
            "Java",
            "C/C++",
            "Khác",
          ],
          category: "technical-background",
        },
      ],
    };
  }

  // Generate personalized learning recommendation
  generateRecommendation(assessmentAnswers: { [questionId: number]: string }): {
    recommendedPath: LearningPath;
    startingCourse: number;
    estimatedTimeToComplete: string;
    tips: string[];
  } {
    // Simple logic for demo - in real app, this would be more sophisticated
    const experience = assessmentAnswers[1] || "Chưa có kinh nghiệm";
    const careerGoal = assessmentAnswers[2] || "Full-Stack Development";
    const timeCommitment = assessmentAnswers[3] || "5-10 giờ";
    const technicalBackground =
      assessmentAnswers[4] || "Chưa biết ngôn ngữ nào";

    const paths = this.getLearningPaths();
    let recommendedPath = paths[0]; // Default to Full-Stack

    // Match career goal to learning path
    if (careerGoal.includes("Full-Stack") || careerGoal.includes("Frontend")) {
      recommendedPath = paths[0]; // Full-Stack Web Developer
    } else if (careerGoal.includes("Backend")) {
      if (technicalBackground.includes("Java")) {
        recommendedPath = paths[1]; // Java Enterprise Developer
      } else {
        recommendedPath = paths[0]; // Full-Stack (includes Node.js backend)
      }
    } else if (careerGoal.includes("DevOps") || careerGoal.includes("Cloud")) {
      recommendedPath = paths[2]; // DevOps Engineer
    } else if (careerGoal.includes("Data Science")) {
      recommendedPath = paths[3]; // Data Science
    }

    // Determine starting course based on experience and technical background
    let startingCourse = 1; // Default to first course

    if (recommendedPath.id === 1) {
      // Full-Stack Web Developer
      if (technicalBackground.includes("HTML/CSS/JavaScript")) {
        startingCourse = 3; // Start with React
      } else if (experience.includes("1-2 năm")) {
        startingCourse = 2; // Start with JavaScript
      } else {
        startingCourse = 1; // Start with HTML/CSS
      }
    } else if (recommendedPath.id === 2) {
      // Java Enterprise Developer
      if (technicalBackground.includes("Java")) {
        startingCourse = 7; // Start with Spring Boot
      } else {
        startingCourse = 6; // Start with Java Fundamentals
      }
    } else if (recommendedPath.id === 3) {
      // DevOps Engineer
      if (experience.includes("trên 2 năm")) {
        startingCourse = 10; // Start with Docker
      } else {
        startingCourse = 19; // Start with Git
      }
    } else if (recommendedPath.id === 4) {
      // Data Science
      if (technicalBackground.includes("Python")) {
        startingCourse = 15; // Start with Pandas & NumPy
      } else {
        startingCourse = 14; // Start with Python for Data Science
      }
    }

    // Adjust timeline based on time commitment
    let timeMultiplier = 1;
    if (timeCommitment.includes("Dưới 5")) {
      timeMultiplier = 1.5;
    } else if (timeCommitment.includes("Trên 15")) {
      timeMultiplier = 0.7;
    }

    const baseDuration = parseInt(
      recommendedPath.estimatedDuration.split("-")[0]
    );
    const adjustedDuration = Math.ceil(baseDuration * timeMultiplier);

    // Generate personalized tips based on path and experience
    const baseTips = [
      "Thực hành coding mỗi ngày, dù chỉ 30 phút",
      "Tham gia community và forums để học hỏi",
      "Xây dựng portfolio với các dự án thực tế",
      "Đừng ngại hỏi khi gặp khó khăn",
      "Tập trung vào quality hơn là quantity",
    ];

    const pathSpecificTips: { [key: number]: string[] } = {
      1: [
        // Full-Stack
        "Tạo responsive websites từ những ngày đầu",
        "Học cách debug với browser developer tools",
        "Thực hành với các API thực tế",
      ],
      2: [
        // Java Enterprise
        "Nắm vững OOP principles trước khi học framework",
        "Thực hành với database design patterns",
        "Tìm hiểu về enterprise architecture patterns",
      ],
      3: [
        // DevOps
        "Thực hành với cloud platforms miễn phí",
        "Tự động hóa mọi thứ có thể",
        "Học monitoring và logging từ đầu",
      ],
      4: [
        // Data Science
        "Thực hành với datasets thực tế",
        "Học statistics song song với programming",
        "Tạo data visualizations thường xuyên",
      ],
    };

    const tips = [
      ...baseTips.slice(0, 3),
      ...(pathSpecificTips[recommendedPath.id] || []).slice(0, 2),
    ];

    return {
      recommendedPath,
      startingCourse,
      estimatedTimeToComplete: `${adjustedDuration}-${
        adjustedDuration + 2
      } tháng`,
      tips,
    };
  }
}

export const learningPathService = new LearningPathService();
