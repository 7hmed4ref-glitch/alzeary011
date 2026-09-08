import React, { useState } from 'react';
import { Complaint } from '../types';
import { complaints as initialComplaints } from '../data';
import {
  AlertTriangle,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  Loader,
  FileWarning,
  User,
  Tag,
} from 'lucide-react';

const Complaints: React.FC = () => {
  const [complaintsData, setComplaintsData] = useState<Complaint[]>(initialComplaints);
  const [showForm, setShowForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    studentName: '',
    type: '',
    subject: '',
    message: '',
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');

  const handleSubmit = () => {
    if (!newComplaint.studentName || !newComplaint.type || !newComplaint.subject || !newComplaint.message) return;

    const complaint: Complaint = {
      id: complaintsData.length + 1,
      studentName: newComplaint.studentName,
      type: newComplaint.type,
      subject: newComplaint.subject,
      message: newComplaint.message,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setComplaintsData([complaint, ...complaintsData]);
    setNewComplaint({ studentName: '', type: '', subject: '', message: '' });
    setShowForm(false);
  };

  const filteredComplaints = complaintsData.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <Clock size={12} />
            قيد الانتظار
          </span>
        );
      case 'in-progress':
        return (
          <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <Loader size={12} />
            قيد المعالجة
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <CheckCircle2 size={12} />
            تم الحل
          </span>
        );
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <AlertTriangle className="text-indigo-600" size={28} />
              الشكاوى والمشاكل
            </h2>
            <p className="text-gray-500 mt-2">
              أبلغ عن أي مشكلة أو شكوى وسيتم معالجتها في أقرب وقت
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            بلاغ جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileWarning size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{complaintsData.length}</p>
              <p className="text-xs text-gray-500">إجمالي البلاغات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {complaintsData.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">قيد الانتظار</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Loader size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {complaintsData.filter(c => c.status === 'in-progress').length}
              </p>
              <p className="text-xs text-gray-500">قيد المعالجة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {complaintsData.filter(c => c.status === 'resolved').length}
              </p>
              <p className="text-xs text-gray-500">تم الحل</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="text-indigo-500" size={20} />
            تقديم بلاغ جديد
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  value={newComplaint.studentName}
                  onChange={(e) => setNewComplaint({ ...newComplaint, studentName: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع البلاغ</label>
                <select
                  value={newComplaint.type}
                  onChange={(e) => setNewComplaint({ ...newComplaint, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">اختر النوع</option>
                  <option value="مشكلة تقنية">مشكلة تقنية</option>
                  <option value="شكوى">شكوى</option>
                  <option value="استفسار">استفسار</option>
                  <option value="اقتراح">اقتراح</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
              <input
                type="text"
                value={newComplaint.subject}
                onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="عنوان مختصر للبلاغ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التفاصيل</label>
              <textarea
                value={newComplaint.message}
                onChange={(e) => setNewComplaint({ ...newComplaint, message: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[120px] resize-none"
                placeholder="اشرح المشكلة أو الشكوى بالتفصيل..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                إرسال البلاغ
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
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'pending', label: 'قيد الانتظار' },
          { key: 'in-progress', label: 'قيد المعالجة' },
          { key: 'resolved', label: 'تم الحل' },
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
            {tab.label}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <Tag size={12} />
                    {complaint.type}
                  </span>
                  {getStatusBadge(complaint.status)}
                </div>
                <h4 className="font-bold text-gray-800">{complaint.subject}</h4>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{complaint.message}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {complaint.studentName}
                  </span>
                  <span>{complaint.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertTriangle className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">لا توجد بلاغات في هذا التصنيف</p>
        </div>
      )}
    </div>
  );
};

export default Complaints;
