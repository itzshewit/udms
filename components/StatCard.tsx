/*
  University Dormitory Management System (UDMS)
  Module: Dashboard Stat Visualization
*/

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendColor?: string;
  flash?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendColor = 'text-green-600', flash = false }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/5 cursor-pointer relative overflow-hidden ${flash ? 'border-blue-500 animate-flash' : 'border-gray-100 dark:border-slate-800'}`}>
      {flash && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
           <span className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></span>
        </div>
      )}
      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-3">{title}</p>
        <h3 className={`text-4xl font-black tracking-tighter text-gray-900 dark:text-white transition-transform origin-left ${flash ? 'scale-110' : ''}`}>{value}</h3>
        {trend && (
          <div className="flex items-center space-x-2 mt-4">
             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${trendColor} bg-current/10`}>
                {trend}
             </span>
          </div>
        )}
      </div>
      <div className="bg-blue-50 dark:bg-blue-600/10 p-5 rounded-[2rem] text-4xl shadow-inner transition-transform duration-500 group-hover:rotate-12">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;