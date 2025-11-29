import React from 'react';
import { IconLogo } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex h-screen w-full bg-[#050505] font-sans text-textMain overflow-hidden selection:bg-neonGreen selection:text-black">
      {/* Desktop Sidebar (Logo Only) */}
      <aside className="hidden md:flex w-24 h-full flex-col items-center py-10 z-50 shrink-0">
        <div className="p-3 bg-white/5 rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md hover:scale-105 transition-transform duration-500">
          <IconLogo className="w-8 h-8 text-white" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative flex flex-col md:py-6 md:pr-6 pb-6 overflow-hidden">
        <div className="absolute inset-0 md:relative w-full h-full flex flex-col md:rounded-[3rem] md:border md:border-white/10 md:bg-[#0A0A0A]/80 md:backdrop-blur-3xl md:shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-neonGreen/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neonBlue/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50"></div>
             
             {children}
        </div>
      </main>
    </div>
  );
};