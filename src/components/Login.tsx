import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/database';
import { notificationService } from '../services/notificationService';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, GraduationCap, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{show: boolean, name: string, email: string, joinDate: string} | null>(null);

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
          setPendingMessage({
            show: true,
            name: existingUser.name,
            email: existingUser.email,
            joinDate: existingUser.joinDate,
          });
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

  // Show pending message if account is under review
  if (pendingMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Pending Message Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with animation */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                <div className="relative bg-white/30 p-4 rounded-full">
                  <Clock className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">حسابك قيد المراجعة</h2>
              <p className="text-amber-100 text-sm">لم يتم الموافقة على حسابك بعد</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {pendingMessage.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{pendingMessage.name}</p>
                    <p className="text-sm text-gray-600">{pendingMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>تاريخ التسجيل: {pendingMessage.joinDate}</span>
                </div>
              </div>

              {/* Status Steps */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800 text-sm">حالة طلبك:</h3>
                
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">تم إرسال الطلب</p>
                    <p className="text-xs text-gray-500">تم استلام طلب التسجيل بنجاح</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-700">قيد المراجعة</p>
                    <p className="text-xs text-gray-500">يتم مراجعة طلبك من قبل الإدارة</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">الموافقة</p>
                    <p className="text-xs text-gray-400">في انتظار موافقة الإدارة</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">معلومات مهمة:</p>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>• سيتم مراجعة طلبك خلال 24-48 ساعة</li>
                      <li>• ستحصل على إشعار عند الموافقة على حسابك</li>
                      <li>• يمكنك المحاولة مرة أخرى بعد الموافقة</li>
                      <li>• تأكد من صحة بريدك الإلكتروني ورقم هاتفك</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setPendingMessage(null);
                    setEmail('');
                    setPassword('');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>حسناً، سأتابع لاحقاً</span>
                </button>
                
                <button
                  onClick={() => {
                    setPendingMessage(null);
                    setEmail(pendingMessage.email);
                    setPassword('');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                >
                  التحقق مرة أخرى
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              هل لديك استفسار؟{' '}
              <a href="mailto:7hmed4ref@gmail.com" className="text-amber-600 hover:text-amber-700 font-medium">
                تواصل مع الإدارة
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

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

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                هل نسيت كلمة المرور؟
              </button>
            </div>

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
