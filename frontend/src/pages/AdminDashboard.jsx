import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Play, Pause, BarChart3, 
  Settings, Database, Activity, LogOut, 
  ChevronRight, Terminal, Zap, ShieldCheck,
  PlusSquare, Monitor, LayoutDashboard,
  Layers, Lock, Trash2, QrCode, Globe, Cpu,
  Shield, CheckCircle2, XCircle
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, WS_BASE_URL } from '../apiConfig';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ joined: 0, approved: 0, eliminated: 0 });
  const [ws, setWs] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('admin_room'));
    if (!data) {
      navigate('/');
      return;
    }
    setAdminData(data);

    const socket = new WebSocket(`${WS_BASE_URL}/ws/${data.room_code}`);
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'REFRESH_PLAYERS' || msg.type === 'PLAYER_JOINED') {
        fetchPlayers(data.room_code);
        fetchLeaderboard(data.room_code);
      }
    };
    setWs(socket);

    const checkRoomValidity = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/admin/players/${data.room_code}`);
      } catch (err) {
        if (err.response?.status === 404) {
          localStorage.removeItem('admin_room');
          navigate('/');
        }
      }
    };
    
    checkRoomValidity();
    fetchPlayers(data.room_code);
    fetchQuestions(data.room_code);
    fetchLeaderboard(data.room_code);
    
    const interval = setInterval(() => {
      fetchPlayers(data.room_code);
      fetchLeaderboard(data.room_code);
    }, 5000);

    return () => {
      socket.close();
      clearInterval(interval);
    };
  }, []);

  const fetchPlayers = async (roomCode) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/players/${roomCode}`);
      setPlayers(res.data);
      setStats({
        joined: res.data.length,
        approved: res.data.filter(p => p.approved).length,
        eliminated: res.data.filter(p => p.status === 'Eliminated').length
      });
    } catch (err) { console.error(err); }
  };

  const fetchQuestions = async (roomCode) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/quiz/questions/${roomCode}`);
      setQuestions(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchLeaderboard = async (roomCode) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/leaderboard/${roomCode}`);
      setLeaderboard(res.data);
    } catch (err) { console.error(err); }
  };

  const approvePlayer = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/admin/approve/${id}`);
      fetchPlayers(adminData.room_code);
      ws.send(JSON.stringify({ type: 'REFRESH_PLAYERS' }));
    } catch (err) { console.error(err); }
  };

  const startQuiz = () => {
     if (ws) ws.send(JSON.stringify({ type: 'START_QUIZ' }));
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'questions', icon: Database, label: 'Questions' },
    { id: 'players', icon: Users, label: 'Players' },
    { id: 'rankings', icon: BarChart3, label: 'Rankings' },
    { id: 'sessions', icon: Layers, label: 'Sessions' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-bg-dark text-slate-200 overflow-hidden font-mono text-sm leading-relaxed">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center text-neon-blue">
            <Zap size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">TECH<span className="text-neon-blue">QUIZ</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                activeTab === item.id ? 'bg-neon-blue/10 text-white border-l-4 border-neon-blue shadow-[inset_4px_0_15px_-5px_rgba(0,242,255,0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-neon-blue' : 'transition-colors'} />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-white/5">
          <div className="mb-6 p-4 rounded-xl bg-white/3 border border-white/5">
             <div className="text-[10px] text-slate-600 uppercase mb-1">Session Key</div>
             <div className="text-neon-blue font-black tracking-widest">{adminData?.room_code}</div>
          </div>
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-3 py-4 text-red-500/80 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} />
            TERMINATE
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 px-10 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md z-40">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-white">{activeTab}</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                 <span className="text-[10px] text-cyber-green font-bold uppercase tracking-tighter">Live Monitor</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-6">
                 <Metric label="Joined" value={stats.joined} color="blue" />
                 <Metric label="Ready" value={stats.approved} color="green" />
                 <Metric label="Elim" value={stats.eliminated} color="red" />
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                 <ShieldCheck size={20} className="text-slate-500" />
              </div>
           </div>
        </header>

        <section className="flex-1 p-10 overflow-y-auto z-30 custom-scrollbar">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <StatCard icon={Activity} label="Grid Latency" value="8ms" />
                           <StatCard icon={Globe} label="Connections" value="Optimized" />
                           <StatCard icon={Cpu} label="Engine" value="v4.2.1" />
                        </div>
                        
                        <Widget title="Quick Player Overview" icon={Monitor}>
                           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                              {players.slice(0, 10).map(player => (
                                 <div key={player.id} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${player.approved ? 'bg-neon-blue/10 text-neon-blue' : 'bg-slate-800 text-slate-500'}`}>
                                          {player.name[0]}
                                       </div>
                                       <div>
                                          <div className="text-sm font-bold text-white">{player.name}</div>
                                          <div className="text-[10px] text-slate-500 font-mono">{player.college_name}</div>
                                       </div>
                                    </div>
                                    <StatusBadge status={player.status} approved={player.approved} />
                                 </div>
                              ))}
                              {players.length === 0 && <p className="text-center text-slate-700 italic py-10 tracking-[0.3em]">NO DATA FOUND</p>}
                           </div>
                        </Widget>
                     </div>
                     
                     <div className="space-y-8">
                        <Widget title="Session Profile" icon={PlusSquare}>
                           <div className="flex flex-col items-center py-6">
                              <div className="w-48 h-48 bg-white p-4 rounded-3xl mb-6 shadow-[0_0_50px_rgba(0,242,255,0.1)]">
                                 <img src={adminData?.qr_code} alt="QR Join" className="w-full h-full" />
                              </div>
                              <p className="text-[10px] text-slate-500 text-center font-bold tracking-widest leading-relaxed">
                                 SCAN TO ENGAGE SECTOR<br/>
                                 <span className="text-neon-blue">{adminData?.room_code}</span>
                              </p>
                           </div>
                        </Widget>
                        
                        <Widget title="System Health" icon={Activity}>
                           <div className="space-y-4">
                              <HealthBar label="Database Cluster" progress={98} />
                              <HealthBar label="WebSocket Node" progress={100} />
                              <HealthBar label="Encryption Engine" progress={100} />
                           </div>
                        </Widget>
                     </div>
                  </div>
                )}

                {activeTab === 'questions' && (
                  <Widget title="Question Packet Inventory" icon={Database}>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="text-[10px] text-slate-600 uppercase tracking-widest border-b border-white/5">
                              <tr>
                                 <th className="pb-4 px-4 w-16">ORDER</th>
                                 <th className="pb-4 px-4 w-24">TYPE</th>
                                 <th className="pb-4 px-4">PREVIEW // CONTENT</th>
                                 <th className="pb-4 px-4">DATA_CLUES</th>
                                 <th className="pb-4 px-4 text-right">RESPONSE</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm divide-y divide-white/5">
                              {questions.map((q, idx) => (
                                 <tr key={q.id} className="hover:bg-white/3 group transition-colors">
                                    <td className="py-6 px-4 font-mono text-[10px] text-slate-600">
                                       <div className="flex flex-col">
                                          <span className="text-white font-black text-xs">#{idx + 1}</span>
                                          <span className="text-[8px] text-slate-700 font-bold uppercase">RD.0{Math.floor(idx/20) + 1}</span>
                                       </div>
                                    </td>
                                    <td className="py-6 px-4">
                                       <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                                          q.type === 'Image' ? 'border-neon-purple/30 text-neon-purple bg-neon-purple/5' :
                                          q.type === 'Theory' ? 'border-neon-blue/30 text-neon-blue bg-neon-blue/5' :
                                          'border-cyber-green/30 text-cyber-green bg-cyber-green/5'
                                       }`}>
                                          {q.type}
                                       </span>
                                    </td>
                                    <td className="py-6 px-4">
                                       <div className="flex flex-col gap-2 max-w-md">
                                          <span className="font-bold text-slate-200 leading-tight">{q.question}</span>
                                          <div className="flex flex-wrap gap-1.5 pt-1">
                                             {q.options && q.options.map((opt, i) => (
                                                <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded-sm border ${opt === q.correct ? 'border-cyber-green/40 text-cyber-green bg-cyber-green/5 font-black' : 'border-white/5 text-slate-600'}`}>
                                                   {opt}
                                                </span>
                                             ))}
                                          </div>
                                       </div>
                                    </td>
                                    <td className="py-6 px-4">
                                       <div className="flex gap-2">
                                          {q.images && q.images.length > 0 ? q.images.map((img, i) => (
                                             <div key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center overflow-hidden shadow-inner group/img">
                                                <img src={img} alt="Clue" className="w-full h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                                             </div>
                                          )) : (
                                             <span className="text-slate-800 italic text-[10px] tracking-widest">NULL_VECTOR</span>
                                          )}
                                       </div>
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                       <div className="flex flex-col items-end">
                                          <span className="font-heading text-xs text-neon-blue font-black uppercase tracking-widest">{q.correct}</span>
                                          <div className="w-12 h-0.5 bg-neon-blue/20 mt-1" />
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </Widget>
                )}

                {activeTab === 'players' && (
                  <Widget title="Grid Participant Registry" icon={Users}>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="text-[10px] text-slate-600 uppercase tracking-widest border-b border-white/5">
                              <tr>
                                 <th className="pb-4 px-4">IDENT_TAG</th>
                                 <th className="pb-4 px-4">COLLEGE_ENTITY</th>
                                 <th className="pb-4 px-4">STATUS_FLAG</th>
                                 <th className="pb-4 px-4 text-right">COMMAND</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm divide-y divide-white/5">
                              {players.map((player) => (
                                 <tr key={player.id} className="hover:bg-white/3 transition-colors">
                                    <td className="py-6 px-4">
                                       <div className="flex items-center gap-4">
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${player.approved ? 'bg-neon-blue/10 text-neon-blue' : 'bg-slate-800 text-slate-500'}`}>
                                             {player.name[0]}
                                          </div>
                                          <span className="font-bold text-white">{player.name}</span>
                                       </div>
                                    </td>
                                    <td className="py-6 px-4 font-mono text-[10px] text-slate-500 uppercase">{player.college_name} // NODE_{player.id}</td>
                                    <td className="py-6 px-4">
                                       <StatusBadge status={player.status} approved={player.approved} />
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                       {!player.approved && (
                                          <button 
                                             onClick={() => approvePlayer(player.id)}
                                             className="px-4 py-1.5 bg-neon-blue text-black text-[10px] font-black rounded-lg hover:shadow-[0_0_15px_#00f2ff] transition-all"
                                          >
                                             GRANT ACCESS
                                          </button>
                                       )}
                                       {player.approved && (
                                          <div className="text-cyber-green/50 flex items-center justify-end gap-2 text-[10px] font-black">
                                             <CheckCircle2 size={14} /> AUTHORIZED
                                          </div>
                                       )}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </Widget>
                )}

                {activeTab === 'rankings' && (
                  <Widget title="Performance Hierarchy" icon={BarChart3}>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="text-[10px] text-slate-600 uppercase tracking-widest border-b border-white/5">
                              <tr>
                                 <th className="pb-4 px-4">RANK</th>
                                 <th className="pb-4 px-4">OPERATOR</th>
                                 <th className="pb-4 px-4">SCORE_VECTOR</th>
                                 <th className="pb-4 px-4 text-right">LATENCY</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm">
                              {leaderboard.map((p, idx) => (
                                 <tr key={p.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${idx === 0 ? 'bg-neon-blue/5' : ''}`}>
                                    <td className={`py-6 px-4 font-black ${idx === 0 ? 'text-neon-blue' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-orange-400' : 'text-slate-600'}`}>
                                       #{String(idx + 1).padStart(2, '0')}
                                    </td>
                                    <td className="py-6 px-4 font-bold text-white">{p.name} <span className="text-[10px] text-slate-600 font-normal">[{p.department}]</span></td>
                                    <td className={`py-6 px-4 font-black ${idx === 0 ? 'text-neon-blue' : 'text-slate-300'}`}>{p.score}</td>
                                    <td className="py-6 px-4 text-right font-mono text-xs text-slate-500">{p.time_taken.toFixed(1)}s</td>
                                 </tr>
                              ))}
                              {leaderboard.length === 0 && (
                                 <tr>
                                    <td colSpan="4" className="py-20 text-center text-slate-700 italic tracking-[0.3em]">AWAITING COMPLETION DATA</td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </Widget>
                )}

                {activeTab === 'sessions' && (
                   <div className="space-y-8 max-w-4xl mx-auto py-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <SessionControlCard 
                            title="Initiate Grid" 
                            desc="Protocol START synchronize all client ports." 
                            icon={Play} 
                            color="blue"
                            onClick={startQuiz}
                         />
                         <SessionControlCard 
                            title="Emergency Halt" 
                            desc="Protocol PAUSE immediately freeze all client IO." 
                            icon={Pause} 
                            color="red"
                            onClick={() => {}}
                         />
                      </div>
                      
                      <Widget title="Access Point" icon={QrCode}>
                         <div className="flex flex-col md:flex-row items-center gap-10 p-4">
                            <div className="w-64 h-64 bg-white p-4 rounded-3xl shrink-0">
                               <img src={adminData?.qr_code} alt="QR" className="w-full h-full" />
                            </div>
                            <div className="space-y-6">
                               <div className="p-6 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                                  <div className="text-[10px] text-slate-600 uppercase font-black">Join Interface</div>
                                  <div className="text-neon-blue font-mono break-all text-xs">{adminData?.join_url}</div>
                               </div>
                               <button 
                                 className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-3"
                                 onClick={() => navigator.clipboard.writeText(adminData?.join_url)}
                               >
                                  COPY LINK
                               </button>
                            </div>
                         </div>
                      </Widget>
                   </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl mx-auto py-20 space-y-12">
                     <Widget title="Global Protocols" icon={Settings}>
                        <div className="space-y-8">
                           <SettingToggle label="Advanced Anti-Cheat" active />
                           <SettingToggle label="Late Entry Authorization" active={false} />
                           <SettingToggle label="Automated Leaderboard Broadcast" active />
                           <div className="pt-4 border-t border-white/5">
                              <button className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                 REFORMAT SYSTEM DATABASE
                              </button>
                           </div>
                        </div>
                     </Widget>
                  </div>
                )}
              </motion.div>
           </AnimatePresence>
        </section>
      </main>

      <div className="animate-scan" />
    </div>
  );
};

const Metric = ({ label, value, color }) => (
  <div className="flex flex-col items-end">
     <span className="text-[8px] uppercase tracking-widest text-slate-700 font-black">{label}</span>
     <span className={`text-xl font-black font-heading ${color === 'blue' ? 'text-neon-blue shadow-[0_0_15px_#00f2ff33]' : color === 'red' ? 'text-red-500' : 'text-cyber-green'}`}>{value}</span>
  </div>
);

const Widget = ({ title, icon: Icon, children }) => (
  <div className="bg-black/20 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
     <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <Icon size={18} className="text-neon-blue opacity-50 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</h3>
     </div>
     {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white/3 border border-white/5 p-6 rounded-2xl flex items-center gap-6">
     <div className="w-12 h-12 rounded-xl bg-white/3 flex items-center justify-center text-slate-400">
        <Icon size={24} />
     </div>
     <div className="space-y-1">
        <div className="text-[9px] uppercase tracking-widest text-slate-600 font-black">{label}</div>
        <div className="text-lg font-bold text-white tracking-tight">{value}</div>
     </div>
  </div>
);

const StatusBadge = ({ status, approved }) => {
   if (status === 'Eliminated') return <span className="text-[9px] font-black px-2 py-0.5 rounded border border-red-500/30 text-red-500 bg-red-500/5">REVOKED</span>;
   if (approved) return <span className="text-[9px] font-black px-2 py-0.5 rounded border border-cyber-green/30 text-cyber-green bg-cyber-green/5">AUTHORIZED</span>;
   return <span className="text-[9px] font-black px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500 bg-yellow-500/5 animate-pulse">PENDING</span>;
};

const HealthBar = ({ label, progress }) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
        <span>{label}</span>
        <span className="text-neon-blue">{progress}%</span>
     </div>
     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-neon-blue" />
     </div>
  </div>
);

const SessionControlCard = ({ title, desc, icon: Icon, color, onClick }) => (
   <button 
      onClick={onClick}
      className={`p-10 rounded-3xl border text-left space-y-6 transition-all group ${
      color === 'blue' ? 'bg-neon-blue/5 border-neon-blue/20 hover:bg-neon-blue/10' : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
   }`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform ${
         color === 'blue' ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : 'bg-red-500/10 border-red-500/30 text-red-500'
      }`}>
         <Icon size={28} />
      </div>
      <div>
         <h4 className="text-xl font-black uppercase text-white mb-2">{title}</h4>
         <p className="text-xs text-slate-500 leading-relaxed font-bold">{desc}</p>
      </div>
   </button>
);

const SettingToggle = ({ label, active }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
     <span className="text-xs font-bold text-slate-300 uppercase">{label}</span>
     <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-neon-blue' : 'bg-slate-800'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
     </div>
  </div>
);

export default AdminDashboard;
