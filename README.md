# 🎓 Khóa Học Online - Hệ thống quản lý khóa học

## 📋 Tổng quan

Hệ thống quản lý khóa học online với backend Spring Boot và frontend React TypeScript.

## 🚀 Quick Start

### ⚠️ Setup Environment (Lần Đầu)

**Quan trọng**: Cần setup environment variables trước khi chạy!

#### Option 1: Sử dụng Script (Khuyến nghị)

**Linux/Mac:**

```bash
bash setup-env.sh
```

**Windows:**

```bash
setup-env.bat
```

#### Option 2: Manual Setup

```bash
# Copy template
cp KhoaHocOnl/src/main/resources/application.properties.example \
   KhoaHocOnl/src/main/resources/application.properties

# Cập nhật thông tin trong application.properties
# - Database password
# - JWT secret (tạo bằng: openssl rand -base64 64)
# - Admin password
```

Xem chi tiết: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

### Backend (Spring Boot)

```bash
cd KhoaHocOnl
mvnw spring-boot:run
```

Backend chạy tại: http://localhost:8080

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend chạy tại: http://localhost:3000

## 📊 Import dữ liệu mẫu

### Qua Admin UI (Khuyến nghị)

1. Đăng nhập admin: http://localhost:3000/login
2. Vào trang Import: http://localhost:3000/admin/import
3. Click "Use Default Data"
4. Click "Import to Database"
5. Đợi thông báo thành công

### Dữ liệu mẫu

- **25 khóa học** đầy đủ
- **~100 bài học** chi tiết
- **Learning Objectives** (Mục tiêu học tập)
- **Curriculum** (Chương trình học với lessons)
- **Prerequisites** (Khóa học tiên quyết)

## 🏗️ Cấu trúc dự án

### Backend (KhoaHocOnl/)

- `src/main/java/` - Source code Java
- `src/main/resources/data/` - Dữ liệu mẫu JSON
- `pom.xml` - Maven dependencies

### Frontend (frontend/)

- `src/components/` - Các component tái sử dụng
- `src/pages/` - Các trang chính
- `src/contexts/` - Context providers (Auth, etc.)
- `src/services/` - API services
- `src/types/` - TypeScript type definitions

## ✨ Tính năng chính

### Người dùng

- Đăng nhập/Đăng ký
- Xem danh sách khóa học
- Chi tiết khóa học với curriculum
- Xem thử bài học miễn phí
- Đăng ký và thanh toán khóa học
- Quản lý profile

### Admin

- Quản lý khóa học
- Import dữ liệu từ JSON
- Quản lý người dùng
- Duyệt đăng ký khóa học

## 🛠️ Công nghệ sử dụng

### Backend

- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend

- React 18
- TypeScript
- Material-UI
- React Router
- Axios

## 📚 API Endpoints

### Public

- `GET /api/course/all` - Danh sách khóa học
- `GET /api/course/{id}/details` - Chi tiết khóa học
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Admin

- `POST /api/admin/courses/import` - Import khóa học
- `GET /api/admin/courses` - Quản lý khóa học
- `PUT /api/admin/courses/{id}` - Cập nhật khóa học

## 🎯 Cấu trúc dữ liệu khóa học

```json
{
  "courseId": 1,
  "courseTitle": "Tên khóa học",
  "description": "Mô tả",
  "price": 1000000,
  "learningObjectives": ["Mục tiêu 1", "Mục tiêu 2"],
  "curriculum": [
    {
      "chapterTitle": "Chương 1",
      "chapterDescription": "Mô tả chương",
      "estimatedDurationMinutes": 60,
      "displayOrder": 1,
      "lessons": [
        {
          "lessonTitle": "Bài 1.1",
          "lessonDescription": "Mô tả bài học",
          "videoUrl": "https://youtube.com/...",
          "displayOrder": 1,
          "estimatedDurationMinutes": 20,
          "isFreePreview": true
        }
      ]
    }
  ],
  "prerequisites": [
    {
      "courseId": 2,
      "courseTitle": "Khóa tiên quyết",
      "type": "REQUIRED"
    }
  ]
}
```

## 🔧 Troubleshooting

### Backend không kết nối database

- Kiểm tra MySQL đang chạy
- Verify `application.properties` có đúng thông tin kết nối

### Frontend không gọi được API

- Đảm bảo backend đang chạy tại port 8080
- Check CORS configuration trong backend

### Import dữ liệu bị lỗi

- Verify file JSON hợp lệ
- Check backend logs để xem lỗi chi tiết
- Đảm bảo database schema đã được tạo

## 📝 Lưu ý

- Import sẽ ghi đè dữ liệu cũ nếu courseId trùng
- Prerequisites chỉ được tạo sau khi tất cả courses đã import
- Mỗi khóa học nên có 2 bài "xem thử miễn phí" đầu tiên

## 🎉 Kết quả

Sau khi setup xong, bạn sẽ có:

- ✅ 25 khóa học đầy đủ với curriculum chi tiết
- ✅ ~100 bài học với video YouTube
- ✅ Hệ thống xem thử miễn phí
- ✅ Quản lý prerequisites giữa các khóa học
- ✅ Admin UI để quản lý dễ dàng
