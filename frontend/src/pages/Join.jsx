import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Hash, ArrowLeft, Send, ShieldCheck, Zap } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Join = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    roomCode: searchParams.get('room') || ''
  });
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsJoining(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('college_name', formData.collegeName);
      data.append('room_code', formData.roomCode.trim());
      
      const response = await axios.post(`${API_BASE_URL}/api/join`, data);
      localStorage.setItem('player_info', JSON.stringify({
        ...response.data,
        collegeName: formData.collegeName
      }));
      navigate(`/waiting/${formData.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'CONNECTION REFUSED: INVALID VECTOR');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 p-4 rounded-xl glass-card border-white/10 text-slate-400 hover:text-white hover:border-neon-blue transition-all z-50 flex items-center gap-2 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-heading tracking-widest uppercase">Abort Connection</span>
      </motion.button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-12">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-20 h-20 bg-neon-purple/10 border border-neon-purple/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-neon-purple"
           >
              <Zap size={40} className="animate-pulse" />
           </motion.div>
           <h2 className="text-4xl font-black font-heading tracking-tighter uppercase mb-2">Initialize <span className="text-neon-purple">Vector</span></h2>
           <p className="text-slate-500 font-heading text-[10px] tracking-[0.4em] uppercase">Security Protocol v2.6 Ready</p>
        </div>

        <div className="glass-card p-10 md:p-12 rounded-[2.5rem] border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-neon-purple">
             <ShieldCheck size={120} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-heading tracking-widest text-slate-500 uppercase ml-1">Identity Tag</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-neon-purple rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ENTER FULL NAME"
                    className="w-full bg-black/50 border-2 border-white/5 py-5 pl-14 pr-4 rounded-2xl outline-none focus:border-neon-purple transition-all text-lg font-bold placeholder:text-slate-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Department Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-heading tracking-widest text-slate-500 uppercase ml-1">College Entity</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-neon-purple rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
                    placeholder="ENTER COLLEGE NAME"
                    className="w-full bg-black/50 border-2 border-white/5 py-5 pl-14 pr-4 rounded-2xl outline-none focus:border-neon-purple transition-all text-lg font-bold placeholder:text-slate-800 uppercase"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Room Code Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-heading tracking-widest text-slate-500 uppercase ml-1">Room Frequency</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-neon-purple rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-neon-purple" size={24} />
                  <input
                    type="text"
                    value={formData.roomCode}
                    onChange={(e) => setFormData({...formData, roomCode: e.target.value})}
                    placeholder="00000"
                    className="w-full bg-black/60 border-2 border-neon-purple/30 py-6 pl-16 pr-4 rounded-2xl outline-none focus:border-neon-purple transition-all text-3xl font-black font-heading tracking-[0.4em] text-white placeholder:text-white/5"
                    required
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black tracking-widest uppercase text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isJoining}
              className="w-full py-5 bg-neon-purple text-white font-black font-heading text-xl rounded-2xl shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_40px_rgba(188,19,254,0.5)] transition-all flex items-center justify-center gap-4 group"
            >
              {isJoining ? 'SYNCING...' : 'ESTABLISH LINK'}
              {!isJoining && <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="mt-12 flex justify-between items-center opacity-30 select-none">
           <div className="text-[8px] font-heading tracking-[0.5em] text-white">LATENCY // 12MS</div>
           <div className="text-[8px] font-heading tracking-[0.5em] text-white">ENCRYPTION // ACTIVE</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Join;
