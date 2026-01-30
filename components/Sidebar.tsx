/*
  University Dormitory Management System (UDMS)
  Module: Navigation Sidebar
*/

import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isLockdown?: boolean;
  onLockdownToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout, isLockdown, onLockdownToggle }) => {
  const adminLinks = [
    { id: 'dashboard', label: 'Command Center', icon: '🏛️' },
    { id: 'rooms', label: 'Interactive Map', icon: '🗺️' },
    { id: 'maintenance', label: 'Service Hub', icon: '🛠️' },
    { id: 'audit', label: 'Security Logs', icon: '📜' },
    { id: 'visitors', label: 'Visitor Master', icon: '🛂' },
    { id: 'architecture', label: 'System Architecture', icon: '🧬' },
    { id: 'reports', label: 'Data Reports', icon: '📊' },
  ];

  const studentLinks = [
    { id: 'my-room', label: 'Unit Control', icon: '🏡' },
    { id: 'wellness', label: 'My Progress', icon: '✨' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'swaps', label: 'Room Swap', icon: '🔄' },
    { id: 'visitors', label: 'Guest Pass', icon: '👤' },
    { id: 'events', label: 'Dorm Events', icon: '📅' },
    { id: 'assistant', label: 'AI Concierge', icon: '🤖' },
  ];

  const staffLinks = [
    { id: 'tasks', label: 'Task Pipeline', icon: '📋' },
    { id: 'preventative', label: 'Facility Shield', icon: '🛡️' },
  ];

  const securityLinks = [
    { id: 'visitors', label: 'Gate Access', icon: '🛂' },
    { id: 'logs', label: 'Entry Vault', icon: '📜' },
  ];

  const links = 
    role === UserRole.ADMIN ? adminLinks : 
    role === UserRole.STUDENT ? studentLinks : 
    role === UserRole.STAFF ? staffLinks : 
    securityLinks;

  return (
    <div className={`w-64 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl transition-all duration-300 ${isLockdown ? 'bg-red-950 text-red-50' : 'bg-slate-950 text-white'}`}>
      <div className={`p-8 border-b ${isLockdown ? 'border-red-900' : 'border-slate-900'}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${isLockdown ? 'bg-red-600' : 'bg-blue-600 shadow-blue-600/20'}`}>U</div>
          <div>
            <h1 className={`text-xl font-black tracking-tighter ${isLockdown ? 'text-red-400' : 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'}`}>UDMS PRO</h1>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-[3px]">Enterprise Edition</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-8 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            disabled={isLockdown && role !== UserRole.ADMIN && link.id !== 'dashboard' && link.id !== 'assistant'}
            className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-4 group relative overflow-hidden ${
              activeTab === link.id 
                ? (isLockdown ? 'bg-red-600 text-white' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20')
                : (isLockdown ? 'hover:bg-red-900 text-red-300' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200')
            } ${(isLockdown && role !== UserRole.ADMIN && link.id !== 'dashboard' && link.id !== 'assistant') ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${activeTab === link.id ? 'scale-110' : 'opacity-60'}`}>
              {link.icon}
            </span>
            <span className="font-bold text-sm tracking-tight">{link.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-6 border-t space-y-4 ${isLockdown ? 'border-red-900' : 'border-slate-900'}`}>
        {role === UserRole.ADMIN && onLockdownToggle && (
          <button
            onClick={onLockdownToggle}
            className={`w-full px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
              isLockdown 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLockdown ? '🔓 Disable Lockdown' : '🛑 System Lockdown'}
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full px-5 py-4 text-xs text-slate-500 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-2xl transition-all flex items-center justify-center space-x-3 group"
        >
          <span className="group-hover:rotate-12 transition-transform">🔚</span>
          <span className="font-black uppercase tracking-widest text-[10px]">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;