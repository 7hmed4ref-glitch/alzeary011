import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Lessons from './components/Lessons';
import Exams from './components/Exams';
import QA from './components/QA';
import LiveStream from './components/LiveStream';
import Complaints from './components/Complaints';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import NotificationToast from './components/NotificationToast';
import SplashScreen from './components/SplashScreen';
import { Page, User } from './types';
import { LogOut, User as UserIcon, Shield, GraduationCap } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('lessons');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [showSplash, setShowSplash] = useState(true);

  // تحميل المستخدم من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // عرض شاشة البداية
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('lessons');
  };

  // إذا لم يكن هناك مستخدم مسجل، عرض صفحة تسجيل الدخول
  if (!currentUser) {
    if (authPage === 'register') {
      return <Register onRegister={handleLogin} onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthPage('register')} />;
  }

  // إذا كان المستخدم مدير، عرض لوحة التحكم
  if (currentUser.role === 'admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // عرض المنصة للطالب
  const renderPage = () => {
    switch (currentPage) {
      case 'lessons':
      case 'lesson-player':
        return <Lessons setCurrentPage={setCurrentPage} />;
      case 'exams':
        return <Exams />;
      case 'qa':
        return <QA />;
      case 'live':
        return <LiveStream />;
      case 'complaints':
        return <Complaints />;
      default:
        return <Lessons setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Notification Toast */}
      <NotificationToast />

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    طالب
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                title="تسجيل خروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
