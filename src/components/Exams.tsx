import React, { useState, useEffect } from 'react';
import { Exam, QuizQuestion } from '../types';
import { FileText, Clock, CheckCircle2, XCircle, Award, AlertCircle, ArrowRight, ArrowLeft, Flag } from 'lucide-react';

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Load exams from localStorage (created by admin)
  useEffect(() => {
    const storedExams = localStorage.getItem('admin_exams');
    if (storedExams) {
      setExams(JSON.parse(storedExams));
    } else {
      // Default exams for demo
      setExams([
        {
          id: 1,
          title: 'امتحان منتصف الفصل - رياضيات',
          subject: 'رياضيات',
          duration: '60 دقيقة',
          totalQuestions: 5,
          isAvailable: true,
          questions: [
            { id: 1, question: 'ما هو ناتج: 15 × 4؟', options: ['50', '55', '60', '65'], correctAnswer: 2 },
            { id: 2, question: 'جذر المعادلة: x + 7 = 12', options: ['3', '4', '5', '6'], correctAnswer: 2 },
            { id: 3, question: 'ما هو 25% من 200؟', options: ['25', '50', '75', '100'], correctAnswer: 1 },
            { id: 4, question: 'مساحة مستطيل طوله 5 وعرضه 3:', options: ['8', '15', '16', '20'], correctAnswer: 1 },
            { id: 5, question: 'ما هو العدد الأولي؟', options: ['4', '6', '7', '9'], correctAnswer: 2 },
          ],
        },
        {
          id: 2,
          title: 'امتحان نهائي - هندسة',
          subject: 'هندسة',
          duration: '90 دقيقة',
          totalQuestions: 5,
          isAvailable: true,
          questions: [
            { id: 1, question: 'محيط دائرة نصف قطرها 7 (π=22/7):', options: ['22', '44', '88', '154'], correctAnswer: 1 },
            { id: 2, question: 'مساحة مربع طول ضلعه 6:', options: ['12', '24', '36', '48'], correctAnswer: 2 },
            { id: 3, question: 'عدد أوجه المكعب:', options: ['4', '6', '8', '12'], correctAnswer: 1 },
            { id: 4, question: 'حجم مكعب طول ضلعه 3:', options: ['9', '18', '27', '36'], correctAnswer: 2 },
            { id: 5, question: 'عدد أضلاع المسدس:', options: ['5', '6', '7', '8'], correctAnswer: 1 },
          ],
        },
      ]);
    }
  }, []);

  // Timer
  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startExam = (exam: Exam) => {
    setSelectedExam(exam);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setExamStarted(true);
    // Parse duration to seconds
    const durationMatch = exam.duration.match(/(\d+)/);
    const minutes = durationMatch ? parseInt(durationMatch[1]) : 60;
    setTimeLeft(minutes * 60);
    setTimerActive(true);
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmitExam = () => {
    setTimerActive(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedExam) return 0;
    let correct = 0;
    selectedExam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const getScorePercentage = () => {
    if (!selectedExam) return 0;
    return Math.round((calculateScore() / selectedExam.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Exam List View
  if (!examStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">الامتحانات</h2>
            <p className="text-gray-500 mt-1">اختر امتحاناً لبدء الاختبار - التصحيح إلكتروني تلقائي</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">{exams.filter(e => e.isAvailable).length} امتحان متاح</span>
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد امتحانات متاحة</h3>
            <p className="text-gray-500">سيتم إضافة امتحانات جديدة قريباً من قبل المدير</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.filter(e => e.isAvailable).map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">متاح</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{exam.title}</h3>
                <p className="text-sm text-indigo-600 font-medium mb-4">{exam.subject}</p>
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
                <button
                  onClick={() => startExam(exam)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Flag className="w-5 h-5" />
                  بدء الامتحان
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Results View
  if (showResults && selectedExam) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const passed = percentage >= 60;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`p-8 text-center text-white ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-pink-600'}`}>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>
            <h2 className="text-2xl font-bold mb-2">{passed ? 'مبروك! لقد نجحت' : 'لم تجتز الامتحان'}</h2>
            <p className="opacity-90">{selectedExam.title}</p>
          </div>

          {/* Score */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-gray-800 mb-2">{percentage}%</div>
              <p className="text-gray-500">
                أجبت على {score} من {selectedExam.questions.length} أسئلة بشكل صحيح
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Question Review */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">مراجعة الإجابات</h3>
            <div className="space-y-3">
              {selectedExam.questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">س{idx + 1}: {q.question}</p>
                        {!isCorrect && (
                          <div className="text-sm">
                            <p className="text-red-600">إجابتك: {q.options[answers[q.id]] || 'لم تجب'}</p>
                            <p className="text-green-600">الإجابة الصحيحة: {q.options[q.correctAnswer]}</p>
                          </div>
                        )}
                        {isCorrect && (
                          <p className="text-sm text-green-600">إجابتك صحيحة: {q.options[q.correctAnswer]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => { setExamStarted(false); setShowResults(false); setSelectedExam(null); }}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              العودة إلى قائمة الامتحانات
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Taking View
  if (selectedExam && examStarted) {
    const question = selectedExam.questions[currentQuestion];
    const totalQuestions = selectedExam.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-3xl mx-auto">
        {/* Timer and Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              تمت الإجابة على {answeredCount} من {totalQuestions}
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              السؤال {currentQuestion + 1} من {totalQuestions}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(question.id, idx)}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                  answers[question.id] === idx
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    answers[question.id] === idx ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300 text-gray-500'
                  }`}>
                    {String.fromCharCode(1571 + idx)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
            السابق
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmitExam}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition shadow-md"
            >
              <CheckCircle2 className="w-5 h-5" />
              تسليم الامتحان
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              التالي
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-600 mb-3">التنقل بين الأسئلة:</p>
          <div className="flex flex-wrap gap-2">
            {selectedExam.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                  idx === currentQuestion
                    ? 'bg-indigo-600 text-white'
                    : answers[q.id] !== undefined
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Exams;
