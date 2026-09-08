import React, { useEffect, useState } from 'react';
import { GraduationCap, BookOpen, Video, Award } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Logo */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2">منصتي التعليمية</h1>
        <p className="text-xl text-white/80 mb-8">تعلّم بلا حدود</p>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-xl mb-2">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm">حصص تفاعلية</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-xl mb-2">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-sm">بث مباشر</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-xl mb-2">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-sm">شهادات</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-white/60 mt-2">جاري التحميل... {progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
