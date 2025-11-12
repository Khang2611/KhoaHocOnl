import { CourseSection } from "../types";

class CourseContentService {
  // Generate course structure based on course title and ID
  generateCourseStructure(
    courseTitle: string,
    courseId: number
  ): CourseSection[] {
    const title = courseTitle.toLowerCase();

    if (title.includes("spring")) {
      return this.generateSpringBootStructure(courseId);
    } else if (title.includes("java") && !title.includes("javascript")) {
      return this.generateJavaStructure(courseId);
    } else if (title.includes("python")) {
      return this.generatePythonStructure(courseId);
    } else if (title.includes("react") || title.includes("javascript")) {
      return this.generateReactStructure(courseId);
    } else if (title.includes("nodejs") || title.includes("node.js")) {
      return this.generateNodeJSStructure(courseId);
    } else if (title.includes("c++") || title.includes("cpp")) {
      return this.generateCppStructure(courseId);
    } else if (
      title.includes("web") ||
      title.includes("html") ||
      title.includes("css")
    ) {
      return this.generateWebDevelopmentStructure(courseId);
    } else if (title.includes("mysql") || title.includes("database")) {
      return this.generateDatabaseStructure(courseId);
    } else if (title.includes("docker") || title.includes("devops")) {
      return this.generateDevOpsStructure(courseId);
    } else {
      return this.generateGenericStructure(courseId, courseTitle);
    }
  }

  private generateSpringBootStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "Giới thiệu về Spring Boot",
        description:
          "Tìm hiểu về Spring Framework và Spring Boot từ cơ bản đến nâng cao",
        orderIndex: 1,
        estimatedDuration: 75, // 25+18+32 = 75 minutes
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Tổng quan Spring Framework",
            description: "Hiểu về Spring Framework và các tính năng chính",
            orderIndex: 1,
            estimatedDuration: 25, // 25:30 minutes
            contents: [
              {
                contentId: 1,
                contentTitle: "Video: Spring Boot Overview",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/vtPkZShrvXQ",
              },
            ],
          },
          {
            lessonId: 2,
            lessonTitle: "Cài đặt môi trường",
            description:
              "Hướng dẫn cài đặt và cấu hình môi trường để phát triển Spring Boot",
            orderIndex: 2,
            estimatedDuration: 18, // 18:45 minutes
            contents: [
              {
                contentId: 2,
                contentTitle: "Video: Cài đặt môi trường",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/9SGDpanrc8U",
              },
            ],
          },
          {
            lessonId: 3,
            lessonTitle: "Project đầu tiên",
            description: "Tạo và chạy ứng dụng Spring Boot đầu tiên",
            orderIndex: 3,
            estimatedDuration: 32, // 32:15 minutes
            contents: [
              {
                contentId: 3,
                contentTitle: "Video: Project đầu tiên",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/msXL2oDexqw",
              },
            ],
          },
          {
            lessonId: 2,
            lessonTitle: "Cài đặt môi trường phát triển",
            description:
              "Hướng dẫn cài đặt và cấu hình môi trường để phát triển Spring Boot",
            orderIndex: 2,
            estimatedDuration: 45,
            contents: [
              {
                contentId: 4,
                contentTitle: "Yêu cầu hệ thống và cài đặt",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Cài đặt môi trường phát triển Spring Boot</h2>
                  
                  <h3>Yêu cầu hệ thống:</h3>
                  <ul>
                    <li><strong>Java JDK:</strong> Phiên bản 8 hoặc cao hơn (khuyến nghị JDK 11 hoặc 17)</li>
                    <li><strong>IDE:</strong> IntelliJ IDEA, Eclipse, hoặc Visual Studio Code</li>
                    <li><strong>Build Tool:</strong> Maven 3.6+ hoặc Gradle 6+</li>
                    <li><strong>Database:</strong> MySQL, PostgreSQL, hoặc H2 (cho development)</li>
                  </ul>
                  
                  <h3>Các bước cài đặt chi tiết:</h3>
                  
                  <h4>1. Cài đặt Java JDK</h4>
                  <pre><code>
# Kiểm tra Java version
java -version
javac -version

# Cài đặt JDK 17 (Ubuntu/Debian)
sudo apt update
sudo apt install openjdk-17-jdk

# Cài đặt JDK 17 (Windows)
# Tải từ https://adoptium.net/
                  </code></pre>
                  
                  <h4>2. Cài đặt Maven</h4>
                  <pre><code>
# Ubuntu/Debian
sudo apt install maven

# Windows - tải từ https://maven.apache.org/
# Thêm vào PATH environment variable

# Kiểm tra Maven
mvn -version
                  </code></pre>
                  
                  <h4>3. Cấu hình IDE</h4>
                  <p><strong>IntelliJ IDEA:</strong></p>
                  <ul>
                    <li>Cài đặt Spring Boot plugin</li>
                    <li>Cấu hình JDK trong Project Structure</li>
                    <li>Enable annotation processing</li>
                  </ul>
                  
                  <p><strong>Visual Studio Code:</strong></p>
                  <ul>
                    <li>Cài đặt Extension Pack for Java</li>
                    <li>Cài đặt Spring Boot Extension Pack</li>
                    <li>Cấu hình Java Home</li>
                  </ul>
                  
                  <h4>4. Tạo project đầu tiên</h4>
                  <p>Sử dụng Spring Initializr tại <a href="https://start.spring.io">start.spring.io</a> để tạo project template với các dependencies cần thiết.</p>
                `,
                estimatedReadTime: 12,
              },
              {
                contentId: 5,
                contentTitle: "Hướng dẫn cài đặt chi tiết",
                contentType: "DOCUMENT",
                orderIndex: 2,
                documentUrl: "/documents/spring-boot-setup-guide.pdf",
                fileType: "pdf",
                fileSize: "2.5 MB",
              },
              {
                contentId: 6,
                contentTitle: "Demo: Tạo project Spring Boot đầu tiên",
                contentType: "VIDEO",
                orderIndex: 3,
                videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
              },
            ],
          },
          {
            lessonId: 3,
            lessonTitle: "Project đầu tiên với Spring Boot",
            description: "Tạo và chạy ứng dụng Spring Boot đầu tiên",
            orderIndex: 3,
            estimatedDuration: 45,
            contents: [
              {
                contentId: 7,
                contentTitle: "Tạo Hello World Application",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Tạo ứng dụng Spring Boot đầu tiên</h2>
                  
                  <h3>Cấu trúc project cơ bản</h3>
                  <pre><code>
my-spring-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── DemoApplication.java
│   │   │       └── controller/
│   │   │           └── HelloController.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
├── pom.xml
└── README.md
                  </code></pre>
                  
                  <h3>Main Application Class</h3>
                  <pre><code>
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
                  </code></pre>
                  
                  <h3>Tạo REST Controller đầu tiên</h3>
                  <pre><code>
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    
    @GetMapping("/")
    public String hello() {
        return "Hello, Spring Boot!";
    }
    
    @GetMapping("/api/greeting")
    public String greeting() {
        return "Welcome to Spring Boot API!";
    }
}
                  </code></pre>
                  
                  <h3>Chạy ứng dụng</h3>
                  <pre><code>
# Sử dụng Maven
mvn spring-boot:run

# Hoặc build và chạy JAR
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
                  </code></pre>
                  
                  <p>Ứng dụng sẽ chạy trên <code>http://localhost:8080</code></p>
                `,
                estimatedReadTime: 10,
              },
            ],
          },
        ],
      },
      {
        sectionId: 2,
        sectionTitle: "Xây dựng REST API",
        description: "Tạo REST API với Spring Boot và Spring MVC",
        orderIndex: 2,
        estimatedDuration: 108, // 29+22+26+31 = 108 minutes
        lessons: [
          {
            lessonId: 4,
            lessonTitle: "Controller Design",
            description: "Tìm hiểu về Spring MVC Controller và các annotation",
            orderIndex: 1,
            estimatedDuration: 29, // 29:18 minutes
            contents: [
              {
                contentId: 4,
                contentTitle: "Video: Controller Design",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/5E-BqvgBaYM",
              },
            ],
          },
          {
            lessonId: 5,
            lessonTitle: "Request Mapping",
            description: "Học cách mapping HTTP requests trong Spring",
            orderIndex: 2,
            estimatedDuration: 22, // 22:45 minutes
            contents: [
              {
                contentId: 5,
                contentTitle: "Video: Request Mapping",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/u8a25mQcMOI",
              },
            ],
          },
          {
            lessonId: 6,
            lessonTitle: "Response Handling",
            description: "Xử lý response trong Spring Boot",
            orderIndex: 3,
            estimatedDuration: 26, // 26:33 minutes
            contents: [
              {
                contentId: 6,
                contentTitle: "Video: Response Handling",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/xzpHHxmXWyw",
              },
            ],
          },
          {
            lessonId: 7,
            lessonTitle: "Error Management",
            description: "Quản lý lỗi trong Spring Boot applications",
            orderIndex: 4,
            estimatedDuration: 31, // 31:20 minutes
            contents: [
              {
                contentId: 8,
                contentTitle: "Spring MVC Controller",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Spring MVC Controller</h2>
                  
                  <p>Controller là thành phần xử lý HTTP requests trong Spring MVC. Nó nhận requests từ client, xử lý business logic, và trả về response.</p>
                  
                  <h3>Các annotation quan trọng:</h3>
                  <ul>
                    <li><code>@RestController</code>: Kết hợp @Controller và @ResponseBody</li>
                    <li><code>@RequestMapping</code>: Định nghĩa base URL cho controller</li>
                    <li><code>@GetMapping, @PostMapping, @PutMapping, @DeleteMapping</code>: HTTP method mapping</li>
                    <li><code>@PathVariable</code>: Lấy giá trị từ URL path</li>
                    <li><code>@RequestParam</code>: Lấy query parameters</li>
                    <li><code>@RequestBody</code>: Bind request body vào object</li>
                  </ul>
                  
                  <h3>Ví dụ Controller cơ bản:</h3>
                  <pre><code>
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List&lt;User&gt; getAllUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }
    
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
                  </code></pre>
                  
                  <h3>Request Parameters và Query Strings</h3>
                  <pre><code>
@GetMapping("/search")
public List&lt;User&gt; searchUsers(
    @RequestParam String name,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    
    return userService.search(name, page, size);
}

// URL: /api/users/search?name=John&page=0&size=5
                  </code></pre>
                  
                  <h3>Response Entity và HTTP Status</h3>
                  <pre><code>
@PostMapping
public ResponseEntity&lt;User&gt; createUser(@RequestBody User user) {
    try {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
                  </code></pre>
                `,
                estimatedReadTime: 15,
              },
              {
                contentId: 9,
                contentTitle: "Demo: Tạo REST Controller",
                contentType: "VIDEO",
                orderIndex: 2,
                videoUrl: "https://www.youtube.com/watch?v=5E-BqvgBaYM",
              },
            ],
          },
        ],
      },
    ];
  }

  private generateJavaStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "Java Cơ bản",
        description: "Học các khái niệm cơ bản của ngôn ngữ lập trình Java",
        orderIndex: 1,
        estimatedDuration: 158, // 43+28+35+52 = 158 minutes
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Cú pháp Java",
            description: "Tìm hiểu cú pháp cơ bản của Java",
            orderIndex: 1,
            estimatedDuration: 43, // 43:21 minutes
            contents: [
              {
                contentId: 1,
                contentTitle: "Cú pháp Java",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
              },
            ],
          },
          {
            lessonId: 2,
            lessonTitle: "Biến và kiểu dữ liệu",
            description:
              "Học cách khai báo biến và các kiểu dữ liệu trong Java",
            orderIndex: 2,
            estimatedDuration: 28, // 28:15 minutes
            contents: [
              {
                contentId: 2,
                contentTitle: "Biến và kiểu dữ liệu",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/TBWX97e1E9g",
              },
            ],
          },
          {
            lessonId: 3,
            lessonTitle: "Vòng lặp và điều kiện",
            description: "Tìm hiểu về các cấu trúc điều khiển trong Java",
            orderIndex: 3,
            estimatedDuration: 35, // 35:42 minutes
            contents: [
              {
                contentId: 3,
                contentTitle: "Vòng lặp và điều kiện",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/ldYLYRNaucM",
              },
            ],
          },
          {
            lessonId: 4,
            lessonTitle: "Methods và Arrays",
            description: "Học cách tạo methods và làm việc với arrays",
            orderIndex: 4,
            estimatedDuration: 52, // 52:18 minutes
            contents: [
              {
                contentId: 4,
                contentTitle: "Methods và Arrays",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/xk4_1vDrzzo",
              },
            ],
          },
        ],
      },
      {
        sectionId: 2,
        sectionTitle: "Lập trình hướng đối tượng",
        description: "Học các khái niệm OOP trong Java",
        orderIndex: 2,
        estimatedDuration: 159, // 47+38+41+33 = 159 minutes
        lessons: [
          {
            lessonId: 5,
            lessonTitle: "Classes và Objects",
            description: "Tìm hiểu về classes và objects trong Java",
            orderIndex: 1,
            estimatedDuration: 47, // 47:32 minutes
            contents: [
              {
                contentId: 5,
                contentTitle: "Classes và Objects",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/IUqKuGNasdM",
              },
            ],
          },
          {
            lessonId: 6,
            lessonTitle: "Inheritance và Polymorphism",
            description: "Học về tính kế thừa và đa hình trong Java",
            orderIndex: 2,
            estimatedDuration: 38, // 38:25 minutes
            contents: [
              {
                contentId: 6,
                contentTitle: "Inheritance và Polymorphism",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/9JpNY-XAseg",
              },
            ],
          },
          {
            lessonId: 7,
            lessonTitle: "Abstract classes và Interfaces",
            description: "Tìm hiểu về abstract classes và interfaces",
            orderIndex: 3,
            estimatedDuration: 41, // 41:15 minutes
            contents: [
              {
                contentId: 7,
                contentTitle: "Abstract classes và Interfaces",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/HvPlEJ3LHgE",
              },
            ],
          },
          {
            lessonId: 8,
            lessonTitle: "Encapsulation",
            description: "Học về tính đóng gói trong Java",
            orderIndex: 4,
            estimatedDuration: 33, // 33:48 minutes
            contents: [
              {
                contentId: 8,
                contentTitle: "Encapsulation",
                contentType: "VIDEO",
                orderIndex: 1,
                videoUrl: "https://www.youtube.com/embed/Ts1uxkiupfo",
              },
            ],
          },
        ],
      },
    ];
  }

  private generatePythonStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "Python Cơ bản",
        description: "Học các khái niệm cơ bản của ngôn ngữ lập trình Python",
        orderIndex: 1,
        estimatedDuration: 150,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Cú pháp Python và biến",
            description:
              "Tìm hiểu cú pháp cơ bản và cách khai báo biến trong Python",
            orderIndex: 1,
            estimatedDuration: 40,
            contents: [
              {
                contentId: 1,
                contentTitle: "Python Syntax Fundamentals",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Cú pháp Python cơ bản</h2>
                  
                  <h3>Hello World trong Python:</h3>
                  <pre><code>
print("Hello, World!")
                  </code></pre>
                  
                  <h3>Khai báo biến:</h3>
                  <pre><code>
# Python là dynamically typed
name = "Alice"
age = 30
height = 5.6
is_student = True

# Lists và Dictionaries
fruits = ["apple", "banana", "orange"]
person = {
    "name": "John",
    "age": 25,
    "city": "New York"
}
                  </code></pre>
                  
                  <h3>Indentation trong Python:</h3>
                  <p>Python sử dụng indentation để định nghĩa code blocks thay vì dấu ngoặc nhọn.</p>
                  <pre><code>
if age >= 18:
    print("You are an adult")
    if age >= 65:
        print("You are a senior")
else:
    print("You are a minor")
                  </code></pre>
                `,
                estimatedReadTime: 6,
              },
            ],
          },
        ],
      },
    ];
  }

  private generateCppStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "C++ Fundamentals",
        description: "Học các khái niệm cơ bản của ngôn ngữ lập trình C++",
        orderIndex: 1,
        estimatedDuration: 200,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "C++ Syntax và Data Types",
            description:
              "Tìm hiểu cú pháp cơ bản và các kiểu dữ liệu trong C++",
            orderIndex: 1,
            estimatedDuration: 50,
            contents: [
              {
                contentId: 1,
                contentTitle: "C++ Basic Syntax",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Cú pháp C++ cơ bản</h2>
                  
                  <h3>Hello World trong C++:</h3>
                  <pre><code>
#include &lt;iostream&gt;
using namespace std;

int main() {
    cout &lt;&lt; "Hello, World!" &lt;&lt; endl;
    return 0;
}
                  </code></pre>
                  
                  <h3>Khai báo biến và kiểu dữ liệu:</h3>
                  <pre><code>
#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    // Kiểu dữ liệu cơ bản
    int age = 25;
    double salary = 50000.50;
    char grade = 'A';
    bool isActive = true;
    
    // String
    string name = "John Doe";
    
    // Arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    
    cout &lt;&lt; "Name: " &lt;&lt; name &lt;&lt; endl;
    cout &lt;&lt; "Age: " &lt;&lt; age &lt;&lt; endl;
    
    return 0;
}
                  </code></pre>
                  
                  <h3>Pointers và References:</h3>
                  <pre><code>
int x = 10;
int* ptr = &x;  // Pointer to x
int& ref = x;   // Reference to x

cout &lt;&lt; "Value: " &lt;&lt; x &lt;&lt; endl;
cout &lt;&lt; "Pointer: " &lt;&lt; *ptr &lt;&lt; endl;
cout &lt;&lt; "Reference: " &lt;&lt; ref &lt;&lt; endl;
                  </code></pre>
                `,
                estimatedReadTime: 10,
              },
            ],
          },
        ],
      },
    ];
  }

  // React Development Course Structure
  private generateReactStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "React Fundamentals",
        description: "Học các khái niệm cơ bản của React và JSX",
        orderIndex: 1,
        estimatedDuration: 240,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Giới thiệu React và JSX",
            description: "Tìm hiểu về React library và cú pháp JSX",
            orderIndex: 1,
            estimatedDuration: 45,
            contents: [
              {
                contentId: 1,
                contentTitle: "React là gì và tại sao nên học?",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>React - Thư viện JavaScript phổ biến nhất</h2>
                  
                  <h3>React là gì?</h3>
                  <p>React là một thư viện JavaScript được phát triển bởi Facebook để xây dựng giao diện người dùng (UI), đặc biệt là cho các ứng dụng web single-page.</p>
                  
                  <h3>Tại sao nên học React?</h3>
                  <ul>
                    <li><strong>Phổ biến:</strong> Được sử dụng bởi Facebook, Netflix, Airbnb, Uber...</li>
                    <li><strong>Component-based:</strong> Tái sử dụng code hiệu quả</li>
                    <li><strong>Virtual DOM:</strong> Performance tối ưu</li>
                    <li><strong>Ecosystem mạnh:</strong> Nhiều thư viện hỗ trợ</li>
                    <li><strong>Job opportunities:</strong> Nhu cầu tuyển dụng cao</li>
                  </ul>
                  
                  <h3>JSX - JavaScript XML</h3>
                  <p>JSX là cú pháp mở rộng cho JavaScript, cho phép viết HTML-like syntax trong JavaScript:</p>
                  <pre><code>
const element = &lt;h1&gt;Hello, World!&lt;/h1&gt;;

// JSX với JavaScript expressions
const name = 'John';
const greeting = &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;

// JSX với attributes
const image = &lt;img src="avatar.jpg" alt="User Avatar" /&gt;;
                  </code></pre>
                  
                  <h3>Cài đặt môi trường React</h3>
                  <pre><code>
# Cài đặt Node.js và npm trước
# Tạo React app mới
npx create-react-app my-app
cd my-app
npm start

# Hoặc sử dụng Vite (nhanh hơn)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
                  </code></pre>
                `,
                estimatedReadTime: 12,
              },
              {
                contentId: 2,
                contentTitle: "Demo: Tạo React App đầu tiên",
                contentType: "VIDEO",
                orderIndex: 2,
                videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
              },
            ],
          },
          {
            lessonId: 2,
            lessonTitle: "Components và Props",
            description: "Học cách tạo và sử dụng React components",
            orderIndex: 2,
            estimatedDuration: 60,
            contents: [
              {
                contentId: 3,
                contentTitle: "React Components Deep Dive",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>React Components - Building Blocks của ứng dụng</h2>
                  
                  <h3>Function Components (Khuyến nghị)</h3>
                  <pre><code>
// Component đơn giản
function Welcome() {
  return &lt;h1&gt;Hello, World!&lt;/h1&gt;;
}

// Component với props
function Welcome({ name, age }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, {name}!&lt;/h1&gt;
      &lt;p&gt;You are {age} years old.&lt;/p&gt;
    &lt;/div&gt;
  );
}

// Sử dụng component
function App() {
  return (
    &lt;div&gt;
      &lt;Welcome name="Alice" age={25} /&gt;
      &lt;Welcome name="Bob" age={30} /&gt;
    &lt;/div&gt;
  );
}
                  </code></pre>
                  
                  <h3>Props - Truyền dữ liệu giữa components</h3>
                  <pre><code>
// UserCard component
function UserCard({ user, onEdit, onDelete }) {
  return (
    &lt;div className="user-card"&gt;
      &lt;img src={user.avatar} alt={user.name} /&gt;
      &lt;h3&gt;{user.name}&lt;/h3&gt;
      &lt;p&gt;{user.email}&lt;/p&gt;
      &lt;button onClick={() =&gt; onEdit(user.id)}&gt;Edit&lt;/button&gt;
      &lt;button onClick={() =&gt; onDelete(user.id)}&gt;Delete&lt;/button&gt;
    &lt;/div&gt;
  );
}

// Sử dụng UserCard
function UserList() {
  const users = [
    { id: 1, name: 'John', email: 'john@example.com', avatar: 'john.jpg' },
    { id: 2, name: 'Jane', email: 'jane@example.com', avatar: 'jane.jpg' }
  ];

  const handleEdit = (userId) =&gt; {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) =&gt; {
    console.log('Delete user:', userId);
  };

  return (
    &lt;div&gt;
      {users.map(user =&gt; (
        &lt;UserCard 
          key={user.id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        /&gt;
      ))}
    &lt;/div&gt;
  );
}
                  </code></pre>
                  
                  <h3>Props Validation với PropTypes</h3>
                  <pre><code>
import PropTypes from 'prop-types';

function UserCard({ user, onEdit, onDelete }) {
  // Component code...
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

UserCard.defaultProps = {
  user: {
    avatar: 'default-avatar.jpg'
  }
};
                  </code></pre>
                `,
                estimatedReadTime: 15,
              },
            ],
          },
          {
            lessonId: 3,
            lessonTitle: "State và Event Handling",
            description: "Quản lý state và xử lý events trong React",
            orderIndex: 3,
            estimatedDuration: 75,
            contents: [
              {
                contentId: 4,
                contentTitle: "useState Hook và Event Handling",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>State Management với useState Hook</h2>
                  
                  <h3>useState Hook cơ bản</h3>
                  <pre><code>
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
                  </code></pre>
                  
                  <h3>Multiple State Variables</h3>
                  <pre><code>
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) =&gt; {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitUser({ name, email, age });
      // Reset form
      setName('');
      setEmail('');
      setAge(0);
    } catch (error) {
      console.error('Error submitting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) =&gt; setName(e.target.value)}
      /&gt;
      &lt;input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =&gt; setEmail(e.target.value)}
      /&gt;
      &lt;input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) =&gt; setAge(parseInt(e.target.value))}
      /&gt;
      &lt;button type="submit" disabled={isSubmitting}&gt;
        {isSubmitting ? 'Submitting...' : 'Submit'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}
                  </code></pre>
                  
                  <h3>Object State và Array State</h3>
                  <pre><code>
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () =&gt; {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) =&gt; {
    setTodos(todos.map(todo =&gt;
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) =&gt; {
    setTodos(todos.filter(todo =&gt; todo.id !== id));
  };

  return (
    &lt;div&gt;
      &lt;input
        value={inputValue}
        onChange={(e) =&gt; setInputValue(e.target.value)}
        onKeyPress={(e) =&gt; e.key === 'Enter' && addTodo()}
      /&gt;
      &lt;button onClick={addTodo}&gt;Add Todo&lt;/button&gt;
      
      &lt;ul&gt;
        {todos.map(todo =&gt; (
          &lt;li key={todo.id}&gt;
            &lt;span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
              onClick={() =&gt; toggleTodo(todo.id)}
            &gt;
              {todo.text}
            &lt;/span&gt;
            &lt;button onClick={() =&gt; deleteTodo(todo.id)}&gt;Delete&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}
                  </code></pre>
                `,
                estimatedReadTime: 18,
              },
            ],
          },
        ],
      },
      {
        sectionId: 2,
        sectionTitle: "Advanced React Concepts",
        description: "Hooks nâng cao, Context API, và Performance Optimization",
        orderIndex: 2,
        estimatedDuration: 300,
        lessons: [
          {
            lessonId: 4,
            lessonTitle: "useEffect và Lifecycle",
            description: "Quản lý side effects và component lifecycle",
            orderIndex: 1,
            estimatedDuration: 90,
            contents: [
              {
                contentId: 5,
                contentTitle: "useEffect Hook Deep Dive",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>useEffect - Quản lý Side Effects</h2>
                  
                  <h3>useEffect cơ bản</h3>
                  <pre><code>
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() =&gt; {
    const fetchUser = async () =&gt; {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Dependency array

  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  if (error) return &lt;div&gt;Error: {error}&lt;/div&gt;;

  return (
    &lt;div&gt;
      &lt;h1&gt;{user.name}&lt;/h1&gt;
      &lt;p&gt;{user.email}&lt;/p&gt;
    &lt;/div&gt;
  );
}
                  </code></pre>
                  
                  <h3>Cleanup Functions</h3>
                  <pre><code>
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() =&gt; {
    const interval = setInterval(() =&gt; {
      setSeconds(prev =&gt; prev + 1);
    }, 1000);

    // Cleanup function
    return () =&gt; {
      clearInterval(interval);
    };
  }, []); // Empty dependency array = run once

  return &lt;div&gt;Timer: {seconds}s&lt;/div&gt;;
}

// WebSocket example
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() =&gt; {
    const socket = new WebSocket(\`ws://localhost:8080/chat/\${roomId}\`);
    
    socket.onmessage = (event) =&gt; {
      const message = JSON.parse(event.data);
      setMessages(prev =&gt; [...prev, message]);
    };

    return () =&gt; {
      socket.close();
    };
  }, [roomId]);

  return (
    &lt;div&gt;
      {messages.map(msg =&gt; (
        &lt;div key={msg.id}&gt;{msg.text}&lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}
                  </code></pre>
                  
                  <h3>Multiple useEffect Hooks</h3>
                  <pre><code>
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch user data
  useEffect(() =&gt; {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // Fetch user posts
  useEffect(() =&gt; {
    if (user) {
      fetchUserPosts(user.id).then(setPosts);
    }
  }, [user]);

  // Setup notifications
  useEffect(() =&gt; {
    const eventSource = new EventSource('/api/notifications');
    eventSource.onmessage = (event) =&gt; {
      const notification = JSON.parse(event.data);
      setNotifications(prev =&gt; [notification, ...prev]);
    };

    return () =&gt; eventSource.close();
  }, []);

  // Document title
  useEffect(() =&gt; {
    document.title = user ? \`\${user.name}'s Dashboard\` : 'Dashboard';
  }, [user]);

  return (
    &lt;div&gt;
      {/* Dashboard content */}
    &lt;/div&gt;
  );
}
                  </code></pre>
                `,
                estimatedReadTime: 20,
              },
            ],
          },
        ],
      },
    ];
  }

  // Node.js Development Course Structure
  private generateNodeJSStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "Node.js Fundamentals",
        description:
          "Học các khái niệm cơ bản của Node.js và JavaScript backend",
        orderIndex: 1,
        estimatedDuration: 180,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Giới thiệu Node.js",
            description:
              "Tìm hiểu về Node.js runtime và event-driven architecture",
            orderIndex: 1,
            estimatedDuration: 45,
            contents: [
              {
                contentId: 1,
                contentTitle: "Node.js là gì và tại sao quan trọng?",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Node.js - JavaScript Runtime cho Backend</h2>
                  
                  <h3>Node.js là gì?</h3>
                  <p>Node.js là một JavaScript runtime được xây dựng trên V8 JavaScript engine của Chrome, cho phép chạy JavaScript trên server-side.</p>
                  
                  <h3>Đặc điểm chính của Node.js:</h3>
                  <ul>
                    <li><strong>Event-driven:</strong> Sử dụng event loop để xử lý I/O operations</li>
                    <li><strong>Non-blocking I/O:</strong> Asynchronous operations cho performance cao</li>
                    <li><strong>Single-threaded:</strong> Một thread chính với thread pool cho I/O</li>
                    <li><strong>NPM ecosystem:</strong> Hàng triệu packages có sẵn</li>
                  </ul>
                  
                  <h3>Cài đặt Node.js</h3>
                  <pre><code>
# Kiểm tra version
node --version
npm --version

# Tạo package.json
npm init -y

# Cài đặt dependencies
npm install express
npm install --save-dev nodemon
                  </code></pre>
                  
                  <h3>Hello World Server</h3>
                  <pre><code>
// server.js
const http = require('http');

const server = http.createServer((req, res) =&gt; {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js World!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =&gt; {
  console.log(\`Server running on port \${PORT}\`);
});
                  </code></pre>
                  
                  <h3>Express.js Framework</h3>
                  <pre><code>
// app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) =&gt; {
  res.json({ message: 'Welcome to Node.js API!' });
});

app.get('/api/users', (req, res) =&gt; {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) =&gt; {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =&gt; {
  console.log(\`Server running on port \${PORT}\`);
});
                  </code></pre>
                `,
                estimatedReadTime: 15,
              },
            ],
          },
        ],
      },
    ];
  }

  // Web Development Course Structure
  private generateWebDevelopmentStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "HTML & CSS Fundamentals",
        description: "Học HTML5 và CSS3 từ cơ bản đến nâng cao",
        orderIndex: 1,
        estimatedDuration: 240,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "HTML5 Semantic Elements",
            description: "Tìm hiểu về HTML5 và các semantic elements",
            orderIndex: 1,
            estimatedDuration: 60,
            contents: [
              {
                contentId: 1,
                contentTitle: "HTML5 Modern Web Structure",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>HTML5 - Nền tảng của Web Development</h2>
                  
                  <h3>Cấu trúc HTML5 cơ bản</h3>
                  <pre><code>
&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;My Website&lt;/title&gt;
    &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;header&gt;
        &lt;nav&gt;
            &lt;ul&gt;
                &lt;li&gt;&lt;a href="#home"&gt;Home&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#contact"&gt;Contact&lt;/a&gt;&lt;/li&gt;
            &lt;/ul&gt;
        &lt;/nav&gt;
    &lt;/header&gt;
    
    &lt;main&gt;
        &lt;section id="home"&gt;
            &lt;h1&gt;Welcome to My Website&lt;/h1&gt;
            &lt;p&gt;This is the main content area.&lt;/p&gt;
        &lt;/section&gt;
        
        &lt;aside&gt;
            &lt;h2&gt;Sidebar&lt;/h2&gt;
            &lt;p&gt;Additional information here.&lt;/p&gt;
        &lt;/aside&gt;
    &lt;/main&gt;
    
    &lt;footer&gt;
        &lt;p&gt;&copy; 2024 My Website. All rights reserved.&lt;/p&gt;
    &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;
                  </code></pre>
                  
                  <h3>HTML5 Semantic Elements</h3>
                  <ul>
                    <li><code>&lt;header&gt;</code>: Phần đầu của trang hoặc section</li>
                    <li><code>&lt;nav&gt;</code>: Menu điều hướng</li>
                    <li><code>&lt;main&gt;</code>: Nội dung chính của trang</li>
                    <li><code>&lt;section&gt;</code>: Phần nội dung có chủ đề cụ thể</li>
                    <li><code>&lt;article&gt;</code>: Nội dung độc lập (blog post, news article)</li>
                    <li><code>&lt;aside&gt;</code>: Nội dung phụ (sidebar, related links)</li>
                    <li><code>&lt;footer&gt;</code>: Phần cuối của trang hoặc section</li>
                  </ul>
                  
                  <h3>Forms và Input Types</h3>
                  <pre><code>
&lt;form action="/submit" method="POST"&gt;
    &lt;fieldset&gt;
        &lt;legend&gt;Personal Information&lt;/legend&gt;
        
        &lt;label for="name"&gt;Full Name:&lt;/label&gt;
        &lt;input type="text" id="name" name="name" required&gt;
        
        &lt;label for="email"&gt;Email:&lt;/label&gt;
        &lt;input type="email" id="email" name="email" required&gt;
        
        &lt;label for="phone"&gt;Phone:&lt;/label&gt;
        &lt;input type="tel" id="phone" name="phone"&gt;
        
        &lt;label for="birthdate"&gt;Birth Date:&lt;/label&gt;
        &lt;input type="date" id="birthdate" name="birthdate"&gt;
        
        &lt;label for="website"&gt;Website:&lt;/label&gt;
        &lt;input type="url" id="website" name="website"&gt;
        
        &lt;label for="bio"&gt;Bio:&lt;/label&gt;
        &lt;textarea id="bio" name="bio" rows="4"&gt;&lt;/textarea&gt;
        
        &lt;label for="country"&gt;Country:&lt;/label&gt;
        &lt;select id="country" name="country"&gt;
            &lt;option value=""&gt;Select a country&lt;/option&gt;
            &lt;option value="vn"&gt;Vietnam&lt;/option&gt;
            &lt;option value="us"&gt;United States&lt;/option&gt;
            &lt;option value="uk"&gt;United Kingdom&lt;/option&gt;
        &lt;/select&gt;
        
        &lt;fieldset&gt;
            &lt;legend&gt;Interests&lt;/legend&gt;
            &lt;input type="checkbox" id="tech" name="interests" value="technology"&gt;
            &lt;label for="tech"&gt;Technology&lt;/label&gt;
            
            &lt;input type="checkbox" id="sports" name="interests" value="sports"&gt;
            &lt;label for="sports"&gt;Sports&lt;/label&gt;
            
            &lt;input type="checkbox" id="music" name="interests" value="music"&gt;
            &lt;label for="music"&gt;Music&lt;/label&gt;
        &lt;/fieldset&gt;
        
        &lt;button type="submit"&gt;Submit&lt;/button&gt;
        &lt;button type="reset"&gt;Reset&lt;/button&gt;
    &lt;/fieldset&gt;
&lt;/form&gt;
                  </code></pre>
                `,
                estimatedReadTime: 18,
              },
            ],
          },
        ],
      },
    ];
  }

  // Database Course Structure
  private generateDatabaseStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "Database Fundamentals",
        description: "Học các khái niệm cơ bản về cơ sở dữ liệu và SQL",
        orderIndex: 1,
        estimatedDuration: 200,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Giới thiệu Database và SQL",
            description: "Tìm hiểu về cơ sở dữ liệu quan hệ và ngôn ngữ SQL",
            orderIndex: 1,
            estimatedDuration: 50,
            contents: [
              {
                contentId: 1,
                contentTitle: "Database Concepts và SQL Basics",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Cơ sở dữ liệu quan hệ và SQL</h2>
                  
                  <h3>Database là gì?</h3>
                  <p>Cơ sở dữ liệu (Database) là một tập hợp có tổ chức của dữ liệu được lưu trữ và truy cập điện tử từ hệ thống máy tính.</p>
                  
                  <h3>Relational Database Management System (RDBMS)</h3>
                  <ul>
                    <li><strong>MySQL:</strong> Phổ biến, open-source, dễ sử dụng</li>
                    <li><strong>PostgreSQL:</strong> Mạnh mẽ, hỗ trợ nhiều tính năng advanced</li>
                    <li><strong>SQL Server:</strong> Microsoft, tích hợp tốt với .NET</li>
                    <li><strong>Oracle:</strong> Enterprise-level, hiệu suất cao</li>
                  </ul>
                  
                  <h3>Các khái niệm cơ bản</h3>
                  <ul>
                    <li><strong>Table:</strong> Bảng chứa dữ liệu</li>
                    <li><strong>Row/Record:</strong> Hàng dữ liệu</li>
                    <li><strong>Column/Field:</strong> Cột dữ liệu</li>
                    <li><strong>Primary Key:</strong> Khóa chính, định danh duy nhất</li>
                    <li><strong>Foreign Key:</strong> Khóa ngoại, liên kết giữa các bảng</li>
                  </ul>
                  
                  <h3>SQL - Structured Query Language</h3>
                  <p>SQL là ngôn ngữ chuẩn để quản lý và thao tác với cơ sở dữ liệu quan hệ.</p>
                  
                  <h4>Tạo Database và Table</h4>
                  <pre><code>
-- Tạo database
CREATE DATABASE company_db;
USE company_db;

-- Tạo bảng employees
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng departments
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    manager_id INT,
    budget DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm foreign key constraint
ALTER TABLE employees 
ADD CONSTRAINT fk_employee_department 
FOREIGN KEY (department_id) REFERENCES departments(id);
                  </code></pre>
                  
                  <h4>INSERT - Thêm dữ liệu</h4>
                  <pre><code>
-- Thêm departments
INSERT INTO departments (name, budget) VALUES 
('Engineering', 500000.00),
('Marketing', 200000.00),
('Sales', 300000.00),
('HR', 150000.00);

-- Thêm employees
INSERT INTO employees (first_name, last_name, email, phone, hire_date, salary, department_id) 
VALUES 
('John', 'Doe', 'john.doe@company.com', '123-456-7890', '2023-01-15', 75000.00, 1),
('Jane', 'Smith', 'jane.smith@company.com', '123-456-7891', '2023-02-01', 80000.00, 1),
('Mike', 'Johnson', 'mike.johnson@company.com', '123-456-7892', '2023-03-10', 65000.00, 2),
('Sarah', 'Wilson', 'sarah.wilson@company.com', '123-456-7893', '2023-04-05', 70000.00, 3);
                  </code></pre>
                  
                  <h4>SELECT - Truy vấn dữ liệu</h4>
                  <pre><code>
-- Lấy tất cả employees
SELECT * FROM employees;

-- Lấy thông tin cụ thể
SELECT first_name, last_name, email, salary 
FROM employees;

-- Sử dụng WHERE clause
SELECT * FROM employees 
WHERE salary &gt; 70000;

-- Sử dụng ORDER BY
SELECT * FROM employees 
ORDER BY salary DESC;

-- Sử dụng LIMIT
SELECT * FROM employees 
ORDER BY hire_date DESC 
LIMIT 5;

-- JOIN tables
SELECT 
    e.first_name,
    e.last_name,
    e.salary,
    d.name AS department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
                  </code></pre>
                `,
                estimatedReadTime: 20,
              },
            ],
          },
        ],
      },
    ];
  }

  // DevOps Course Structure
  private generateDevOpsStructure(courseId: number): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "DevOps Fundamentals",
        description: "Học các khái niệm cơ bản về DevOps và containerization",
        orderIndex: 1,
        estimatedDuration: 180,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Giới thiệu DevOps và Docker",
            description:
              "Tìm hiểu về DevOps culture và Docker containerization",
            orderIndex: 1,
            estimatedDuration: 60,
            contents: [
              {
                contentId: 1,
                contentTitle: "DevOps và Docker Fundamentals",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>DevOps - Bridging Development và Operations</h2>
                  
                  <h3>DevOps là gì?</h3>
                  <p>DevOps là một tập hợp các practices, tools và cultural philosophy nhằm tự động hóa và tích hợp các quy trình giữa software development và IT operations teams.</p>
                  
                  <h3>DevOps Lifecycle</h3>
                  <ol>
                    <li><strong>Plan:</strong> Lập kế hoạch và quản lý dự án</li>
                    <li><strong>Code:</strong> Phát triển và version control</li>
                    <li><strong>Build:</strong> Compile và package application</li>
                    <li><strong>Test:</strong> Automated testing</li>
                    <li><strong>Release:</strong> Deployment automation</li>
                    <li><strong>Deploy:</strong> Infrastructure as Code</li>
                    <li><strong>Operate:</strong> Monitoring và logging</li>
                    <li><strong>Monitor:</strong> Performance và feedback</li>
                  </ol>
                  
                  <h3>Docker - Containerization Platform</h3>
                  <p>Docker là một platform cho việc phát triển, ship và chạy applications sử dụng container technology.</p>
                  
                  <h4>Docker Concepts</h4>
                  <ul>
                    <li><strong>Image:</strong> Template để tạo containers</li>
                    <li><strong>Container:</strong> Running instance của image</li>
                    <li><strong>Dockerfile:</strong> Script để build images</li>
                    <li><strong>Registry:</strong> Repository để lưu trữ images</li>
                  </ul>
                  
                  <h4>Dockerfile Example</h4>
                  <pre><code>
# Node.js application Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Start application
CMD ["npm", "start"]
                  </code></pre>
                  
                  <h4>Docker Commands</h4>
                  <pre><code>
# Build image
docker build -t my-app:latest .

# Run container
docker run -d -p 3000:3000 --name my-app-container my-app:latest

# List containers
docker ps

# View logs
docker logs my-app-container

# Execute commands in container
docker exec -it my-app-container /bin/sh

# Stop and remove container
docker stop my-app-container
docker rm my-app-container

# Remove image
docker rmi my-app:latest
                  </code></pre>
                  
                  <h4>Docker Compose</h4>
                  <pre><code>
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
                  </code></pre>
                  
                  <h4>Docker Compose Commands</h4>
                  <pre><code>
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale web=3

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
                  </code></pre>
                `,
                estimatedReadTime: 22,
              },
            ],
          },
        ],
      },
    ];
  }

  private generateGenericStructure(
    courseId: number,
    courseTitle: string
  ): CourseSection[] {
    return [
      {
        sectionId: 1,
        sectionTitle: "Giới thiệu khóa học",
        description: `Tổng quan về ${courseTitle} và lộ trình học tập`,
        orderIndex: 1,
        estimatedDuration: 120,
        lessons: [
          {
            lessonId: 1,
            lessonTitle: "Tổng quan và mục tiêu khóa học",
            description: "Giới thiệu về nội dung, mục tiêu và lộ trình học tập",
            orderIndex: 1,
            estimatedDuration: 30,
            contents: [
              {
                contentId: 1,
                contentTitle: "Giới thiệu khóa học",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Chào mừng bạn đến với ${courseTitle}</h2>
                  
                  <h3>🎯 Mục tiêu khóa học</h3>
                  <ul>
                    <li>Nắm vững kiến thức cơ bản và nâng cao</li>
                    <li>Thực hành với các dự án thực tế</li>
                    <li>Phát triển kỹ năng giải quyết vấn đề</li>
                    <li>Chuẩn bị cho cơ hội nghề nghiệp</li>
                  </ul>
                  
                  <h3>📚 Cấu trúc khóa học</h3>
                  <p>Khóa học được thiết kế theo phương pháp học tập tích cực với:</p>
                  <ul>
                    <li><strong>Video lectures:</strong> Giải thích chi tiết các khái niệm</li>
                    <li><strong>Hands-on exercises:</strong> Bài tập thực hành</li>
                    <li><strong>Real-world projects:</strong> Dự án thực tế</li>
                    <li><strong>Quizzes & assessments:</strong> Kiểm tra kiến thức</li>
                  </ul>
                  
                  <h3>⏱️ Thời gian học</h3>
                  <p>Khóa học được thiết kế để hoàn thành trong 4-6 tuần với:</p>
                  <ul>
                    <li>3-5 giờ học mỗi tuần</li>
                    <li>Linh hoạt theo tốc độ cá nhân</li>
                    <li>Hỗ trợ 24/7 qua forum</li>
                  </ul>
                  
                  <h3>🔧 Yêu cầu kỹ thuật</h3>
                  <ul>
                    <li>Máy tính với kết nối internet ổn định</li>
                    <li>Kiến thức cơ bản về máy tính</li>
                    <li>Tinh thần học hỏi và thực hành</li>
                  </ul>
                `,
                estimatedReadTime: 8,
              },
              {
                contentId: 2,
                contentTitle: "Video: Giới thiệu khóa học",
                contentType: "VIDEO",
                orderIndex: 2,
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              },
            ],
          },
          {
            lessonId: 2,
            lessonTitle: "Chuẩn bị môi trường học tập",
            description: "Hướng dẫn cài đặt và cấu hình môi trường cần thiết",
            orderIndex: 2,
            estimatedDuration: 45,
            contents: [
              {
                contentId: 3,
                contentTitle: "Setup Guide",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Chuẩn bị môi trường học tập</h2>
                  
                  <h3>🛠️ Công cụ cần thiết</h3>
                  <ul>
                    <li><strong>Code Editor:</strong> Visual Studio Code (khuyến nghị)</li>
                    <li><strong>Web Browser:</strong> Chrome hoặc Firefox</li>
                    <li><strong>Note-taking:</strong> Notion, Obsidian, hoặc giấy bút</li>
                  </ul>
                  
                  <h3>📝 Cách học hiệu quả</h3>
                  <ol>
                    <li><strong>Active Learning:</strong> Ghi chú và đặt câu hỏi</li>
                    <li><strong>Practice Regularly:</strong> Code mỗi ngày</li>
                    <li><strong>Build Projects:</strong> Áp dụng kiến thức vào dự án</li>
                    <li><strong>Join Community:</strong> Tham gia discussion forums</li>
                  </ol>
                  
                  <h3>🎯 Tips thành công</h3>
                  <ul>
                    <li>Đặt mục tiêu học tập rõ ràng</li>
                    <li>Tạo lịch học tập cố định</li>
                    <li>Thực hành nhiều hơn lý thuyết</li>
                    <li>Đừng ngại hỏi khi gặp khó khăn</li>
                  </ul>
                `,
                estimatedReadTime: 10,
              },
            ],
          },
        ],
      },
      {
        sectionId: 2,
        sectionTitle: "Kiến thức cốt lõi",
        description: "Các khái niệm và kỹ năng quan trọng nhất",
        orderIndex: 2,
        estimatedDuration: 180,
        lessons: [
          {
            lessonId: 3,
            lessonTitle: "Khái niệm cơ bản",
            description: "Tìm hiểu các khái niệm nền tảng",
            orderIndex: 1,
            estimatedDuration: 60,
            contents: [
              {
                contentId: 4,
                contentTitle: "Core Concepts",
                contentType: "TEXT",
                orderIndex: 1,
                textContent: `
                  <h2>Khái niệm cốt lõi</h2>
                  
                  <p>Trong phần này, chúng ta sẽ tìm hiểu các khái niệm quan trọng nhất mà bạn cần nắm vững.</p>
                  
                  <h3>🔑 Khái niệm 1: Foundation</h3>
                  <p>Mô tả chi tiết về khái niệm nền tảng đầu tiên...</p>
                  
                  <h3>🔑 Khái niệm 2: Building Blocks</h3>
                  <p>Các thành phần xây dựng cơ bản...</p>
                  
                  <h3>🔑 Khái niệm 3: Advanced Patterns</h3>
                  <p>Các pattern và best practices...</p>
                  
                  <h3>💡 Ví dụ thực tế</h3>
                  <ul>
                    <li>Case study 1: Real-world application</li>
                    <li>Case study 2: Industry example</li>
                    <li>Case study 3: Best practices</li>
                  </ul>
                `,
                estimatedReadTime: 15,
              },
            ],
          },
        ],
      },
    ];
  }
}

export const courseContentService = new CourseContentService();
