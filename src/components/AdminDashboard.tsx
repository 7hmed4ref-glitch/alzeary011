import React, { useState, useEffect, useRef } from 'react';
import { User, Page, Lesson, Exam, QuizQuestion, LiveSession } from '../types';
import { db } from '../services/database';
import {
  Users,
  BookOpen,
  FileText,
  Radio,
  AlertTriangle,
  MessageCircle,
  LogOut,
  Shield,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Upload,
  Video,
  Save,
  Play,
  VideoIcon,
  HelpCircle,
  Mic,
  MicOff,
  VideoOff,
  Circle,
  Mail,
  Phone,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface StudentProgress {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  completedLessons: number;
  totalLessons: number;
  examScore: number;
  status: 'active' | 'inactive';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'lessons' | 'exams' | 'live' | 'complaints' | 'settings'>('overview');
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

  // State for lessons
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const stored = localStorage.getItem('admin_lessons');
    return stored ? JSON.parse(stored) : [];
  });

  // State for exams
  const [exams, setExams] = useState<Exam[]>(() => {
    const stored = localStorage.getItem('admin_exams');
    return stored ? JSON.parse(stored) : [];
  });

  // State for live sessions
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(() => {
    const stored = localStorage.getItem('admin_live_sessions');
    return stored ? JSON.parse(stored) : [];
  });

  // Load actual students from database
  useEffect(() => {
    const loadStudents = () => {
      const users = db.getUsers();
      const studentUsers = users.filter(u => u.role === 'student');
      
      // Get lessons to calculate progress
      const allLessons = db.getLessons();
      const totalLessons = allLessons.length;
      
      // Map students with their progress
      const studentsWithProgress: StudentProgress[] = studentUsers.map(student => {
        // Get student's progress from localStorage
        const progressKey = `student_progress_${student.id}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone || 'غير محدد',
          joinDate: student.joinDate,
          completedLessons: progress.completedLessons || 0,
          totalLessons: totalLessons,
          examScore: progress.examScore || 0,
          status: 'active' as const,
        };
      });
      
      setStudents(studentsWithProgress);
    };
    
    loadStudents();
    
    // Refresh students list every 3 seconds to show new registrations
    const interval = setInterval(loadStudents, 3000);
    return () => clearInterval(interval);
  }, []);

  // Modal states
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    duration: '',
    videoUrl: '',
    pdfUrl: '',
    pdfName: '',
  });
  const [lessonQuiz, setLessonQuiz] = useState<QuizQuestion[]>([]);

  // Exam form state
  const [examForm, setExamForm] = useState({
    title: '',
    subject: '',
    duration: '',
    isAvailable: true,
  });
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>([]);

  // Live session form state
  const [liveForm, setLiveForm] = useState({
    title: '',
    teacher: '',
    subject: '',
    date: '',
    time: '',
    isLive: false,
  });

  // Live streaming states
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastingSession, setBroadcastingSession] = useState<LiveSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const adminVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('admin_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('admin_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('admin_live_sessions', JSON.stringify(liveSessions));
  }, [liveSessions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBroadcast();
    };
  }, []);

  // Live streaming handlers
  const startBroadcast = async (session: LiveSession) => {
    try {
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = stream;
      
      // Show local video preview
      if (adminVideoRef.current) {
        adminVideoRef.current.srcObject = stream;
      }
      
      // Create BroadcastChannel for signaling
      channelRef.current = new BroadcastChannel('live-stream-channel');
      
      // Create peer connection
      const config = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      };
      
      peerConnectionRef.current = new RTCPeerConnection(config);
      
      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
      
      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          channelRef.current?.postMessage({
            type: 'ice-candidate',
            data: event.candidate
          });
        }
      };
      
      // Listen for signaling messages
      channelRef.current.onmessage = async (event) => {
        const { type, data } = event.data;
        
        if (type === 'answer' && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
        } else if (type === 'ice-candidate' && peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data));
        }
      };
      
      // Create and send offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      channelRef.current.postMessage({
        type: 'offer',
        data: peerConnectionRef.current.localDescription
      });
      
      // Update session status
      setBroadcastingSession(session);
      setIsBroadcasting(true);
      
      // Update live session in list
      setLiveSessions(liveSessions.map(s => 
        s.id === session.id ? { ...s, isLive: true } : s
      ));
      
    } catch (error) {
      console.error('Error starting broadcast:', error);
      alert('فشل في بدء البث. تأكد من السماح بالوصول إلى الكاميرا والميكروفون.');
    }
  };

  const stopBroadcast = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
    
    if (adminVideoRef.current) {
      adminVideoRef.current.srcObject = null;
    }
    
    if (broadcastingSession) {
      setLiveSessions(liveSessions.map(s => 
        s.id === broadcastingSession.id ? { ...s, isLive: false } : s
      ));
    }
    
    setIsBroadcasting(false);
    setBroadcastingSession(null);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const stats = {
    totalStudents: students.length,
    totalLessons: lessons.length,
    totalExams: exams.length,
    activeLiveSessions: liveSessions.filter(s => s.isLive).length,
    pendingComplaints: 1,
    unansweredQuestions: 2,
  };

  // Lesson handlers
  const handleSaveLesson = () => {
    if (!lessonForm.title || !lessonForm.videoUrl) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (lessonQuiz.length === 0) {
      alert('يرجى إضافة سؤال واحد على الأقل للاختبار');
      return;
    }

    // Validate quiz questions
    for (let i = 0; i < lessonQuiz.length; i++) {
      const q = lessonQuiz[i];
      if (!q.question.trim()) {
        alert(`يرجى كتابة نص السؤال ${i + 1}`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`يرجى ملء جميع الخيارات في السؤال ${i + 1}`);
          return;
        }
      }
    }

    if (editingLesson) {
      setLessons(lessons.map(l => l.id === editingLesson.id ? {
        ...l,
        title: lessonForm.title,
        description: lessonForm.description,
        duration: lessonForm.duration,
        videoUrl: lessonForm.videoUrl,
        pdfUrl: lessonForm.pdfUrl,
        pdfName: lessonForm.pdfName,
        quiz: lessonQuiz,
      } : l));
    } else {
      const newLesson: Lesson = {
        id: Date.now(),
        title: lessonForm.title,
        description: lessonForm.description,
        duration: lessonForm.duration,
        videoUrl: lessonForm.videoUrl,
        thumbnail: '',
        pdfUrl: lessonForm.pdfUrl,
        pdfName: lessonForm.pdfName,
        isCompleted: false,
        isVideoWatched: false,
        isQuizPassed: false,
        quiz: lessonQuiz,
      };
      setLessons([...lessons, newLesson]);
    }

    setShowLessonModal(false);
    setEditingLesson(null);
    setLessonForm({ title: '', description: '', duration: '', videoUrl: '', pdfUrl: '', pdfName: '' });
    setLessonQuiz([]);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      pdfUrl: lesson.pdfUrl || '',
      pdfName: lesson.pdfName || '',
    });
    setLessonQuiz(lesson.quiz || []);
    setShowLessonModal(true);
  };

  const handleDeleteLesson = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      // For demo, we create a local URL
      const url = URL.createObjectURL(file);
      setLessonForm({ ...lessonForm, videoUrl: url });
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('يرجى رفع ملف PDF فقط');
        return;
      }
      // For demo, we create a local URL
      const url = URL.createObjectURL(file);
      setLessonForm({ ...lessonForm, pdfUrl: url, pdfName: file.name });
    }
  };

  const handleRemovePdf = () => {
    setLessonForm({ ...lessonForm, pdfUrl: '', pdfName: '' });
  };

  // Lesson Quiz handlers
  const addLessonQuizQuestion = () => {
    setLessonQuiz([...lessonQuiz, {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }]);
  };

  const removeLessonQuizQuestion = (index: number) => {
    setLessonQuiz(lessonQuiz.filter((_, i) => i !== index));
  };

  const updateLessonQuizQuestion = (index: number, field: string, value: any) => {
    const updated = [...lessonQuiz];
    if (field === 'question') {
      updated[index] = { ...updated[index], question: value };
    } else if (field === 'correctAnswer') {
      updated[index] = { ...updated[index], correctAnswer: value };
    }
    setLessonQuiz(updated);
  };

  const updateLessonQuizOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...lessonQuiz];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    setLessonQuiz(updated);
  };

  // Exam handlers
  const handleSaveExam = () => {
    if (!examForm.title || !examForm.subject || examQuestions.length === 0) {
      alert('يرجى ملء جميع الحقول وإضافة أسئلة');
      return;
    }

    const newExam: Exam = {
      id: editingExam?.id || Date.now(),
      title: examForm.title,
      subject: examForm.subject,
      duration: examForm.duration,
      totalQuestions: examQuestions.length,
      questions: examQuestions,
      isAvailable: examForm.isAvailable,
    };

    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? newExam : e));
    } else {
      setExams([...exams, newExam]);
    }

    setShowExamModal(false);
    setEditingExam(null);
    setExamForm({ title: '', subject: '', duration: '', isAvailable: true });
    setExamQuestions([]);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setExamForm({
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      isAvailable: exam.isAvailable,
    });
    setExamQuestions(exam.questions);
    setShowExamModal(true);
  };

  const handleDeleteExam = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const addQuestion = () => {
    setExamQuestions([...examQuestions, {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...examQuestions];
    if (field === 'question') {
      updated[index].question = value;
    } else if (field === 'correctAnswer') {
      updated[index].correctAnswer = value;
    } else if (field.startsWith('option')) {
      const optIndex = parseInt(field.split('-')[1]);
      updated[index].options[optIndex] = value;
    }
    setExamQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setExamQuestions(examQuestions.filter((_, i) => i !== index));
  };

  // Live session handlers
  const handleSaveLive = () => {
    if (!liveForm.title || !liveForm.teacher) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newSession: LiveSession = {
      id: Date.now(),
      title: liveForm.title,
      teacher: liveForm.teacher,
      subject: liveForm.subject,
      date: liveForm.date,
      time: liveForm.time,
      isLive: liveForm.isLive,
      viewers: 0,
    };

    setLiveSessions([...liveSessions, newSession]);
    setShowLiveModal(false);
    setLiveForm({ title: '', teacher: '', subject: '', date: '', time: '', isLive: false });
  };

  const handleDeleteLive = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
      setLiveSessions(liveSessions.filter(s => s.id !== id));
    }
  };



  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي الطلاب</p>
              <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
              <p className="text-blue-200 text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% هذا الشهر
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">الحصص الدراسية</p>
              <p className="text-3xl font-bold mt-2">{stats.totalLessons}</p>
              <p className="text-green-200 text-xs mt-2">جميعها متاحة</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">الامتحانات</p>
              <p className="text-3xl font-bold mt-2">{stats.totalExams}</p>
              <p className="text-purple-200 text-xs mt-2">{exams.filter(e => e.isAvailable).length} متاح</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">البث المباشر</p>
              <p className="text-3xl font-bold mt-2">{stats.activeLiveSessions}</p>
              <p className="text-red-200 text-xs mt-2">جلسة نشطة الآن</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Radio className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">الشكاوى المعلقة</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingComplaints}</p>
              <p className="text-amber-200 text-xs mt-2">تحتاج مراجعة</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">أسئلة بانتظار الرد</p>
              <p className="text-3xl font-bold mt-2">{stats.unansweredQuestions}</p>
              <p className="text-cyan-200 text-xs mt-2">من الطلاب</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <MessageCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStudentDetails = () => {
    if (!selectedStudent) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">تفاصيل الطالب</h3>
            <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Student Info */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h4>
                <p className="text-gray-500">{selectedStudent.email}</p>
                <p className="text-sm text-gray-400 mt-1">انضم في {selectedStudent.joinDate}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{selectedStudent.completedLessons}</p>
                <p className="text-sm text-gray-600 mt-1">حصص مكتملة</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{selectedStudent.totalLessons}</p>
                <p className="text-sm text-gray-600 mt-1">إجمالي الحصص</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{selectedStudent.examScore}%</p>
                <p className="text-sm text-gray-600 mt-1">متوسط الدرجات</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">
                  {selectedStudent.totalLessons > 0 
                    ? Math.round((selectedStudent.completedLessons / selectedStudent.totalLessons) * 100)
                    : 0}%
                </p>
                <p className="text-sm text-gray-600 mt-1">نسبة الإنجاز</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">التقدم في المنصة</span>
                <span className="text-sm text-gray-500">
                  {selectedStudent.completedLessons} / {selectedStudent.totalLessons}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-l from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${selectedStudent.totalLessons > 0 ? (selectedStudent.completedLessons / selectedStudent.totalLessons) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h5 className="font-medium text-gray-800 mb-3">معلومات التواصل</h5>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{selectedStudent.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudents = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{students.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الطلاب النشطون</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {students.filter(s => s.completedLessons > 0).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">متوسط التقدم</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {students.length > 0 
                  ? Math.round(students.reduce((acc, s) => acc + (s.totalLessons > 0 ? (s.completedLessons / s.totalLessons) * 100 : 0), 0) / students.length)
                  : 0}%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">الطلاب المسجلون</h3>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="بحث عن طالب..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              {students.length === 0 ? 'لا يوجد طلاب مسجلون بعد' : 'لا توجد نتائج'}
            </h4>
            <p className="text-gray-500 text-sm">
              {students.length === 0 
                ? 'سيظهر الطلاب هنا عند تسجيلهم في المنصة'
                : 'جرب البحث بكلمات مختلفة'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الطالب</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">البريد</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاريخ الانضمام</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">التقدم</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الدرجة</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{student.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{student.joinDate}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all" 
                            style={{ width: `${student.totalLessons > 0 ? (student.completedLessons / student.totalLessons) * 100 : 0}%` }} 
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {student.completedLessons}/{student.totalLessons}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${
                        student.examScore >= 80 ? 'text-green-600' : 
                        student.examScore >= 60 ? 'text-amber-600' : 
                        'text-red-600'
                      }`}>
                        {student.examScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {renderStudentDetails()}
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">إدارة الحصص الدراسية</h3>
        <button
          onClick={() => { setEditingLesson(null); setLessonForm({ title: '', description: '', duration: '', videoUrl: '', pdfUrl: '', pdfName: '' }); setLessonQuiz([]); setShowLessonModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          إضافة حصة جديدة
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Video className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد حصص بعد</h3>
          <p className="text-gray-500">ابدأ بإضافة حصص دراسية جديدة للطلاب</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white relative">
                <div className="absolute top-3 left-3 bg-white/20 px-2 py-1 rounded-full text-xs">
                  حصة #{index + 1}
                </div>
                <Video className="w-12 h-12 mb-3 opacity-80" />
                <h4 className="font-bold text-lg">{lesson.title}</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-600 mb-2 bg-indigo-50 px-3 py-2 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                  <span>{lesson.quiz?.length || 0} أسئلة اختبار</span>
                </div>
                {lesson.pdfUrl && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-3 bg-green-50 px-3 py-2 rounded-lg">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{lesson.pdfName || 'ملف PDF مرفق'}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditLesson(lesson)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                  <button onClick={() => handleDeleteLesson(lesson.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExams = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">إدارة الامتحانات</h3>
        <button
          onClick={() => { setEditingExam(null); setExamForm({ title: '', subject: '', duration: '', isAvailable: true }); setExamQuestions([]); setShowExamModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          إنشاء امتحان جديد
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد امتحانات بعد</h3>
          <p className="text-gray-500">أنشئ امتحانات جديدة مع تصحيح إلكتروني تلقائي</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{exam.title}</h4>
                  <p className="text-sm text-indigo-600 font-medium">{exam.subject}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${exam.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {exam.isAvailable ? 'متاح' : 'غير متاح'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">عدد الأسئلة</p>
                  <p className="text-lg font-bold text-gray-800">{exam.totalQuestions}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">المدة</p>
                  <p className="text-lg font-bold text-gray-800">{exam.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditExam(exam)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium">
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
                <button onClick={() => handleDeleteExam(exam.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLive = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">إدارة البث المباشر</h3>
        <button
          onClick={() => { setLiveForm({ title: '', teacher: '', subject: '', date: '', time: '', isLive: false }); setShowLiveModal(true); }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-700 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          إنشاء جلسة بث
        </button>
      </div>

      {/* Broadcasting Interface */}
      {isBroadcasting && broadcastingSession && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                  <Circle size={8} fill="white" />
                  بث مباشر
                </span>
                <h4 className="font-bold">{broadcastingSession.title}</h4>
              </div>
              <button
                onClick={stopBroadcast}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                إنهاء البث
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4">
              <video
                ref={adminVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-black/50'} text-white hover:opacity-80 transition`}
                  title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-black/50'} text-white hover:opacity-80 transition`}
                  title={isVideoOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
                >
                  {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
              </div>

              {/* Live Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Circle size={8} fill="white" />
                  LIVE
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-700">
                ✓ البث نشط الآن - يمكن للطلاب المشاهدة في صفحة البث المباشر
              </p>
            </div>
          </div>
        </div>
      )}

      {liveSessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Radio className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد جلسات بث</h3>
          <p className="text-gray-500">أنشئ جلسات بث مباشر للطلاب</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveSessions.map((session) => (
            <div key={session.id} className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition ${
              session.isLive ? 'border-red-200' : 'border-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-800">{session.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">بواسطة: {session.teacher}</p>
                  <p className="text-sm text-indigo-600 font-medium">{session.subject}</p>
                </div>
                {session.isLive && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    مباشر
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {session.date} - {session.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (session.isLive) {
                      stopBroadcast();
                    } else {
                      startBroadcast(session);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition text-sm font-medium ${
                    session.isLive ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  {session.isLive ? 'إيقاف البث' : 'بدء البث'}
                </button>
                <button onClick={() => handleDeleteLive(session.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">إعدادات المنصة</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنصة</label>
          <input type="text" defaultValue="منصتي التعليمية" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وصف المنصة</label>
          <textarea defaultValue="منصة تعليمية متكاملة" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 min-h-[100px]" />
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">حفظ الإعدادات</button>
      </div>
    </div>
  );

  const tabs = [
    { key: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'students', label: 'الطلاب', icon: <Users className="w-4 h-4" /> },
    { key: 'lessons', label: 'الحصص', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'exams', label: 'الامتحانات', icon: <FileText className="w-4 h-4" /> },
    { key: 'live', label: 'البث المباشر', icon: <Radio className="w-4 h-4" /> },
    { key: 'complaints', label: 'الشكاوى', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'settings', label: 'الإعدادات', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">لوحة تحكم المدير</h1>
                <p className="text-xs text-gray-500">مرحباً، {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.key ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'lessons' && renderLessons()}
        {activeTab === 'exams' && renderExams()}
        {activeTab === 'live' && renderLive()}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة الشكاوى</h3>
            <p className="text-gray-500">لديك {stats.pendingComplaints} شكاوى بانتظار المراجعة</p>
          </div>
        )}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingLesson ? 'تعديل الحصة' : 'إضافة حصة جديدة'}</h3>
              <button onClick={() => setShowLessonModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الحصة *</label>
                <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: مقدمة في الرياضيات" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 min-h-[80px]" placeholder="وصف مختصر للحصة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدة</label>
                <input type="text" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: 45 دقيقة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط الفيديو *</label>
                <input type="url" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 mb-2" placeholder="https://example.com/video.mp4" />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition cursor-pointer">
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="video-upload" />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">أو اضغط هنا لرفع فيديو من جهازك</p>
                    <p className="text-xs text-gray-400 mt-1">MP4, WebM, OGG</p>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملف PDF (اختياري)</label>
                {lessonForm.pdfUrl ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">{lessonForm.pdfName}</span>
                    </div>
                    <button onClick={handleRemovePdf} className="p-1 hover:bg-green-100 rounded">
                      <X className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition cursor-pointer">
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">اضغط هنا لرفع ملف PDF</p>
                      <p className="text-xs text-gray-400 mt-1">سيظهر للطلاب أسفل الفيديو</p>
                    </label>
                  </div>
                )}
              </div>

              {/* Lesson Quiz Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">اختبار الحصة (كويز)</h4>
                    <p className="text-xs text-gray-500 mt-1">أضف أسئلة اختيار من متعدد مع التصحيح التلقائي</p>
                  </div>
                  <button onClick={addLessonQuizQuestion} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    إضافة سؤال
                  </button>
                </div>

                {lessonQuiz.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <HelpCircle className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500 text-sm">لم تتم إضافة أسئلة بعد</p>
                    <p className="text-gray-400 text-xs mt-1">يجب إضافة سؤال واحد على الأقل</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessonQuiz.map((q, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-indigo-600">السؤال {idx + 1}</span>
                          <button onClick={() => removeLessonQuizQuestion(idx)} className="p-1 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateLessonQuizQuestion(idx, 'question', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-indigo-500"
                          placeholder="نص السؤال"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                              q.correctAnswer === optIdx
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-indigo-200'
                            }`}>
                              <input
                                type="radio"
                                name={`lesson-q-${idx}-correct`}
                                checked={q.correctAnswer === optIdx}
                                onChange={() => updateLessonQuizQuestion(idx, 'correctAnswer', optIdx)}
                                className="accent-green-600"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateLessonQuizOption(idx, optIdx, e.target.value)}
                                className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                                placeholder={`الخيار ${optIdx + 1}`}
                              />
                              {q.correctAnswer === optIdx && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 اختر الإجابة الصحيحة بالنقر على الدائرة بجانب الخيار
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowLessonModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleSaveLesson} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingExam ? 'تعديل الامتحان' : 'إنشاء امتحان جديد'}</h3>
              <button onClick={() => setShowExamModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الامتحان *</label>
                  <input type="text" value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: امتحان منتصف الفصل" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المادة *</label>
                  <input type="text" value={examForm.subject} onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: رياضيات" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدة</label>
                  <input type="text" value={examForm.duration} onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: 60 دقيقة" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select value={examForm.isAvailable ? 'available' : 'unavailable'} onChange={(e) => setExamForm({ ...examForm, isAvailable: e.target.value === 'available' })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                    <option value="available">متاح للطلاب</option>
                    <option value="unavailable">غير متاح</option>
                  </select>
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800">أسئلة الامتحان (تصحيح إلكتروني)</h4>
                  <button onClick={addQuestion} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    إضافة سؤال
                  </button>
                </div>

                {examQuestions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500 text-sm">لم تتم إضافة أسئلة بعد</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {examQuestions.map((q, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-indigo-600">السؤال {idx + 1}</span>
                          <button onClick={() => removeQuestion(idx)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                        <input type="text" value={q.question} onChange={(e) => updateQuestion(idx, 'question', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-indigo-500" placeholder="نص السؤال" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input type="radio" name={`correct-${idx}`} checked={q.correctAnswer === optIdx} onChange={() => updateQuestion(idx, 'correctAnswer', optIdx)} className="w-4 h-4 text-indigo-600" />
                              <input type="text" value={opt} onChange={(e) => updateQuestion(idx, `option-${optIdx}`, e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder={`الخيار ${optIdx + 1}`} />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">* اختر الإجابة الصحيحة بالنقر على الدائرة بجانبها</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowExamModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleSaveExam} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                حفظ الامتحان
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Session Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">إنشاء جلسة بث مباشر</h3>
              <button onClick={() => setShowLiveModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الجلسة *</label>
                <input type="text" value={liveForm.title} onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: حل مسائل المعادلات" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المعلم *</label>
                <input type="text" value={liveForm.teacher} onChange={(e) => setLiveForm({ ...liveForm, teacher: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: د. سارة أحمد" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المادة</label>
                <input type="text" value={liveForm.subject} onChange={(e) => setLiveForm({ ...liveForm, subject: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: رياضيات" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                  <input type="date" value={liveForm.date} onChange={(e) => setLiveForm({ ...liveForm, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوقت</label>
                  <input type="time" value={liveForm.time} onChange={(e) => setLiveForm({ ...liveForm, time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowLiveModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleSaveLive} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2">
                <Radio className="w-4 h-4" />
                إنشاء الجلسة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
