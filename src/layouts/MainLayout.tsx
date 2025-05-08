
import React from 'react';
import Sidebar from '@/components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-64 h-full overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-100">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
