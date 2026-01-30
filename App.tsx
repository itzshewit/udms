/*
  University Dormitory Management System (UDMS)
  Purpose: Interactive, gamified, and AI-assisted dormitory management for universities.
*/

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserRole, User, Room, MaintenanceRequest, Payment, ChatMessage, Visitor, SystemNotification, AuditEntry, LeaderboardEntry, DormEvent, Permission } from './types';
import { MOCK_USERS, MOCK_ROOMS, MOCK_MAINTENANCE, MOCK_PAYMENTS, MOCK_VISITORS, MOCK_EVENTS } from './constants';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import FloorMap from './components/FloorMap';
import { getDormAssistantResponse, getCompatibilityScore, analyzeSentiment, analyzeMaintenanceImage, announceAuthorship } from './services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const ArchitectureView = () => {
  const layers = [
    { title: "User Interface", color: "bg-blue-600", items: ["React Core", "Tailwind CSS", "Glassmorphism UI", "PWA Support"] },
    { title: "Functional Modules", color: "bg-indigo-600", items: ["Room Logistics", "Maintenance Hub", "Billing Engine", "Gamification Core"] },
    { title: "AI Intelligence Layer", color: "bg-emerald-600", items: ["Predictive Allocation", "Urgency Prioritization", "Sentiment Analysis", "TTS Integration"] },
    { title: "Backend Services", color: "bg-slate-800", items: ["Node.js API", "Express Gateway", "Role-Based Security", "Redis Cache"] },
    { title: "Data Persistence", color: "bg-slate-950", items: ["PostgreSQL Relational", "Audit Trail Vault", "Blob Storage"] },
  ];

  return (
    <div className="space-y-12 pb-24">
      <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border dark:border-slate-800 shadow-4xl mb-12">
        <h3 className="text-4xl font-black tracking-tighter mb-6 uppercase">System Overview</h3>
        <p className="text-xl opacity-70 leading-relaxed font-medium mb-10">
          UDMS is an enterprise-grade ecosystem architected to provide seamless logistics across multi-campus university environments. It leverages high-performance caching and predictive heuristics to ensure maximum availability.
        </p>
        <div className="flex items-center space-x-4 p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10">
           <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl">🧬</div>
           <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-500">Authoritative Credit</p>
              <p className="text-lg font-black tracking-tight">Developed and architected entirely by Shewit – 2026</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {layers.map((layer, idx) => (
          <div key={idx} className="relative group">
            {idx < layers.length - 1 && (
              <div className="absolute left-1/2 -bottom-8 w-1 h-8 bg-blue-500/20 dark:bg-slate-800 -translate-x-1/2"></div>
            )}
            <div className={`p-10 rounded-[3rem] border shadow-2xl transition-all duration-500 hover:scale-[1.01] ${layer.color} text-white`}>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-3xl font-black tracking-tighter uppercase">{layer.title}</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {layer.items.map((item, i) => (
                  <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/5 text-center font-bold text-sm">{item}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- CORE STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [visitors, setVisitors] = useState<Visitor[]>(MOCK_VISITORS);
  const [events, setEvents] = useState<DormEvent[]>(MOCK_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [notifs, setNotifs] = useState<SystemNotification[]>([]);
  const [isLockdown, setIsLockdown] = useState(false);
  
  // --- UI/UX STATE ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'UDMS Virtual Assistant Online. System Status: Nominal.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [lastUpdateType, setLastUpdateType] = useState<string | null>(null);

  // --- LOGIN STATE ---
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // --- MODULE STATE ---
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [visitorForm, setVisitorForm] = useState({ name: '', visitType: 'Friend' as Visitor['visitType'], arrival: '' });
  const [maintenanceForm, setMaintenanceForm] = useState({ category: 'Other' as MaintenanceRequest['category'], description: '', image: null as string | null });
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- DERIVED DATA ---
  const occupancyRate = useMemo(() => {
    const total = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
    return ((occupied / total) * 100).toFixed(1);
  }, [rooms]);

  const sentimentData = useMemo(() => {
    const counts = maintenance.reduce((acc, curr) => {
      const s = curr.sentiment || 'NEUTRAL';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return [
      { name: 'Positive', value: counts['POSITIVE'] || 1, color: '#10b981' },
      { name: 'Neutral', value: counts['NEUTRAL'] || 2, color: '#94a3b8' },
      { name: 'Negative', value: counts['NEGATIVE'] || 0, color: '#ef4444' }
    ];
  }, [maintenance]);

  const userLeaderboard = useMemo<LeaderboardEntry[]>(() => {
    return MOCK_USERS.filter(u => u.role === UserRole.STUDENT)
      .sort((a, b) => b.points - a.points)
      .map((u, i) => ({
        id: u.id,
        name: u.name,
        points: u.points,
        rank: i + 1,
        change: 'stable'
      }));
  }, []);

  // --- HELPER: RBAC CHECK ---
  const hasPermission = (p: Permission) => {
    return currentUser?.permissions?.includes(p) || false;
  };

  // --- EFFECTS ---
  useEffect(() => {
    const savedUser = localStorage.getItem('udms_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const sync = MOCK_USERS.find(u => u.id === parsed.id) || parsed;
      setCurrentUser(sync);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  useEffect(() => {
    if (!currentUser || isLockdown) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setLastUpdateType('telemetry');
        setTimeout(() => setLastUpdateType(null), 1500);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [currentUser, isLockdown]);

  // --- CORE LOGIC HANDLERS ---
  const addAuditLog = (action: string, details: string, severity: AuditEntry['severity'] = 'Info') => {
    const entry: AuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.name || 'System',
      action, details, severity
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 100));
  };

  const sendNotification = (title: string, content: string, tabTarget?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifs(prev => [{ id, type: 'PUSH', title, content, timestamp: new Date().toLocaleTimeString(), recipientId: 'global', tabTarget }, ...prev]);
    setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 6000);
  };

  const handleSignIn = (e?: React.FormEvent) => {
    e?.preventDefault();
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === emailInput.toLowerCase().trim());
    if (user && passwordInput === user.password) {
      completeLogin(user);
    } else {
      setLoginError('Invalid identity or access key');
      setTimeout(() => setLoginError(null), 3000);
    }
  };

  const completeLogin = (user: User) => {
    setCurrentUser(user);
    setEmailInput('');
    setPasswordInput('');
    setLoginError(null);
    localStorage.setItem('udms_session', JSON.stringify(user));
    const initialTab = user.role === UserRole.ADMIN ? 'dashboard' : user.role === UserRole.STUDENT ? 'my-room' : 'tasks';
    setActiveTab(initialTab);
    addAuditLog('Login', `Authenticated session for role: ${user.role}`);
  };

  const logout = () => {
    addAuditLog('Logout', 'Session terminated by user.');
    setCurrentUser(null);
    localStorage.removeItem('udms_session');
    setIsLockdown(false);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);
    const reply = await getDormAssistantResponse([...chatHistory, { role: 'user', text: msg }]);
    setIsTyping(false);
    setChatHistory(prev => [...prev, { role: 'model', text: reply || "The Housing Core is resyncing..." }]);
  };

  const toggleLockdown = () => {
    if (!hasPermission(Permission.SECURITY_LOCKDOWN)) {
      sendNotification('❌ ACCESS DENIED', 'Insufficient privileges for security lockdown operations.');
      return;
    }

    const next = !isLockdown;
    setIsLockdown(next);
    if (next) {
      addAuditLog('Security', 'EMERGENCY LOCKDOWN INITIATED', 'Critical');
      sendNotification('⚠️ SYSTEM LOCKDOWN', 'Perimeter secured. Residents remain in units.');
    } else {
      addAuditLog('Security', 'Lockdown override successful', 'Warning');
      sendNotification('✅ LOCKDOWN OVERRIDE', 'Nominal operations resumed.');
    }
  };

  const handleSimulation = (user: User) => {
    addAuditLog('Simulation', `Admin simulating session for ${user.name}`);
    setCurrentUser(user); // Quick override for simulation
    const initialTab = user.role === UserRole.ADMIN ? 'dashboard' : user.role === UserRole.STUDENT ? 'my-room' : 'tasks';
    setActiveTab(initialTab);
  };

  // --- STUDENT ACTIONS ---
  const handleCheckInRequest = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, checkInStatus: 'Pending Approval' as User['checkInStatus'] };
    setCurrentUser(updated);
    addAuditLog('Check-In', 'Student requested arrival validation.');
    sendNotification('Request Submitted', 'Dorm Admin will review your arrival within 2 hours.');
  };

  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const newV: Visitor = {
      id: 'V' + Date.now(),
      name: visitorForm.name,
      residentId: currentUser.id,
      residentName: currentUser.name,
      expectedArrival: visitorForm.arrival,
      status: 'Upcoming',
      visitType: visitorForm.visitType
    };
    setVisitors([newV, ...visitors]);
    setVisitorForm({ name: '', visitType: 'Friend', arrival: '' });
    sendNotification('Pass Generated', `Visitor pass for ${newV.name} is awaiting gate verification.`);
    addAuditLog('Visitor', `Guest pass requested by ${currentUser.name}`);
  };

  const handleJoinEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(prev => prev.map(ev => 
      ev.id === eventId ? { ...ev, attendees: [...ev.attendees, currentUser.id] } : ev
    ));
    sendNotification('Event Joined', 'Successfully registered. XP will be awarded upon attendance.');
  };

  const handlePayment = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'Paid', transactionHash: '0x' + Math.random().toString(16).slice(2) } : p
    ));
    sendNotification('Payment Success', 'Ledger updated. Your points balance has increased.');
    addAuditLog('Financial', `Invoice ${paymentId} settled via UDMS Pay.`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setMaintenanceForm(prev => ({ ...prev, image: base64 }));
        setAiAnalysis('Analyzing...');
        const result = await analyzeMaintenanceImage(base64.split(',')[1], file.type);
        setAiAnalysis(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const themeStyle = {
    bg: isLockdown ? 'bg-red-950/20' : (isDarkMode ? 'bg-slate-950' : 'bg-gray-50'),
    card: isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-slate-900',
    text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
    muted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  // --- UI RENDERING ---
  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-8 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-16 rounded-[4rem] shadow-4xl text-center border dark:border-slate-800 animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white mx-auto mb-10 shadow-3xl">U</div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 dark:text-white">UDMS PRO</h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mb-12">Enterprise Logistics Hub</p>

          <form onSubmit={handleSignIn} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-left ml-6 opacity-40">University Identifier (Email)</label>
               <input 
                  type="text" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@university.edu"
                  className={`w-full p-6 rounded-3xl border-4 text-center text-xl font-bold outline-none transition-all ${loginError ? 'border-red-500' : 'border-gray-100 dark:border-slate-800 focus:border-blue-600 dark:bg-slate-800 dark:text-white'}`}
               />
            </div>
            
            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-left ml-6 opacity-40">System Access Key (Password)</label>
               <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full p-6 rounded-3xl border-4 text-center text-xl font-bold outline-none transition-all ${loginError ? 'border-red-500 animate-shake' : 'border-gray-100 dark:border-slate-800 focus:border-blue-600 dark:bg-slate-800 dark:text-white'}`}
               />
            </div>

            {loginError && <p className="text-red-500 text-[10px] font-black uppercase animate-in fade-in slide-in-from-top-2">{loginError}</p>}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all mt-6"
            >
              Initialize Session
            </button>
          </form>

          <div className="mt-16 pt-8 border-t dark:border-slate-800 flex flex-col items-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Architecture © 2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-all duration-1000 ${themeStyle.bg}`}>
      <Sidebar 
        role={currentUser.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={logout} 
        isLockdown={isLockdown}
        onLockdownToggle={toggleLockdown}
      />
      
      <main className={`flex-1 ml-64 p-12 relative transition-all duration-500 ${isLockdown ? 'opacity-90 saturate-50' : ''}`}>
        {isLockdown && <div className="fixed inset-0 pointer-events-none z-[100] border-[20px] border-red-600 animate-pulse"></div>}

        {/* HUD */}
        <header className="flex justify-between items-start mb-16 pb-12 border-b-2 border-gray-100 dark:border-slate-800">
          <div>
            <h2 className={`text-6xl font-black tracking-tighter uppercase ${themeStyle.text} mb-4`}>
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-6">
              <div className={`h-3 w-3 rounded-full animate-ping ${isLockdown ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                  {isLockdown ? 'CRITICAL ALERT: SECURE LOCK ACTIVE' : 'LOGISTICS CORE 01 – ACTIVE'}
                </p>
                <p className="text-[9px] font-bold opacity-20 uppercase tracking-widest mt-1">Architecture Sync: UDMS-v1.4</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-5 rounded-[2rem] bg-white dark:bg-slate-800 shadow-xl text-2xl hover:scale-110 transition-transform">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 px-8 py-4 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-slate-700">
               <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">{currentUser.name.charAt(0)}</div>
               <div className="text-left">
                  <p className="text-base font-black tracking-tight dark:text-white leading-none">{currentUser.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1">{currentUser.role} • LVL {currentUser.level}</p>
               </div>
            </div>
          </div>
        </header>

        {/* --- DYNAMIC DASHBOARDS --- */}
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Global Occupancy" value={`${occupancyRate}%`} icon="📉" trend="+0.5%" flash={!!lastUpdateType} />
                <StatCard title="Service Pipeline" value={maintenance.filter(m => m.status !== 'Completed').length} icon="🛠️" trend="Active" />
                <StatCard title="Total Yield" value="$42,100" icon="💰" trend="Stable" />
                <StatCard title="Security Pulse" value={isLockdown ? "LOCK" : "NOM"} icon="🛡️" />
              </div>

              {/* Mission Control simulation gated by MANAGE_USERS permission */}
              {hasPermission(Permission.MANAGE_USERS) && (
                <div className={`${themeStyle.card} p-10 rounded-[3rem] border shadow-xl`}>
                   <h4 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-500">Mission Control Simulation</h4>
                   <div className="flex flex-wrap gap-4">
                      {MOCK_USERS.filter(u => u.role === UserRole.STUDENT).slice(0, 6).map(u => (
                        <button key={u.id} onClick={() => handleSimulation(u)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition">Mirror {u.name}</button>
                      ))}
                   </div>
                </div>
              )}

              {/* Restrictive Operations Display for RBAC Demonstration */}
              {currentUser?.role === UserRole.ADMIN && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`${themeStyle.card} p-8 rounded-[3rem] border shadow-lg ${!hasPermission(Permission.OVERRIDE_FEE) ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                       <h5 className="font-black uppercase text-xs tracking-widest">Financial Overrides</h5>
                       {!hasPermission(Permission.OVERRIDE_FEE) && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-black">SUPER ADMIN ONLY</span>}
                    </div>
                    <p className="text-sm opacity-60 mb-6">Modify system-wide fee schedules and apply direct credit adjustments.</p>
                    <button className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest">Open Financial Core</button>
                  </div>

                  <div className={`${themeStyle.card} p-8 rounded-[3rem] border shadow-lg ${!hasPermission(Permission.REASSIGN_ROOM) ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                       <h5 className="font-black uppercase text-xs tracking-widest">Logic Reassignment</h5>
                       {!hasPermission(Permission.REASSIGN_ROOM) && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-black">UNAUTHORIZED</span>}
                    </div>
                    <p className="text-sm opacity-60 mb-6">Force manual room assignments and bypass AI compatibility heuristics.</p>
                    <button className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest">Override Allocation</button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className={`${themeStyle.card} p-12 rounded-[4rem] border shadow-4xl col-span-2`}>
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-3xl font-black tracking-tighter">Live Sentiment Analysis</h3>
                      <div className="px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black tracking-widest uppercase">System Heuristics</div>
                   </div>
                   <div className="h-[400px] w-full flex items-center">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={100} outerRadius={140} paddingAngle={8} dataKey="value" animationDuration={1000}>
                           {sentimentData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                         </Pie>
                         <Tooltip />
                       </PieChart>
                     </ResponsiveContainer>
                     <div className="flex flex-col justify-center space-y-6 min-w-[180px]">
                        {sentimentData.map(s => (
                          <div key={s.name} className="flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                              <div className="w-5 h-5 rounded-full" style={{backgroundColor: s.color}}></div>
                              <span className="font-black text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{s.name}</span>
                            </div>
                            <span className="font-black text-xl">{s.value}</span>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
                <div className="bg-slate-950 p-12 rounded-[4rem] text-white flex flex-col justify-between border border-white/5 shadow-5xl">
                   <h4 className="text-2xl font-black uppercase tracking-widest text-blue-500 mb-8">System Telemetry</h4>
                   <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4">
                      {auditLogs.length > 0 ? auditLogs.slice(0, 6).map(log => (
                        <div key={log.id} className="p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all cursor-default">
                           <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{log.timestamp}</p>
                           <p className="text-sm font-bold tracking-tight opacity-90">{log.action}: {log.details}</p>
                        </div>
                      )) : <p className="text-slate-500 italic text-center py-12">Awaiting telemetry streams...</p>}
                   </div>
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] text-center mt-8">Architecture Unified</p>
                </div>
              </div>
            </div>
          )}

          {/* ARCHITECTURE VIEW */}
          {activeTab === 'architecture' && <ArchitectureView />}

          {/* MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className={`${themeStyle.card} p-12 rounded-[4rem] border shadow-4xl`}>
                  <h3 className="text-3xl font-black tracking-tighter mb-10">Submit Anomaly Scan</h3>
                  <div className="space-y-8">
                     <div className="p-12 border-4 border-dashed border-gray-100 dark:border-slate-800 rounded-[3rem] text-center relative group overflow-hidden">
                        {maintenanceForm.image ? (
                          <img src={maintenanceForm.image} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Preview" />
                        ) : null}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <p className="text-5xl mb-4">📸</p>
                        <p className="text-sm font-black uppercase tracking-widest opacity-40">Drop Anomaly Photo or Click to Scan</p>
                     </div>

                     {aiAnalysis && (
                       <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] animate-in zoom-in-95 duration-500">
                          <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-2"></span> AI Vision Analysis
                          </p>
                          {typeof aiAnalysis === 'string' ? (
                            <p className="italic opacity-60">{aiAnalysis}</p>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                               <div><p className="text-[10px] uppercase opacity-40 font-bold">Issue</p><p className="font-black">{aiAnalysis.problem}</p></div>
                               <div><p className="text-[10px] uppercase opacity-40 font-bold">Priority</p><p className="font-black text-red-500">{aiAnalysis.priority}</p></div>
                               <div><p className="text-[10px] uppercase opacity-40 font-bold">Severity</p><p className="font-black">{aiAnalysis.severity}/10</p></div>
                               <div><p className="text-[10px] uppercase opacity-40 font-bold">Est. Cost</p><p className="font-black">{aiAnalysis.estimatedCost || 'TBD'}</p></div>
                            </div>
                          )}
                       </div>
                     )}

                     <textarea 
                        className={`w-full p-8 rounded-[2.5rem] border-2 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500'}`}
                        placeholder="Additional verbal context..."
                        rows={3}
                     />
                     <button className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition">Dispatch Service Hub</button>
                  </div>
               </div>
               <div className={`${themeStyle.card} p-12 rounded-[4rem] border shadow-4xl`}>
                  <h3 className="text-3xl font-black tracking-tighter mb-10">Active Pipeline</h3>
                  <div className="space-y-4">
                     {maintenance.map(m => (
                       <div key={m.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-transparent hover:border-blue-500/30 transition-all flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                             <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-2xl">🔧</div>
                             <div>
                                <p className="text-lg font-black tracking-tight">{m.category}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Unit {m.roomNumber}</p>
                             </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${m.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>{m.status}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* AI CONCIERGE */}
          {activeTab === 'assistant' && (
            <div className={`${themeStyle.card} rounded-[4rem] shadow-4xl border overflow-hidden flex flex-col h-[750px]`}>
               <div className="p-12 bg-slate-950 text-white flex items-center justify-between border-b border-white/5 shadow-2xl">
                  <div className="flex items-center space-x-8">
                     <div className="h-24 w-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-6xl animate-bounce-slow shadow-3xl">🤖</div>
                     <div>
                        <h3 className="text-4xl font-black tracking-tighter mb-1">Concierge Ultra</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 animate-pulse">Neural Logistics Active</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={announceAuthorship}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest transition"
                    >
                      🔊 Ident System
                    </button>
                    <div className="text-right opacity-30 hidden md:block">
                       <p className="text-3xl font-black uppercase tracking-[0.5em]">UDMS Pro</p>
                    </div>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-500`}>
                       <div className={`max-w-[75%] p-10 rounded-[3rem] text-xl font-medium shadow-xl leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 dark:text-white rounded-tl-none border dark:border-slate-700'}`}>{m.text}</div>
                    </div>
                  ))}
                  {isTyping && <div className="flex justify-start"><div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-[3rem] flex space-x-3 shadow-inner"><div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div><div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div><div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div></div></div>}
                  <div ref={chatEndRef} />
               </div>
               <div className="p-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border-t dark:border-white/5 flex items-center space-x-6">
                  <input 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Inquire about perimeter protocols..." 
                    className={`flex-1 p-8 rounded-[3rem] border-4 outline-none font-black text-2xl transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:border-blue-600' : 'bg-white border-gray-100 focus:border-blue-600'}`}
                  />
                  <button onClick={handleSendMessage} className="h-24 w-24 bg-blue-600 rounded-[2.5rem] text-white flex items-center justify-center text-4xl shadow-4xl hover:scale-105 active:scale-90 transition-transform">🚀</button>
               </div>
            </div>
          )}

          {/* PROTOCOL SYNC FALLBACK */}
          {['my-room', 'visitors', 'events', 'leaderboard', 'audit', 'rooms', 'reports', 'wellness', 'swaps'].includes(activeTab) && activeTab !== 'architecture' && (
             <div className="opacity-50 grayscale select-none pointer-events-none">
                <p className="text-center py-24 text-2xl font-black uppercase tracking-widest">Protocol Syncing...</p>
             </div>
          )}

        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f644; border-radius: 20px; border: 4px solid transparent; background-clip: content-box; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .shadow-4xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.15); }
        .shadow-5xl { box-shadow: 0 60px 150px -30px rgba(0, 0, 0, 0.4); }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;