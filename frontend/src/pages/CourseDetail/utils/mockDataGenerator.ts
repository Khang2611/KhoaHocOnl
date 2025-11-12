import { Course } from "../../../types";

export const generateMockData = (course: Course) => {
  const title = course.courseTitle.toLowerCase();

  if (title.includes("spring")) {
    return {
      duration: "3 giờ 3 phút", // 75+108 = 183 minutes = 3h 3m
      level: "Trung cấp",
      language: "Tiếng Việt",
      students: 1234,
      rating: 4.8,
      reviews: 156,
      lastUpdated: "Tháng 10, 2024",
      completionRate: 85,
      requirements: [
        "Kiến thức cơ bản về lập trình Java",
        "Hiểu biết về OOP và cấu trúc dữ liệu",
        "Máy tính có kết nối internet ổn định",
        "Tinh thần học hỏi và kiên trì",
      ],
      whatYouWillLearn: [
        "Xây dựng ứng dụng web hoàn chỉnh với Spring Boot",
        "Thiết kế API RESTful chuyên nghiệp và scalable",
        "Tích hợp cơ sở dữ liệu MySQL hiệu quả",
        "Bảo mật ứng dụng với JWT và Spring Security",
        "Deploy ứng dụng lên cloud platform",
        "Best practices trong phát triển Java web",
      ],
      curriculum: [
        {
          title: "Giới thiệu về Spring Boot",
          duration: "45 phút",
          lessons: 5,
          topics: [
            {
              title: "Tổng quan Spring Framework",
              videoUrl: "https://www.youtube.com/watch?v=vtPkZShrvXQ",
            },
            {
              title: "Cài đặt môi trường",
              videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
            },
            {
              title: "Project đầu tiên",
              videoUrl: "https://www.youtube.com/watch?v=msXL2oDexqw",
            },
          ],
        },
        {
          title: "Xây dựng REST API",
          duration: "2 giờ",
          lessons: 8,
          topics: [
            {
              title: "Controller Design",
              videoUrl: "https://www.youtube.com/watch?v=5E-BqvgBaYM",
            },
            {
              title: "Request Mapping",
              videoUrl: "https://www.youtube.com/watch?v=u8a25mQcMOI",
            },
            {
              title: "Response Handling",
              videoUrl: "https://www.youtube.com/watch?v=xzpHHxmXWyw",
            },
            {
              title: "Error Management",
              videoUrl: "https://www.youtube.com/watch?v=PzK4ZXa2Tbc",
            },
          ],
        },
      ],
      instructor: {
        name: course.createBy?.fullName || "Giảng viên Spring",
        title: "Senior Spring Boot Developer",
        experience: "5+ năm kinh nghiệm",
        courses: 12,
        students: 5000,
        rating: 4.9,
      },
    };
  } else if (title.includes("java")) {
    return {
      duration: "5 giờ 17 phút", // 158+159 = 317 minutes = 5h 17m
      level: "Cơ bản đến Trung cấp",
      language: "Tiếng Việt",
      students: 892,
      rating: 4.6,
      reviews: 134,
      lastUpdated: "Tháng 10, 2024",
      completionRate: 79,
      requirements: [
        "Không cần kiến thức lập trình trước đó",
        "Máy tính Windows/Mac/Linux",
        "JDK 8 hoặc cao hơn",
        "IDE Java (Eclipse, IntelliJ IDEA)",
      ],
      whatYouWillLearn: [
        "Nắm vững cú pháp Java từ cơ bản đến nâng cao",
        "Lập trình hướng đối tượng (OOP) với Java",
        "Xử lý exception và debugging",
        "Làm việc với Collections Framework",
        "File I/O và database connectivity",
        "Multithreading và concurrency",
      ],
      curriculum: [
        {
          title: "Java Cơ bản",
          duration: "3 giờ",
          lessons: 12,
          topics: [
            {
              title: "Cú pháp Java",
              videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
            },
            {
              title: "Biến và kiểu dữ liệu",
              videoUrl: "https://www.youtube.com/watch?v=TBWX97e1E9g",
            },
            {
              title: "Vòng lặp và điều kiện",
              videoUrl: "https://www.youtube.com/watch?v=ldYLYRNaucM",
            },
            {
              title: "Methods và Arrays",
              videoUrl: "https://www.youtube.com/watch?v=xk4_1vDrzzo",
            },
          ],
        },
        {
          title: "Lập trình hướng đối tượng",
          duration: "4 giờ",
          lessons: 15,
          topics: [
            {
              title: "Classes và Objects",
              videoUrl: "https://www.youtube.com/watch?v=IUqKuGNasdM",
            },
            {
              title: "Inheritance và Polymorphism",
              videoUrl: "https://www.youtube.com/watch?v=9JpNY-XAseg",
            },
            {
              title: "Abstract classes và Interfaces",
              videoUrl: "https://www.youtube.com/watch?v=HvPlEJ3LHgE",
            },
            {
              title: "Encapsulation",
              videoUrl: "https://www.youtube.com/watch?v=Ts1uxkiupfo",
            },
          ],
        },
      ],
      instructor: {
        name: course.createBy?.fullName || "Giảng viên Java",
        title: "Java Developer & Instructor",
        experience: "4+ năm kinh nghiệm",
        courses: 8,
        students: 3500,
        rating: 4.7,
      },
    };
  } else if (title.includes("python")) {
    return {
      duration: "10 giờ 15 phút",
      level: "Cơ bản đến Trung cấp",
      language: "Tiếng Việt",
      students: 987,
      rating: 4.6,
      reviews: 123,
      lastUpdated: "Tháng 10, 2024",
      completionRate: 78,
      requirements: [
        "Không cần kiến thức lập trình trước đó",
        "Máy tính Windows/Mac/Linux",
        "Kết nối internet ổn định",
        "Sẵn sàng thực hành nhiều",
      ],
      whatYouWillLearn: [
        "Nắm vững cú pháp Python từ cơ bản đến nâng cao",
        "Xử lý dữ liệu với Pandas và NumPy",
        "Tạo ứng dụng web với Flask/Django",
        "Làm việc với API và cơ sở dữ liệu",
        "Automation và scripting",
        "Data visualization với Matplotlib",
      ],
      curriculum: [
        {
          title: "Python Cơ bản",
          duration: "2 giờ",
          lessons: 10,
          topics: [
            {
              title: "Cú pháp Python",
              videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
            },
            {
              title: "Biến và kiểu dữ liệu",
              videoUrl: "https://www.youtube.com/watch?v=OH86oLzVzzw",
            },
            {
              title: "Vòng lặp và điều kiện",
              videoUrl: "https://www.youtube.com/watch?v=6iF8Xb7Z3wQ",
            },
            {
              title: "Functions",
              videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
            },
          ],
        },
        {
          title: "Thư viện và Frameworks",
          duration: "3 giờ",
          lessons: 12,
          topics: [
            {
              title: "NumPy basics",
              videoUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
            },
            {
              title: "Pandas for data",
              videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
            },
            {
              title: "Flask web framework",
              videoUrl: "https://www.youtube.com/watch?v=Z1RJmh_OqeA",
            },
            {
              title: "API integration",
              videoUrl: "https://www.youtube.com/watch?v=GJ5VF3aXGSs",
            },
          ],
        },
      ],
      instructor: {
        name: course.createBy?.fullName || "Giảng viên Python",
        title: "Python Developer & Data Scientist",
        experience: "4+ năm kinh nghiệm",
        courses: 8,
        students: 3000,
        rating: 4.7,
      },
    };
  } else if (title.includes("c++") || title.includes("cpp")) {
    return {
      duration: "15 giờ 20 phút",
      level: "Trung cấp đến Nâng cao",
      language: "Tiếng Việt",
      students: 654,
      rating: 4.7,
      reviews: 89,
      lastUpdated: "Tháng 10, 2024",
      completionRate: 72,
      requirements: [
        "Kiến thức lập trình cơ bản",
        "Hiểu biết về thuật toán và cấu trúc dữ liệu",
        "IDE C++ (Visual Studio, Code::Blocks)",
        "Kiên nhẫn với debugging",
      ],
      whatYouWillLearn: [
        "Nắm vững cú pháp C++ và OOP",
        "Quản lý bộ nhớ và con trỏ",
        "STL (Standard Template Library)",
        "Lập trình đa luồng (Multithreading)",
        "Design patterns trong C++",
        "Tối ưu hóa performance",
      ],
      curriculum: [
        {
          title: "C++ Fundamentals",
          duration: "3 giờ",
          lessons: 15,
          topics: [
            {
              title: "Syntax và Data types",
              videoUrl: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
            },
            {
              title: "Pointers và References",
              videoUrl: "https://www.youtube.com/watch?v=kiUGf_Z08RQ",
            },
            {
              title: "Memory management",
              videoUrl: "https://www.youtube.com/watch?v=DTxHyVn0ODg",
            },
            {
              title: "Functions",
              videoUrl: "https://www.youtube.com/watch?v=V9zuox47zr0",
            },
          ],
        },
        {
          title: "Advanced C++",
          duration: "5 giờ",
          lessons: 20,
          topics: [
            {
              title: "Templates",
              videoUrl: "https://www.youtube.com/watch?v=I-hZkUa9mIs",
            },
            {
              title: "STL containers",
              videoUrl: "https://www.youtube.com/watch?v=Aa2iFVVDbfE",
            },
            {
              title: "Exception handling",
              videoUrl: "https://www.youtube.com/watch?v=0ojB8c0xUd8",
            },
            {
              title: "Smart pointers",
              videoUrl: "https://www.youtube.com/watch?v=UOB7-B2MfwA",
            },
          ],
        },
      ],
      instructor: {
        name: course.createBy?.fullName || "Giảng viên C++",
        title: "Senior C++ Engineer",
        experience: "7+ năm kinh nghiệm",
        courses: 6,
        students: 2500,
        rating: 4.8,
      },
    };
  } else {
    return {
      duration: "8 giờ 45 phút",
      level: "Cơ bản",
      language: "Tiếng Việt",
      students: Math.floor(Math.random() * 1000) + 500,
      rating: 4.3 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 100) + 50,
      lastUpdated: "Tháng 10, 2024",
      completionRate: Math.floor(Math.random() * 20) + 70,
      requirements: [
        "Kiến thức cơ bản về máy tính",
        "Kết nối internet ổn định",
        "Tinh thần học hỏi và kiên trì",
      ],
      whatYouWillLearn: [
        "Nắm vững kiến thức cơ bản của môn học",
        "Thực hành với các dự án thực tế",
        "Hiểu sâu về best practices",
        "Chuẩn bị cho công việc thực tế",
        "Phát triển kỹ năng giải quyết vấn đề",
        "Xây dựng portfolio chuyên nghiệp",
      ],
      curriculum: [
        {
          title: "Giới thiệu khóa học",
          duration: "2 giờ",
          lessons: 5,
          topics: [
            {
              title: "Tổng quan",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
              title: "Cài đặt môi trường",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
              title: "Bài tập đầu tiên",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
          ],
        },
        {
          title: "Kiến thức nâng cao",
          duration: "4 giờ",
          lessons: 10,
          topics: [
            {
              title: "Concepts chính",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
              title: "Thực hành",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
              title: "Dự án thực tế",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
          ],
        },
      ],
      instructor: {
        name: course.createBy?.fullName || "Giảng viên",
        title: "Chuyên gia lập trình",
        experience: "3+ năm kinh nghiệm",
        courses: Math.floor(Math.random() * 10) + 5,
        students: Math.floor(Math.random() * 5000) + 2000,
        rating: 4.5 + Math.random() * 0.4,
      },
    };
  }
};
