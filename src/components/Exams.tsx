import React, { useState } from 'react';
import { Exam } from '../types';
import { exams as initialExams } from '../data';
import {
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  AlertCircle,
  X,
  Award,
  ChevronLeft,
  Play,
} from 'lucide-react';

const Exams: React.FC = () => {
  const [examsData] = useState<Exam[]>(initialExams);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
    setExamAnswers({});
    setExamSubmitted(false);
    setExamScore(0);
    const minutes = parseInt(exam.duration);
    setTimeLeft(minutes * 60);
  };

  const submitExam = () => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
    setTimeLeft(null);
  };

  const closeExam = () => {
    setActiveExam(null);
    setExamSubmitted(false);
  };

  // Exam Active View
  if (activeExam) {
    return (
      <div className="min-h-screen">
        {/* Exam Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={closeExam}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{activeExam.title}</h2>
                <p className="text-gray-500 text-sm">{activeExam.subject} • {activeExam.totalQuestions} سؤال</p>
              </div>
            </div>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl">
                <Clock size={18} />
                <span className="font-mono font-bold">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Exam Questions */}
        {!examSubmitted ? (
          <div className="space-y-4">
            {activeExam.questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="font-bold text-gray-800 mb-4 text-lg">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold ml-3">
                    {idx + 1}
                  </span>
                  {q.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        examAnswers[q.id] === optIdx
                          ? 'border-indigo-400 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        examAnswers[q.id] === optIdx
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}>
                        {examAnswers[q.id] === optIdx && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name={`exam-q-${q.id}`}
                        checked={examAnswers[q.id] === optIdx}
                        onChange={() =>
                          setExamAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }
                        className="hidden"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submitExam}
              disabled={Object.keys(examAnswers).length < activeExam.questions.length}
              className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              تسليم الامتحان
            </button>
          </div>
        ) : (
          /* Exam Results */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
              examScore >= activeExam.questions.length * 0.6
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              <Award size={40} className={
                examScore >= activeExam.questions.length * 0.6
                  ? 'text-green-600'
                  : 'text-red-600'
              } />
            </div>
            <h3 className={`text-2xl font-bold ${
              examScore >= activeExam.questions.length * 0.6 ? 'text-green-700' : 'text-red-700'
            }`}>
              {examScore >= activeExam.questions.length * 0.6 ? '🎉 مبروك! لقد نجحت' : '❌ لم تنجح هذه المرة'}
            </h3>
            <p className="text-gray-600 mt-2 text-lg">
              نتيجتك: <span className="font-bold">{examScore}</span> من <span className="font-bold">{activeExam.questions.length}</span>
            </p>
            <p className="text-gray-500 mt-1">
              النسبة: {Math.round((examScore / activeExam.questions.length) * 100)}%
            </p>
            <button
              onClick={closeExam}
              className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              العودة للامتحانات
            </button>
          </div>
        )}
      </div>
    );
  }

  // Exams List View
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FileText className="text-indigo-600" size={28} />
          الامتحانات
        </h2>
        <p className="text-gray-500 mt-2">
          اختبر معلوماتك من خلال الامتحانات المتاحة. تأكد من استعدادك قبل بدء الامتحان.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-indigo-100 text-sm">إجمالي الامتحانات</p>
          <p className="text-3xl font-bold mt-1">{examsData.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <p className="text-green-100 text-sm">الامتحانات المتاحة</p>
          <p className="text-3xl font-bold mt-1">{examsData.filter(e => e.isAvailable).length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
          <p className="text-amber-100 text-sm">بانتظار الفتح</p>
          <p className="text-3xl font-bold mt-1">{examsData.filter(e => !e.isAvailable).length}</p>
        </div>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {examsData.map((exam) => (
          <div
            key={exam.id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
              exam.isAvailable
                ? 'border-gray-100 hover:shadow-md hover:border-indigo-200'
                : 'border-gray-200 opacity-75'
            }`}
          >
            <div className="p-6 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                exam.isAvailable
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {exam.isAvailable ? <FileText size={24} /> : <Lock size={20} />}
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg ${exam.isAvailable ? 'text-gray-800' : 'text-gray-400'}`}>
                  {exam.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {exam.duration}
                  </span>
                  <span className="text-xs text-gray-500">
                    {exam.totalQuestions} سؤال
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    exam.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {exam.isAvailable ? 'متاح' : 'غير متاح'}
                  </span>
                </div>
              </div>

              {exam.isAvailable ? (
                <button
                  onClick={() => startExam(exam)}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Play size={16} />
                  ابدأ الامتحان
                </button>
              ) : (
                <div className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Lock size={16} />
                  قريباً
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
