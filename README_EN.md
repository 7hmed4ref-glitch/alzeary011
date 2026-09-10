# 🎓 Educational Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.4.1-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

**A comprehensive educational platform with lessons management, exams, live streaming, and more**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

[🇸🇦 العربية](README.md)

</div>

---

## 🌟 Overview

A comprehensive educational platform designed for students and teachers, providing a lesson management system, exams, live streaming, and more. Features an advanced security system with admin approval and direct account creation capabilities.

---

## ✨ Features

### 👨‍🎓 For Students

#### 🔐 Registration & Login
- ✅ New registration with Egyptian phone number and email
- ✅ Admin approval system (Pending/Approved/Rejected)
- ✅ Password recovery via OTP
- ✅ Login with student code (no email required)
- ✅ Login with email

#### 📚 Lessons
- ✅ Watch educational videos
- ✅ Download attached PDF files
- ✅ Track lesson progress
- ✅ Lesson locking system (must complete current lesson to unlock next)

#### 📝 Quizzes & Exams
- ✅ Quizzes after each lesson with auto-grading
- ✅ Comprehensive exams with instant evaluation
- ✅ View results and correct answers
- ✅ 60% passing grade required

#### 📺 Live Streaming
- ✅ Watch live streams from admin
- ✅ Interact via live chat
- ✅ Control buttons (mute, stop video)

#### 💬 Questions & Inquiries
- ✅ Ask questions to teachers
- ✅ Track question responses
- ✅ Filter questions (answered/unanswered)

#### 🚨 Complaints & Issues
- ✅ Submit complaints and issues
- ✅ Track complaint status
- ✅ Filter by status

### 👨‍💼 For Admin

#### 👥 Student Management
- ✅ View all registered students
- ✅ Approve or reject registration requests
- ✅ Create accounts directly without email/phone
- ✅ Auto-generate student code and password
- ✅ View student progress and grades
- ✅ Search and filter

#### 📚 Lesson Management
- ✅ Create new lessons
- ✅ Upload videos and PDF files
- ✅ Create quizzes with auto-grading
- ✅ Edit and delete lessons

#### 📝 Exam Management
- ✅ Create new exams
- ✅ Add multiple-choice questions
- ✅ Set correct answers
- ✅ Enable/disable exams

#### 📺 Live Streaming Management
- ✅ Start live stream with camera and microphone
- ✅ Create streaming sessions
- ✅ Control stream (mute/stop)
- ✅ End stream

#### 📊 Statistics
- ✅ Total students
- ✅ Pending approvals
- ✅ Approved students
- ✅ Rejected students
- ✅ Average progress

---

## 🛠️ Technologies

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.7.2** - Type safety
- **Vite 6.4.1** - Build tool
- **Tailwind CSS 4.1.11** - Styling
- **Lucide React** - Icons

### Services
- **LocalStorage** - Local database
- **WebRTC** - Live streaming
- **BroadcastChannel API** - Cross-tab communication
- **MediaStream API** - Camera/microphone access

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn or pnpm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/educational-platform.git
cd educational-platform

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Access the App

After running `npm run dev`:
- Open browser at: `http://localhost:5173`

---

## 📖 Usage

### 🔐 Login Credentials

#### Admin Account (Pre-configured)
```
Email: 7hmed4ref@gmail.com
Password: 011156
```

#### Register New Student
1. Click "Register Now"
2. Enter required information
3. Wait for admin approval
4. Login after approval

### 👨‍💼 Using Admin Dashboard

#### Create Student Account
1. Go to "Student Management"
2. Click "Create New Student Account"
3. Enter name (email/phone optional)
4. Click "Create Account"
5. Copy student code and password, give to student

#### Create New Lesson
1. Go to "Lessons"
2. Click "Add New Lesson"
3. Fill in details and upload video
4. Add quiz questions
5. Save lesson

#### Start Live Stream
1. Go to "Live Streaming"
2. Create new streaming session
3. Click "Start Stream"
4. Allow camera and microphone access

### 👨‍🎓 Using Platform as Student

#### Login with Student Code
1. Click "Login with Student Code" on login page
2. Enter student code (STU-XXXXXX)
3. Enter password
4. Click "Login"

#### Watch Lessons
1. Go to "Lessons"
2. Select open lesson
3. Watch entire video
4. Complete quiz (60% or higher)
5. Next lesson will unlock

---

## 📁 Project Structure

```
educational-platform/
├── public/                 # Public files
├── src/
│   ├── components/         # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── Lessons.tsx
│   │   ├── Exams.tsx
│   │   ├── LiveStream.tsx
│   │   ├── QA.tsx
│   │   ├── Complaints.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SplashScreen.tsx
│   │   └── NotificationToast.tsx
│   ├── services/           # Services
│   │   ├── database.ts
│   │   ├── fileService.ts
│   │   └── notificationService.ts
│   ├── types.ts            # TypeScript definitions
│   ├── App.tsx             # Main component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Email**: 7hmed4ref@gmail.com
- **GitHub Issues**: [Open an issue](https://github.com/your-username/educational-platform/issues)

---

## 🙏 Acknowledgments

Thanks to all contributors to this project!

---

<div align="center">

**Made with ❤️ for learning and education**

[⭐ Star this repo if you like it!](https://github.com/your-username/educational-platform)

</div>
