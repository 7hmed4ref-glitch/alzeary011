// Database Service - Using localStorage as a simple database
// In production, replace with real backend (Firebase, Supabase, etc.)

export interface User {
  id: number;
  name: string;
  email?: string;
  password: string; // In production, this should be hashed
  role: 'admin' | 'student';
  phone?: string;
  joinDate: string;
  avatar?: string;
  status?: 'pending' | 'approved' | 'rejected';
  studentCode?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnail?: string;
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

export interface LiveSession {
  id: number;
  title: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  isLive: boolean;
  viewers: number;
  streamUrl?: string;
}

export interface Question {
  id: number;
  studentName: string;
  subject: string;
  question: string;
  date: string;
  isAnswered: boolean;
  replies: Reply[];
}

export interface Reply {
  id: number;
  teacherName: string;
  reply: string;
  date: string;
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

// Simple hash function for passwords (in production, use bcrypt or similar)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

class Database {
  private prefix = 'edu_platform_';

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(this.prefix + 'users');
    return data ? JSON.parse(data) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.prefix + 'users', JSON.stringify(users));
  }

  addUser(user: Omit<User, 'id' | 'joinDate'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  findUserByStudentCode(studentCode: string): User | undefined {
    return this.getUsers().find(u => u.studentCode === studentCode);
  }

  authenticateByCode(studentCode: string, password: string): User | null {
    const user = this.findUserByStudentCode(studentCode);
    if (user && user.password === password) {
      if (user.role === 'student' && user.status !== 'approved') {
        return null;
      }
      return user;
    }
    return null;
  }

  findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  authenticate(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    if (user && user.password === password) {
      // Check if student is approved (admins are always approved)
      if (user.role === 'student' && user.status !== 'approved') {
        return null; // Student not approved yet
      }
      return user;
    }
    return null;
  }

  // Update user status
  updateUserStatus(userId: number, status: 'pending' | 'approved' | 'rejected'): void {
    const users = this.getUsers();
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status } : u
    );
    this.saveUsers(updatedUsers);
  }

  // Get pending students
  getPendingStudents(): User[] {
    return this.getUsers().filter(u => u.role === 'student' && u.status === 'pending');
  }

  // Get approved students
  getApprovedStudents(): User[] {
    return this.getUsers().filter(u => u.role === 'student' && u.status === 'approved');
  }

  // Lessons
  getLessons(): Lesson[] {
    const data = localStorage.getItem(this.prefix + 'lessons');
    return data ? JSON.parse(data) : [];
  }

  saveLessons(lessons: Lesson[]): void {
    localStorage.setItem(this.prefix + 'lessons', JSON.stringify(lessons));
  }

  addLesson(lesson: Omit<Lesson, 'id'>): Lesson {
    const lessons = this.getLessons();
    const newLesson: Lesson = {
      ...lesson,
      id: Date.now(),
    };
    lessons.push(newLesson);
    this.saveLessons(lessons);
    return newLesson;
  }

  updateLesson(id: number, updates: Partial<Lesson>): void {
    const lessons = this.getLessons();
    const index = lessons.findIndex(l => l.id === id);
    if (index !== -1) {
      lessons[index] = { ...lessons[index], ...updates };
      this.saveLessons(lessons);
    }
  }

  deleteLesson(id: number): void {
    const lessons = this.getLessons().filter(l => l.id !== id);
    this.saveLessons(lessons);
  }

  // Exams
  getExams(): Exam[] {
    const data = localStorage.getItem(this.prefix + 'exams');
    return data ? JSON.parse(data) : [];
  }

  saveExams(exams: Exam[]): void {
    localStorage.setItem(this.prefix + 'exams', JSON.stringify(exams));
  }

  addExam(exam: Omit<Exam, 'id'>): Exam {
    const exams = this.getExams();
    const newExam: Exam = {
      ...exam,
      id: Date.now(),
    };
    exams.push(newExam);
    this.saveExams(exams);
    return newExam;
  }

  updateExam(id: number, updates: Partial<Exam>): void {
    const exams = this.getExams();
    const index = exams.findIndex(e => e.id === id);
    if (index !== -1) {
      exams[index] = { ...exams[index], ...updates };
      this.saveExams(exams);
    }
  }

  deleteExam(id: number): void {
    const exams = this.getExams().filter(e => e.id !== id);
    this.saveExams(exams);
  }

  // Live Sessions
  getLiveSessions(): LiveSession[] {
    const data = localStorage.getItem(this.prefix + 'live_sessions');
    return data ? JSON.parse(data) : [];
  }

  saveLiveSessions(sessions: LiveSession[]): void {
    localStorage.setItem(this.prefix + 'live_sessions', JSON.stringify(sessions));
  }

  addLiveSession(session: Omit<LiveSession, 'id'>): LiveSession {
    const sessions = this.getLiveSessions();
    const newSession: LiveSession = {
      ...session,
      id: Date.now(),
    };
    sessions.push(newSession);
    this.saveLiveSessions(sessions);
    return newSession;
  }

  updateLiveSession(id: number, updates: Partial<LiveSession>): void {
    const sessions = this.getLiveSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.saveLiveSessions(sessions);
    }
  }

  deleteLiveSession(id: number): void {
    const sessions = this.getLiveSessions().filter(s => s.id !== id);
    this.saveLiveSessions(sessions);
  }

  // Questions
  getQuestions(): Question[] {
    const data = localStorage.getItem(this.prefix + 'questions');
    return data ? JSON.parse(data) : [];
  }

  saveQuestions(questions: Question[]): void {
    localStorage.setItem(this.prefix + 'questions', JSON.stringify(questions));
  }

  addQuestion(question: Omit<Question, 'id' | 'date' | 'isAnswered' | 'replies'>): Question {
    const questions = this.getQuestions();
    const newQuestion: Question = {
      ...question,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      isAnswered: false,
      replies: [],
    };
    questions.push(newQuestion);
    this.saveQuestions(questions);
    return newQuestion;
  }

  addReply(questionId: number, reply: Omit<Reply, 'id' | 'date'>): void {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      questions[index].replies.push({
        ...reply,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      });
      questions[index].isAnswered = true;
      this.saveQuestions(questions);
    }
  }

  // Complaints
  getComplaints(): Complaint[] {
    const data = localStorage.getItem(this.prefix + 'complaints');
    return data ? JSON.parse(data) : [];
  }

  saveComplaints(complaints: Complaint[]): void {
    localStorage.setItem(this.prefix + 'complaints', JSON.stringify(complaints));
  }

  addComplaint(complaint: Omit<Complaint, 'id' | 'date' | 'status'>): Complaint {
    const complaints = this.getComplaints();
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    complaints.push(newComplaint);
    this.saveComplaints(complaints);
    return newComplaint;
  }

  updateComplaintStatus(id: number, status: Complaint['status']): void {
    const complaints = this.getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      complaints[index].status = status;
      this.saveComplaints(complaints);
    }
  }

  // File Storage (for uploaded files)
  saveFile(file: File, category: string): string {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const files = JSON.parse(localStorage.getItem(this.prefix + 'files') || '{}');
        const fileId = `${category}_${Date.now()}_${file.name}`;
        files[fileId] = {
          data: reader.result,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
        localStorage.setItem(this.prefix + 'files', JSON.stringify(files));
        resolve(fileId);
      };
      reader.readAsDataURL(file);
    }) as any;
  }

  getFile(fileId: string): { data: string; name: string; type: string } | null {
    const files = JSON.parse(localStorage.getItem(this.prefix + 'files') || '{}');
    return files[fileId] || null;
  }

  // Initialize with default admin
  initialize(): void {
    const users = this.getUsers();
    const adminExists = users.find(u => u.email === '7hmed4ref@gmail.com');
    
    if (!adminExists) {
      this.addUser({
        name: 'مدير النظام',
        email: '7hmed4ref@gmail.com',
        password: '011156',
        role: 'admin',
        status: 'approved', // Admin is always approved
      });
    }
  }

  // Clear all data (for testing)
  clearAll(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const db = new Database();

// Initialize database on import
db.initialize();
