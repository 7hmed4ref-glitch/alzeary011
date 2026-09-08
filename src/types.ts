export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  pdfUrl?: string;
  pdfName?: string;
  quiz: QuizQuestion[];
  isCompleted: boolean;
  isVideoWatched: boolean;
  isQuizPassed: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: number;
  title: string;
  subject: string;
  duration: string;
  totalQuestions: number;
  questions: QuizQuestion[];
  isAvailable: boolean;
}

export interface Question {
  id: number;
  studentName: string;
  subject: string;
  question: string;
  date: string;
  replies: Reply[];
  isAnswered: boolean;
}

export interface Reply {
  id: number;
  teacherName: string;
  reply: string;
  date: string;
}

export interface LiveSession {
  id: number;
  title: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  isLive: boolean;
  viewers: number;
}

export interface Complaint {
  id: number;
  studentName: string;
  type: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

export type Page = 'lessons' | 'lesson-player' | 'exams' | 'qa' | 'live' | 'complaints';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  phone?: string;
  joinDate: string;
}

export interface AdminStats {
  totalStudents: number;
  totalLessons: number;
  totalExams: number;
  activeLiveSessions: number;
  pendingComplaints: number;
  unansweredQuestions: number;
}
