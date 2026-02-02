// types/index.ts
export type Role = "student" | "instructor" | "admin";

export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  role: Role;
  avatar: string;
  bio?: string;
  skills: string[];
  learningPath: string[];
  phone?: string;
  createdAt: string;
}

// ============= COURSE =============
export interface Course {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnail: string;
  trailerUrl: string;
  rating: number;
  totalStudents: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Lesson {
  id: string;
  courseId: string;
  name: string;
  videoUrl: string;
  content: string;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  progressPercent: number;
  completedLessons: number;
  lastAccessedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  timeMarker: number;
  content: string;
  createdAt: string;
}

// ============= DISCUSSION (UPDATED) =============
export interface Discussion {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  content: string;
  parentId: string | null;
  likes: number;
  createdAt: string;
  user?: User;
}

export interface DiscussionLike {
  id: string;
  userId: string;
  discussionId: string;
  createdAt: string;
}

// ============= ORDER & PAYMENT =============
export interface OrderItem {
  courseId: string;
  courseName: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "success" | "failed";
  items: OrderItem[];
  createdAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
  user?: User;
}

// ============= CART =============
export interface CartItem extends Course {}

// ============= NOTIFICATION (SIMPLE) =============
export interface Notification {
  id: string;
  userId: string;
  type: "course_update" | "new_discussion" | "enrollment" | "review";
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}
