import React, { useState } from 'react';
import { Question } from '../types';
import { questions as initialQuestions } from '../data';
import {
  MessageCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
} from 'lucide-react';

const QA: React.FC = () => {
  const [questionsData, setQuestionsData] = useState<Question[]>(initialQuestions);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    studentName: '',
    subject: '',
    question: '',
  });
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered'>('all');

  const handleSubmit = () => {
    if (!newQuestion.studentName || !newQuestion.subject || !newQuestion.question) return;

    const question: Question = {
      id: questionsData.length + 1,
      studentName: newQuestion.studentName,
      subject: newQuestion.subject,
      question: newQuestion.question,
      date: new Date().toISOString().split('T')[0],
      isAnswered: false,
      replies: [],
    };

    setQuestionsData([question, ...questionsData]);
    setNewQuestion({ studentName: '', subject: '', question: '' });
    setShowForm(false);
  };

  const filteredQuestions = questionsData.filter((q) => {
    if (filter === 'answered') return q.isAnswered;
    if (filter === 'unanswered') return !q.isAnswered;
    return true;
  });

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <MessageCircle className="text-indigo-600" size={28} />
              الأسئلة والاستفسارات
            </h2>
            <p className="text-gray-500 mt-2">
              اطرح أسئلتك واستفساراتك وسيتم الرد عليها من قبل المعلمين
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            سؤال جديد
          </button>
        </div>
      </div>

      {/* New Question Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-6 mb-6 animate-in">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="text-indigo-500" size={20} />
            طرح سؤال جديد
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                type="text"
                value={newQuestion.studentName}
                onChange={(e) => setNewQuestion({ ...newQuestion, studentName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="أدخل اسمك"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
              <select
                value={newQuestion.subject}
                onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">اختر المادة</option>
                <option value="رياضيات">رياضيات</option>
                <option value="هندسة">هندسة</option>
                <option value="إحصاء">إحصاء</option>
                <option value="جبر">جبر</option>
                <option value="فيزياء">فيزياء</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السؤال</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[100px] resize-none"
                placeholder="اكتب سؤالك هنا..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                إرسال السؤال
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'الكل', count: questionsData.length },
          { key: 'answered', label: 'تم الرد', count: questionsData.filter(q => q.isAnswered).length },
          { key: 'unanswered', label: 'بانتظار الرد', count: questionsData.filter(q => !q.isAnswered).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      {q.subject}
                    </span>
                    {q.isAnswered ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        تم الرد
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <Clock size={12} />
                        بانتظار الرد
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-800">{q.question}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {q.studentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {q.date}
                    </span>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedQuestion === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Replies */}
            {expandedQuestion === q.id && q.replies.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                <h4 className="font-medium text-gray-700 mb-3 text-sm">الردود:</h4>
                <div className="space-y-3">
                  {q.replies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{reply.teacherName}</span>
                        <span className="text-xs text-gray-400">{reply.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pr-9">{reply.reply}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedQuestion === q.id && q.replies.length === 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-5 text-center">
                <p className="text-gray-400 text-sm">لا توجد ردود بعد. سيتم الرد على سؤالك قريباً.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <MessageCircle className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">لا توجد أسئلة في هذا التصنيف</p>
        </div>
      )}
    </div>
  );
};

export default QA;
