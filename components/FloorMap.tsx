/*
  University Dormitory Management System (UDMS)
  Module: Interactive Floor Map Navigation
*/

import React from 'react';
import { Room } from '../types';

interface FloorMapProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
  isDarkMode: boolean;
}

const FloorMap: React.FC<FloorMapProps> = ({ rooms, onRoomClick, isDarkMode }) => {
  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a: number, b: number) => a - b);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">Interactive Perimeter Map</h3>
          <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">System Node v1.4</p>
        </div>
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ready</span></div>
           <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-slate-400 rounded-full"></div><span className="text-[10px] font-black uppercase tracking-widest opacity-60">Full</span></div>
           <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-[10px] font-black uppercase tracking-widest opacity-60">Offline</span></div>
        </div>
      </div>

      {floors.map(floor => (
        <div key={floor} className="space-y-10">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-2xl text-white font-black shadow-lg">L{floor}</div>
            <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {rooms.filter(r => r.floor === floor).map(room => (
              <button
                key={room.id}
                onClick={() => onRoomClick(room)}
                className={`group relative p-10 rounded-[3rem] border-4 transition-all duration-500 hover:scale-[1.03] active:scale-95 text-left flex flex-col justify-between h-56 shadow-xl ${
                  room.status === 'Full' 
                    ? (isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-100 border-gray-200 opacity-60')
                    : room.status === 'Maintenance'
                    ? (isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-100')
                    : (isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50' : 'bg-white border-white hover:border-blue-500/30')
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl font-black tracking-tighter">{room.number}</span>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       room.status === 'Available' ? 'bg-emerald-500/20 text-emerald-500' : 
                       room.status === 'Full' ? 'bg-slate-500/20 text-slate-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                       {room.status}
                    </div>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 leading-none">{room.dormitory}</p>
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Occupancy</p>
                      <p className="text-xl font-black">{room.occupied} / {room.capacity}</p>
                   </div>
                   <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ${room.status === 'Maintenance' ? 'bg-red-500' : 'bg-blue-600'}`} 
                        style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                      ></div>
                   </div>
                </div>

                {/* AI Insight Badge */}
                {room.avgCompatibility && room.avgCompatibility > 80 && (
                   <div className="absolute -top-3 -right-3 h-10 w-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg border-4 border-white dark:border-slate-900 animate-pulse">★</div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloorMap;