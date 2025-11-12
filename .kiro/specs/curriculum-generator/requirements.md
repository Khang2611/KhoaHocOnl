# Requirements Document

## Introduction

Hệ thống cần có khả năng tự động tạo curriculum (chương trình học) và lessons (bài học) chi tiết cho các khóa học chưa có hoặc có curriculum chưa đầy đủ. Tính năng này giúp admin nhanh chóng bổ sung nội dung cho các khóa học mới mà không cần nhập thủ công từng chương và bài học.

## Glossary

- **Curriculum Generator**: Hệ thống tự động tạo chương trình học
- **Course**: Khóa học trong hệ thống
- **Curriculum**: Chương trình học của một khóa học, bao gồm nhiều chapters
- **Chapter**: Chương học trong curriculum
- **Lesson**: Bài học cụ thể trong một chapter
- **Admin**: Người quản trị hệ thống có quyền tạo và chỉnh sửa khóa học

## Requirements

### Requirement 1

**User Story:** Là một Admin, tôi muốn xem danh sách các khóa học chưa có curriculum hoặc có curriculum chưa đầy đủ, để biết khóa học nào cần bổ sung nội dung.

#### Acceptance Criteria

1. WHEN Admin truy cập trang Curriculum Generator, THE System SHALL hiển thị danh sách tất cả các khóa học
2. WHILE hiển thị danh sách khóa học, THE System SHALL đánh dấu rõ ràng khóa học nào chưa có curriculum
3. WHILE hiển thị danh sách khóa học, THE System SHALL đánh dấu rõ ràng khóa học nào có curriculum nhưng chưa có lessons
4. THE System SHALL hiển thị số lượng chapters và lessons hiện có cho mỗi khóa học
5. THE System SHALL cho phép Admin lọc khóa học theo trạng thái curriculum (chưa có, chưa đầy đủ, đã đầy đủ)

### Requirement 2

**User Story:** Là một Admin, tôi muốn tự động tạo curriculum template cho một khóa học, để tiết kiệm thời gian thay vì nhập thủ công.

#### Acceptance Criteria

1. WHEN Admin chọn một khóa học chưa có curriculum, THE System SHALL hiển thị nút "Generate Curriculum"
2. WHEN Admin click "Generate Curriculum", THE System SHALL tự động tạo 3-5 chapters phù hợp với chủ đề khóa học
3. THE System SHALL tạo chapter title và description dựa trên courseTitle và description
4. THE System SHALL tự động tính toán estimatedDurationMinutes cho mỗi chapter
5. THE System SHALL gán displayOrder tự động cho các chapters theo thứ tự logic

### Requirement 3

**User Story:** Là một Admin, tôi muốn tự động tạo lessons cho các chapters, để có nội dung chi tiết cho từng chương học.

#### Acceptance Criteria

1. WHEN Admin chọn "Generate Lessons" cho một chapter, THE System SHALL tạo 3-5 lessons cho chapter đó
2. THE System SHALL tạo lesson title phù hợp với chapter topic
3. THE System SHALL gán video URL mẫu hoặc để trống để Admin cập nhật sau
4. THE System SHALL đánh dấu 2 lessons đầu tiên của khóa học là isFreePreview = true
5. THE System SHALL tự động tính toán estimatedDurationMinutes cho mỗi lesson dựa trên chapter duration

### Requirement 4

**User Story:** Là một Admin, tôi muốn xem preview curriculum đã generate trước khi lưu, để kiểm tra và chỉnh sửa nếu cần.

#### Acceptance Criteria

1. WHEN System generate curriculum, THE System SHALL hiển thị preview đầy đủ trước khi lưu
2. THE System SHALL cho phép Admin chỉnh sửa chapter title, description, duration trong preview
3. THE System SHALL cho phép Admin chỉnh sửa lesson title, description, duration trong preview
4. THE System SHALL cho phép Admin xóa chapters hoặc lessons không phù hợp
5. WHEN Admin xác nhận preview, THE System SHALL lưu curriculum vào database

### Requirement 5

**User Story:** Là một Admin, tôi muốn generate curriculum cho nhiều khóa học cùng lúc, để xử lý hàng loạt các khóa học mới.

#### Acceptance Criteria

1. THE System SHALL cho phép Admin chọn nhiều khóa học từ danh sách
2. WHEN Admin click "Bulk Generate", THE System SHALL tạo curriculum cho tất cả khóa học đã chọn
3. THE System SHALL hiển thị progress bar trong quá trình generate
4. WHEN quá trình hoàn tất, THE System SHALL hiển thị báo cáo số lượng khóa học đã generate thành công
5. IF có lỗi xảy ra với khóa học nào, THEN THE System SHALL ghi log lỗi và tiếp tục với khóa học tiếp theo

### Requirement 6

**User Story:** Là một Admin, tôi muốn sử dụng template có sẵn cho các loại khóa học phổ biến, để curriculum được tạo chính xác hơn.

#### Acceptance Criteria

1. THE System SHALL có sẵn templates cho các category: Programming, Web Development, Data Science, DevOps, Database
2. WHEN generate curriculum, THE System SHALL tự động chọn template phù hợp dựa trên courseTitle
3. THE System SHALL cho phép Admin chọn template khác nếu muốn
4. THE System SHALL lưu trữ các template trong configuration file dễ chỉnh sửa
5. THE System SHALL cho phép Admin tạo custom template mới

### Requirement 7

**User Story:** Là một Admin, tôi muốn export curriculum đã generate ra JSON file, để backup hoặc chia sẻ với team.

#### Acceptance Criteria

1. THE System SHALL có nút "Export Curriculum" cho mỗi khóa học
2. WHEN Admin click Export, THE System SHALL tạo JSON file chứa đầy đủ curriculum và lessons
3. THE System SHALL format JSON file theo cấu trúc chuẩn của hệ thống
4. THE System SHALL tự động download file về máy Admin
5. THE System SHALL đặt tên file theo format: `course_{courseId}_{courseTitle}_curriculum.json`
