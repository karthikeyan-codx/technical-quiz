import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Shield, Cpu, Activity, Zap } from 'lucide-react';
import { API_BASE_URL, WS_BASE_URL } from '../apiConfig';

const WaitingRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('player_info'));
    if (!info) {
      navigate('/join');
      return;
    }
    setPlayerInfo(info);

    const socket = new WebSocket(`${WS_BASE_URL}/ws/${roomCode}`);
    
    socket.onopen = () => {
      console.log('Connected to WebSocket');
      socket.send(JSON.stringify({ type: 'PLAYER_JOINED', player_id: info.player_id }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'QUIZ_STARTED') {
        navigate(`/quiz/${roomCode}`);
      } else if (data.type === 'REFRESH_PLAYERS' || data.type === 'PLAYER_JOINED') {
        checkApproval(info.player_id);
      }
    };

    const interval = setInterval(() => checkApproval(info.player_id), 5000);

    return () => {
      socket.close();
      clearInterval(interval);
    };
  }, [roomCode]);

  const checkApproval = async (playerId) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/players/${roomCode}`);
      const players = await resp.json();
      const me = players.find(p => p.id === playerId);
      if (me && me.approved) {
        setIsApproved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark bg-grid flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-neon-blue to-transparent animate-scan" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-12">
           <h2 className="text-5xl font-black font-orbitron neon-text-blue tracking-tighter mb-2">NEURAL LINK</h2>
           <p className="text-gray-500 uppercase tracking-[0.5em] text-xs font-orbitron">Standby for Core Access</p>
        </div>

        <div className="glass-morphism p-12 md:p-16 border border-white/5 relative overflow-hidden text-center">
          {/* Animated Loader/Icon */}
          <div className="relative mb-12 flex justify-center">
            <AnimatePresence mode="wait">
              {!isApproved ? (
                <motion.div
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="relative w-32 h-32 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-neon-blue border-r-transparent border-b-white/5 border-l-transparent rounded-full shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-t-white/10 border-r-transparent border-b-neon-purple/50 border-l-transparent rounded-full"
                  />
                  <Activity size={40} className="text-neon-blue animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key="approved"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-green-500/10 rounded-full blur-xl"
                  />
                  <CheckCircle2 size={64} className="text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold font-orbitron mb-2 uppercase">
              {isApproved ? 'Identity Verified' : 'Establishing Handshake'}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
              {isApproved 
                ? 'Your access vector is ready. Standby for the global start signal.' 
                : 'Connecting to room vector. Waiting for host administrator to grant neural access.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-8 bg-black/40 border border-white/5 rounded-2xl text-left mb-8 backdrop-blur-3xl">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-orbitron text-gray-700 uppercase tracking-widest">Participant</span>
                <span className="text-lg font-bold truncate">{playerInfo?.name}</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-orbitron text-gray-700 uppercase tracking-widest">College</span>
                <span className="text-lg font-bold uppercase truncate">{playerInfo?.collegeName}</span>
             </div>
             <div className="col-span-2 pt-4 border-t border-white/5 flex items-center gap-2">
                <Cpu size={14} className="text-neon-blue" />
                <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-tight">Assigned SID: {playerInfo?.player_id || 'Generating...'}</span>
             </div>
          </div>

          <div className="flex items-center justify-center gap-3">
             <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-1/3 h-full bg-linear-to-r from-transparent via-neon-blue to-transparent"
                />
             </div>
             <div className="px-4 py-1 rounded bg-black/40 border border-white/5 text-[10px] font-black font-orbitron text-gray-600 tracking-widest">
                {roomCode}
             </div>
             <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-1/3 h-full bg-linear-to-r from-transparent via-neon-blue to-transparent"
                />
             </div>
          </div>
        </div>

        {/* Security Alert if not approved */}
        {!isApproved && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-red-500/60 font-orbitron tracking-widest animate-pulse"
          >
            <Shield size={14} />
            <span>ENCRYPTED GRID ACCESS REQUIRED</span>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
            }}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px #00f2ff'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaitingRoom;
