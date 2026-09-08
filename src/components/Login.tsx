import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/database';
import { notificationService } from '../services/notificationService';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, GraduationCap, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // First check if user exists
      const existingUser = db.findUserByEmail(email);
      
      if (existingUser && existingUser.role === 'student') {
        // Check if student is pending
        if (existingUser.status === 'pending') {
          setError('حسابك قيد المراجعة. سيتم إشعارك عند الموافقة عليه من قبل الإدارة');
          notificationService.warning('حسابك قيد المراجعة', 'انتظر موافقة الإدارة');
          setIsLoading(false);
          return;
        }
        // Check if student is rejected
        if (existingUser.status === 'rejected') {
          setError('تم رفض طلب تسجيلك. يرجى التواصل مع الإدارة');
          notificationService.error('تم رفض طلبك', 'تواصل مع الإدارة للمزيد من المعلومات');
          setIsLoading(false);
          return;
        }
      }
      
      // Authenticate user using database
      const user = db.authenticate(email, password);
      
      if (user) {
        notificationService.success('تم تسجيل الدخول بنجاح', `مرحباً ${user.name}`);
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          joinDate: user.joinDate,
          phone: user.phone,
          status: user.status,
        });
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        notificationService.error('فشل تسجيل الدخول', 'تحقق من بياناتك وحاول مرة أخرى');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">منصتي التعليمية</h1>
          <p className="text-gray-600">تسجيل الدخول للوصول إلى حصصك وامتحاناتك</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Admin Login Hint */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              هل أنت مدير؟ استخدم بيانات المدير الخاصة بك
            </p>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                سجل الآن
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
