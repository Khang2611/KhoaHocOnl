export interface User {
  userId: number;
  userName: string;
  fullName: string;
  phoneNumber: string;
  role: "ADMIN" | "USER";
}

export interface Course {
  courseId: number;
  courseTitle: string;
  description: string;
  urlVideo: string;
  price: number;
  createBy: User;
}

export interface LessonInfo {
  lessonId: number;
  lessonTitle: string;
  lessonDescription: string;
  videoUrl: string;
  displayOrder: number;
  estimatedDurationMinutes: number;
  isFreePreview: boolean;
}

export interface CurriculumItem {
  chapterTitle: string;
  chapterDescription: string;
  estimatedDurationMinutes: number;
  displayOrder: number;
  lessons: LessonInfo[];
}

export interface PrerequisiteInfo {
  courseId: number;
  courseTitle: string;
  type: "REQUIRED" | "RECOMMENDED";
}

export interface EnhancedCourse extends Course {
  learningObjectives: string[];
  curriculum: CurriculumItem[];
  prerequisites: PrerequisiteInfo[];
  difficulty: string;
  estimatedDurationHours: number;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PaymentResponse {
  paymentQRCodeUrl: string;
  message: string;
}

export interface CourseUpdateRequest {
  courseTitle?: string;
  description?: string;
  urlVideo?: string;
  price?: number;
}

export interface UserUpdateRequest {
  fullName?: string;
  phoneNumber?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
}

// Course Structure Types
export interface CourseSection {
  sectionId: number;
  sectionTitle: string;
  description?: string;
  orderIndex: number;
  lessons: Lesson[];
  estimatedDuration: number; // in minutes
}

export interface Lesson {
  lessonId: number;
  lessonTitle: string;
  description?: string;
  orderIndex: number;
  estimatedDuration: number; // in minutes
  contents: LessonContent[];
  completed?: boolean;
  // Legacy support
  id?: number;
  courseId?: number;
  title?: string;
  videoUrl?: string;
  duration?: string;
  quiz?: Quiz;
  order?: number;
}

export interface LessonContent {
  contentId: number;
  contentTitle: string;
  contentType: "TEXT" | "VIDEO" | "DOCUMENT" | "IMAGE";
  orderIndex: number;
  // Content data
  textContent?: string;
  videoUrl?: string;
  documentUrl?: string;
  imageUrl?: string;
  // Metadata
  estimatedReadTime?: number; // for text content in minutes
  fileSize?: string; // for documents
  fileType?: string; // for documents
}

// Progress Tracking Types
export interface CourseProgress {
  courseId: number;
  userId: number;
  completedLessons: number[];
  completedSections: number[];
  completedContents: number[];
  lastAccessedLesson?: number;
  overallProgress: number; // percentage
  timeSpent: number; // in minutes
  lastUpdated: Date;
  // Legacy support
  totalLessons?: number;
  progress?: number;
  lastAccessedDate?: string;
}

export interface LearningSession {
  lessonId: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  timeSpent: number; // in minutes
}

export interface ContentProgress {
  contentId: number;
  lessonId: number;
  completed: boolean;
  timeSpent: number;
  completedAt?: Date;
}

// Quiz Types (existing, keeping for compatibility)
export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  answers: number[];
  score: number;
  passed: boolean;
  completedAt: string;
}
