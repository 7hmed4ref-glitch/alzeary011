import React, { useState, useRef, useEffect } from 'react';
import { Lesson, Page } from '../types';
import { lessons as initialLessons } from '../data';
import {
  Play,
  Lock,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Video,
  HelpCircle,
  BookOpen,
  FileText,
  Download,
} from 'lucide-react';

interface LessonsProps {
  setCurrentPage: (page: Page) => void;
}

const Lessons: React.FC<LessonsProps> = ({ setCurrentPage }) => {
  const [lessonsData, setLessonsData] = useState<Lesson[]>(() => {
    const stored = localStorage.getItem('admin_lessons');
    if (stored) {
      return JSON.parse(stored);
    }
    return initialLessons;
  });

  // Sync with admin changes
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('admin_lessons');
      if (stored) {
        const adminLessons = JSON.parse(stored);
        if (adminLessons.length !== lessonsData.length) {
          setLessonsData(adminLessons);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [lessonsData.length]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLessonUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    return lessonsData[index - 1].isCompleted;
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
      if (progress >= 95) {
        setVideoWatched(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setVideoWatched(true);
    setVideoProgress(100);
  };

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setVideoProgress(lesson.isVideoWatched ? 100 : 0);
    setVideoWatched(lesson.isVideoWatched);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(lesson.isQuizPassed);
  };

  const submitQuiz = () => {
    if (!selectedLesson) return;
    let score = 0;
    selectedLesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    const passed = score >= Math.ceil(selectedLesson.quiz.length * 0.6);
    setQuizPassed(passed);

    if (passed) {
      setLessonsData((prev) =>
        prev.map((l) =>
          l.id === selectedLesson.id
            ? { ...l, isCompleted: true, isVideoWatched: true, isQuizPassed: true }
            : l
        )
      );
    }
  };

  const closeLesson = () => {
    setSelectedLesson(null);
    setShowQuiz(false);
    setVideoWatched(false);
    setVideoProgress(0);
  };

  // Lesson Player View
  if (selectedLesson) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={closeLesson}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRight size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedLesson.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{selectedLesson.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedLesson.isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedLesson.isCompleted ? 'مكتملة ✓' : 'قيد التقدم'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  src={selectedLesson.videoUrl}
                  className="w-full aspect-video"
                  controls
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Progress Bar */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">تقدم المشاهدة</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {Math.round(videoProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-l from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                {videoWatched && (
                  <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle2 size={16} />
                    <span>تم مشاهدة الفيديو بالكامل</span>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Section */}
            {selectedLesson.pdfUrl && (
              <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5 rounded-xl">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">ملف الحصة (PDF)</h4>
                      <p className="text-sm text-gray-500">{selectedLesson.pdfName || 'مرفق الحصة'}</p>
                    </div>
                  </div>
                  <a
                    href={selectedLesson.pdfUrl}
                    download={selectedLesson.pdfName || 'lesson.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-l from-red-500 to-pink-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    تحميل الملف
                  </a>
                </div>
              </div>
            )}

            {/* Quiz Section */}
            {videoWatched && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <HelpCircle className="text-indigo-500" size={22} />
                    اختبار الحصة
                  </h3>
                  {!showQuiz && !quizPassed && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      ابدأ الاختبار
                    </button>
                  )}
                </div>

                {quizPassed && !showQuiz && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="mx-auto text-green-500 mb-2" size={32} />
                    <p className="text-green-700 font-medium">أحسنت! لقد اجتزت الاختبار بنجاح</p>
                    <p className="text-green-600 text-sm mt-1">يمكنك الانتقال للحصة التالية</p>
                  </div>
                )}

                {showQuiz && (
                  <div className="space-y-6">
                    {selectedLesson.quiz.map((q, idx) => (
                      <div key={q.id} className="border border-gray-200 rounded-xl p-5">
                        <p className="font-medium text-gray-800 mb-3">
                          <span className="text-indigo-600 ml-2">س{idx + 1}:</span>
                          {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                                quizSubmitted
                                  ? optIdx === q.correctAnswer
                                    ? 'bg-green-50 border-green-300'
                                    : quizAnswers[q.id] === optIdx
                                    ? 'bg-red-50 border-red-300'
                                    : 'bg-gray-50 border-gray-200'
                                  : quizAnswers[q.id] === optIdx
                                  ? 'bg-indigo-50 border-indigo-300'
                                  : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                }
                                disabled={quizSubmitted}
                                className="accent-indigo-600"
                              />
                              <span className="text-gray-700">{opt}</span>
                              {quizSubmitted && optIdx === q.correctAnswer && (
                                <CheckCircle2 className="mr-auto text-green-500" size={18} />
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.length}
                        className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        تسليم الاختبار
                      </button>
                    ) : (
                      <div className={`p-4 rounded-xl text-center ${
                        quizPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        <p className={`font-bold text-lg ${quizPassed ? 'text-green-700' : 'text-red-700'}`}>
                          {quizPassed ? '🎉 أحسنت! لقد اجتزت الاختبار' : '❌ لم تجتز الاختبار'}
                        </p>
                        <p className={`mt-1 ${quizPassed ? 'text-green-600' : 'text-red-600'}`}>
                          نتيجتك: {quizScore} / {selectedLesson.quiz.length}
                        </p>
                        {!quizPassed && (
                          <button
                            onClick={() => {
                              setShowQuiz(true);
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className="mt-3 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            حاول مرة أخرى
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!videoWatched && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                <Lock className="mx-auto text-amber-500 mb-2" size={28} />
                <p className="text-amber-700 font-medium">يجب مشاهدة الفيديو بالكامل لفتح الاختبار</p>
                <p className="text-amber-600 text-sm mt-1">شاهد الفيديو حتى النهاية ثم أعد المحاولة</p>
              </div>
            )}
          </div>

          {/* Sidebar - Lesson Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3">معلومات الحصة</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-indigo-500" />
                  <span>المدة: {selectedLesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Video size={16} className="text-indigo-500" />
                  <span>الفيديو: {videoWatched ? 'تم ✓' : 'لم يُشاهد'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award size={16} className="text-indigo-500" />
                  <span>الاختبار: {quizPassed ? 'ناجح ✓' : 'لم يُجتَز'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3">خطوات إتمام الحصة</h3>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${videoWatched ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    videoWatched ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {videoWatched ? '✓' : '1'}
                  </div>
                  <span className="text-sm">مشاهدة الفيديو</span>
                </div>
                <div className={`flex items-center gap-3 ${quizPassed ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    quizPassed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {quizPassed ? '✓' : '2'}
                  </div>
                  <span className="text-sm">حل الاختبار بنجاح</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lessons List View
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={28} />
          الحصص الدراسية
        </h2>
        <p className="text-gray-500 mt-2">
          شاهد الفيديوهات وأجب على الاختبارات لفتح الحصص التالية. يجب إتمام كل حصة قبل الانتقال للتالية.
        </p>
      </div>

      <div className="space-y-4">
        {lessonsData.map((lesson, index) => {
          const unlocked = isLessonUnlocked(index);
          return (
            <div
              key={lesson.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${
                unlocked
                  ? 'border-gray-100 hover:shadow-md hover:border-indigo-200'
                  : 'border-gray-200 opacity-70'
              }`}
            >
              <div className="p-5 flex items-center gap-5">
                {/* Lesson Number */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  lesson.isCompleted
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                    : unlocked
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {lesson.isCompleted ? <CheckCircle2 size={24} /> : unlocked ? index + 1 : <Lock size={20} />}
                </div>

                {/* Lesson Info */}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                    {lesson.title}
                  </h3>
                  <p className={`text-sm mt-1 ${unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                    {lesson.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {lesson.duration}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <HelpCircle size={12} />
                      {lesson.quiz.length} أسئلة
                    </span>
                    {lesson.isVideoWatched && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        تم المشاهدة ✓
                      </span>
                    )}
                    {lesson.isQuizPassed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        تم الاجتياز ✓
                      </span>
                    )}
                    {lesson.pdfUrl && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FileText size={10} />
                        PDF
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {unlocked ? (
                  <button
                    onClick={() => openLesson(lesson)}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                      lesson.isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {lesson.isCompleted ? (
                      <>
                        <CheckCircle2 size={16} />
                        مكتملة
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        ابدأ الحصة
                      </>
                    )}
                  </button>
                ) : (
                  <div className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-medium flex items-center gap-2">
                    <Lock size={16} />
                    مقفلة
                  </div>
                )}
              </div>

              {/* Progress bar for incomplete lessons */}
              {unlocked && !lesson.isCompleted && (
                <div className="px-5 pb-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-l from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${
                          lesson.isVideoWatched && lesson.isQuizPassed
                            ? 100
                            : lesson.isVideoWatched
                            ? 50
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lessons;
