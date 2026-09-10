import React, { useState } from 'react';
import { db } from '../services/database';
import { notificationService } from '../services/notificationService';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const user = db.findUserByEmail(email);
      
      if (!user) {
        setError('هذا البريد الإلكتروني غير مسجل');
        notificationService.error('خطأ', 'البريد الإلكتروني غير مسجل');
        setIsLoading(false);
        return;
      }

      if (user.role === 'admin') {
        setError('لا يمكن إعادة تعيين كلمة مرور المدير من هنا');
        notificationService.error('خطأ', 'تواصل مع مدير النظام');
        setIsLoading(false);
        return;
      }

      if (user.status !== 'approved') {
        setError('حسابك غير مفعل. تواصل مع الإدارة');
        notificationService.error('خطأ', 'الحساب غير مفعل');
        setIsLoading(false);
        return;
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);
      
      notificationService.success('تم إرسال رمز التحقق', `رمز التحقق هو: ${otpCode} (للعرض التوضيحي)`);
      setStep('otp');
      setIsLoading(false);
    }, 1000);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== generatedOtp) {
      setError('رمز التحقق غير صحيح');
      notificationService.error('خطأ', 'رمز التحقق غير صحيح');
      return;
    }

    setStep('newPassword');
    notificationService.success('تم التحقق بنجاح', 'الآن أدخل كلمة المرور الجديدة');
  };

  // Step 3: Reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      notificationService.error('خطأ', 'كلمة المرور قصيرة جداً');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      notificationService.error('خطأ', 'كلمتا المرور غير متطابقتين');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        // Update password in database
        const users = db.getUsers();
        const updatedUsers = users.map(u => 
          u.email === email ? { ...u, password: newPassword } : u
        );
        db.saveUsers(updatedUsers);

        setSuccess(true);
        notificationService.success('تم تغيير كلمة المرور', 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة');
      } catch (err) {
        setError('حدث خطأ أثناء تغيير كلمة المرور');
        notificationService.error('خطأ', 'فشل في تغيير كلمة المرور');
      }
      setIsLoading(false);
    }, 1000);
  };

  const resendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtp('');
    notificationService.success('تم إرسال رمز جديد', `رمز التحقق الجديد هو: ${newOtp} (للعرض التوضيحي)`);
  };

  // Success View
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">تم تغيير كلمة المرور بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى تسجيل الدخول
          </button>
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
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">استعادة كلمة المرور</h1>
          <p className="text-gray-600">
            {step === 'email' && 'أدخل بريدك الإلكتروني لإرسال رمز التحقق'}
            {step === 'otp' && 'أدخل رمز التحقق المرسل إلى بريدك'}
            {step === 'newPassword' && 'أدخل كلمة المرور الجديدة'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full ${step === 'email' ? 'bg-blue-600' : 'bg-green-500'}`}></div>
          <div className={`w-8 h-0.5 ${step !== 'email' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step === 'otp' ? 'bg-blue-600' : step === 'newPassword' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-0.5 ${step === 'newPassword' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step === 'newPassword' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
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

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>إرسال رمز التحقق</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800">
                  تم إرسال رمز التحقق إلى: <strong>{email}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  (للعرض التوضيحي) الرمز هو: <strong className="text-lg">{generatedOtp}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز التحقق (6 أرقام)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center text-2xl tracking-widest py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>تحقق من الرمز</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  لم يصلك الرمز؟ إرسال مرة أخرى
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="6 أحرف على الأقل"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="أعد إدخال كلمة المرور"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>حفظ كلمة المرور الجديدة</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
