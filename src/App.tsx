import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Lessons from './components/Lessons';
import Exams from './components/Exams';
import QA from './components/QA';
import LiveStream from './components/LiveStream';
import Complaints from './components/Complaints';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('lessons');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'lessons':
      case 'lesson-player':
        return <Lessons setCurrentPage={setCurrentPage} />;
      case 'exams':
        return <Exams />;
      case 'qa':
        return <QA />;
      case 'live':
        return <LiveStream />;
      case 'complaints':
        return <Complaints />;
      default:
        return <Lessons setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className="flex-1 lg:mr-0 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
