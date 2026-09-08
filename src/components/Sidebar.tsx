import React from 'react';
import { Page, User } from '../types';
import {
  BookOpen,
  FileText,
  MessageCircle,
  Radio,
  AlertTriangle,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'lessons', label: 'الحصص الدراسية', icon: <BookOpen size={22} /> },
  { page: 'exams', label: 'الامتحانات', icon: <FileText size={22} /> },
  { page: 'qa', label: 'الأسئلة والاستفسارات', icon: <MessageCircle size={22} /> },
  { page: 'live', label: 'البث المباشر', icon: <Radio size={22} /> },
  { page: 'complaints', label: 'الشكاوى والمشاكل', icon: <AlertTriangle size={22} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-6 border-b border-indigo-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
              <GraduationCap size={32} className="text-yellow-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold">منصتي التعليمية</h1>
              <p className="text-indigo-300 text-sm">تعلّم بلا حدود</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setCurrentPage(item.page);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-right transition-all duration-200
                ${
                  currentPage === item.page
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className={`${currentPage === item.page ? 'text-yellow-300' : ''}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700/50">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0) || 'ط'}
              </div>
              <div>
                <p className="font-medium text-sm">{currentUser?.name || 'طالب'}</p>
                <p className="text-indigo-300 text-xs">{currentUser?.email || 'student@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
