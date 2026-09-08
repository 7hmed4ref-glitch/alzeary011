import React, { useState } from 'react';
import { User, Page } from '../types';
import {
  Users,
  BookOpen,
  FileText,
  Radio,
  AlertTriangle,
  MessageCircle,
  LogOut,
  GraduationCap,
  Shield,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Student {
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
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'lessons' | 'exams' | 'complaints' | 'settings'>('overview');

  // بيانات تجريبية للطلاب
  const [students] = useState<Student[]>([
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', joinDate: '2024-01-15', completedLessons: 3, totalLessons: 5, examScore: 85, status: 'active' },
    { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0509876543', joinDate: '2024-01-20', completedLessons: 5, totalLessons: 5, examScore: 92, status: 'active' },
    { id: 3, name: 'محمد سعيد', email: 'mohammed@example.com', phone: '0551112233', joinDate: '2024-02-01', completedLessons: 2, totalLessons: 5, examScore: 70, status: 'active' },
    { id: 4, name: 'نورة حسن', email: 'noura@example.com', phone: '0554445566', joinDate: '2024-02-10', completedLessons: 4, totalLessons: 5, examScore: 88, status: 'active' },
    { id: 5, name: 'عبدالله خالد', email: 'abdullah@example.com', phone: '0557778899', joinDate: '2024-02-15', completedLessons: 1, totalLessons: 5, examScore: 65, status: 'inactive' },
  ]);

  const stats = {
    totalStudents: students.length,
    totalLessons: 5,
    totalExams: 3,
    activeLiveSessions: 2,
    pendingComplaints: 1,
    unansweredQuestions: 2,
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
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
              <p className="text-purple-200 text-xs mt-2">2 متاح الآن</p>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          النشاط الأخير
        </h3>
        <div className="space-y-3">
          {[
            { icon: <Users className="w-4 h-4 text-blue-500" />, text: 'طالب جديد انضم: عبدالله خالد', time: 'منذ ساعتين', color: 'bg-blue-50' },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, text: 'فاطمة علي أكملت جميع الحصص', time: 'منذ 3 ساعات', color: 'bg-green-50' },
            { icon: <FileText className="w-4 h-4 text-purple-500" />, text: 'تم إنشاء امتحان جديد: الهندسة', time: 'منذ 5 ساعات', color: 'bg-purple-50' },
            { icon: <MessageCircle className="w-4 h-4 text-amber-500" />, text: 'سؤال جديد من محمد سعيد', time: 'منذ يوم', color: 'bg-amber-50' },
            { icon: <Radio className="w-4 h-4 text-red-500" />, text: 'جلسة بث مباشر: المعادلات التفاضلية', time: 'منذ يومين', color: 'bg-red-50' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
              <div className={`${item.color} p-2 rounded-lg`}>{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{item.text}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">إدارة الطلاب</h3>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="بحث عن طالب..."
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الطالب</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">البريد</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاريخ الانضمام</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">التقدم</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">درجة الامتحان</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
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
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${(student.completedLessons / student.totalLessons) * 100}%` }}
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
                      student.examScore >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {student.examScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {student.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded-lg transition">
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-amber-50 rounded-lg transition">
                        <Edit className="w-4 h-4 text-amber-500" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">إعدادات المنصة</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنصة</label>
          <input
            type="text"
            defaultValue="منصتي التعليمية"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وصف المنصة</label>
          <textarea
            defaultValue="منصة تعليمية متكاملة للطلاب والمعلمين"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني للتواصل</label>
          <input
            type="email"
            defaultValue="info@platform.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">تفعيل التسجيل الجديد</p>
            <p className="text-sm text-gray-500">السماح للطلاب الجدد بإنشاء حسابات</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );

  const tabs = [
    { key: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'students', label: 'الطلاب', icon: <Users className="w-4 h-4" /> },
    { key: 'lessons', label: 'الحصص', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'exams', label: 'الامتحانات', icon: <FileText className="w-4 h-4" /> },
    { key: 'complaints', label: 'الشكاوى', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'settings', label: 'الإعدادات', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
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
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                تسجيل خروج
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
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
        {activeTab === 'lessons' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة الحصص</h3>
            <p className="text-gray-500 mb-4">يمكنك إضافة وتعديل الحصص الدراسية من هنا</p>
            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              إضافة حصة جديدة
            </button>
          </div>
        )}
        {activeTab === 'exams' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة الامتحانات</h3>
            <p className="text-gray-500 mb-4">يمكنك إنشاء وإدارة الامتحانات من هنا</p>
            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              إنشاء امتحان جديد
            </button>
          </div>
        )}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة الشكاوى</h3>
            <p className="text-gray-500 mb-4">لديك {stats.pendingComplaints} شكاوى بانتظار المراجعة</p>
            <button className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-700 transition">
              مراجعة الشكاوى
            </button>
          </div>
        )}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;
