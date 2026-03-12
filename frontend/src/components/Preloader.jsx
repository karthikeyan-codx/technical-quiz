import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 bg-bg-dark flex flex-col items-center justify-center overflow-hidden font-heading text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)]" />
      
      {/* Central Holographic Console */}
      <div className="relative flex flex-col items-center">
        {/* Concentric Scaling Rings */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-neon-blue/10 border-t-neon-blue/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-neon-purple/10 border-b-neon-purple/40"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-10 rounded-full border-2 border-white/5 shadow-[0_0_50px_rgba(0,242,255,0.1)]"
          />

          {/* Core Content */}
          <div className="text-center z-10">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-white to-slate-500"
            >
              TQ
            </motion.h1>
            <div className="h-0.5 w-12 bg-neon-blue mx-auto mt-2 shadow-[0_0_10px_#00f2ff]" />
          </div>
        </div>

        {/* Telemetry Data */}
        <div className="mt-12 w-80">
          <div className="flex justify-between items-end mb-3 px-1">
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase font-bold">Initializing Link</span>
                <span className="text-[10px] text-neon-blue font-mono font-bold tracking-widest">SECURE_HANDSHAKE</span>
             </div>
             <span className="text-2xl font-black text-white font-mono">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
             <motion.div
               animate={{ width: `${progress}%` }}
               className="absolute left-0 top-0 h-full bg-linear-to-r from-neon-blue via-neon-purple to-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.4)]"
             />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
             <div className="space-y-1">
                <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                   <div className={`h-full bg-neon-blue transition-all duration-300 ${progress > 30 ? 'w-full' : 'w-0'}`} />
                </div>
                <span className="text-[7px] text-slate-600 tracking-widest uppercase block text-center font-black">CORE_CMD</span>
             </div>
             <div className="space-y-2">
                <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                   <div className={`h-full bg-neon-purple transition-all duration-300 ${progress > 60 ? 'w-full' : 'w-0'}`} />
                </div>
                <span className="text-[7px] text-slate-600 tracking-widest uppercase block text-center font-black">DS_ARRAY</span>
             </div>
             <div className="space-y-1">
                <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                   <div className={`h-full bg-cyber-green transition-all duration-300 ${progress > 90 ? 'w-full' : 'w-0'}`} />
                </div>
                <span className="text-[7px] text-slate-600 tracking-widest uppercase block text-center font-black">SYNC_OPS</span>
             </div>
          </div>
        </div>
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute top-12 left-12 flex items-center gap-4 opacity-30">
        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_#00f2ff]" />
        <span className="text-[8px] tracking-[0.5em] text-white uppercase font-bold">Arena Link Active</span>
      </div>

      <div className="absolute bottom-12 right-12 text-right opacity-30">
        <span className="text-[8px] tracking-[0.5em] text-white uppercase block mb-2 font-bold">Protocol // TQ_OS_2026</span>
        <div className="flex gap-1 justify-end">
           {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-white/20" />)}
        </div>
      </div>

      {/* Persistent Scanline Eye Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
         <motion.div 
           animate={{ y: ['-100%', '200%'] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
           className="w-full h-24 bg-linear-to-b from-transparent via-neon-blue/20 to-transparent"
         />
      </div>
    </div>
  );
};

export default Preloader;
