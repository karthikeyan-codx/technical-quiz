import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle, ArrowRight, Zap, Target, ShieldCheck, Share2, Activity } from 'lucide-react';

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('quiz_result'));
    if (!data) {
      navigate('/');
      return;
    }
    setResult(data);
  }, []);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[180px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl flex flex-col items-center"
      >
        {/* Victory Header */}
        <div className="relative mb-20 text-center">
           <motion.div
             initial={{ rotateY: 180 }}
             animate={{ rotateY: 0 }}
             transition={{ duration: 1.2, type: 'spring' }}
             className="w-48 h-48 bg-white/5 border-2 border-neon-blue/20 rounded-[3rem] flex items-center justify-center relative mx-auto mb-10 shadow-[0_0_50px_rgba(0,242,255,0.2)] group"
           >
             <Trophy size={80} className="text-neon-blue group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute -top-5 -right-5 w-16 h-16 bg-neon-purple/20 border-2 border-neon-purple/40 rounded-2xl flex items-center justify-center animate-bounce">
                <Zap size={32} className="text-neon-purple" />
             </div>
           </motion.div>
           
           <h1 className="text-6xl md:text-8xl font-black font-heading text-white tracking-tighter mb-4">MISSION <span className="text-neon-blue">SUBMITTED</span></h1>
           <p className="text-slate-500 font-heading tracking-[0.6em] text-[10px] uppercase">Telemetry data successfully synchronized</p>
        </div>

        {/* High-Tech Rank Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
          <ResultCard 
            label="Score Packet" 
            value={`${result.score}`} 
            sub="NET POINTS"
            detail={`Across 60 Vectors`}
            icon={Target}
            color="blue"
          />
          <ResultCard 
            label="Process Time" 
            value={`${Math.floor(result.timeTaken / 60)}M ${Math.floor(result.timeTaken % 60)}S`} 
            sub="TOTAL ELAPSED"
            detail="Neural Sync Speed"
            icon={Clock}
            color="purple"
          />
          <ResultCard 
            label="Accuracy Index" 
            value={`${Math.round((result.score / result.totalQuestions) * 100)}%`} 
            sub="OPTIMAL LINK"
            detail="Precision Analysis"
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Final Actions */}
        <div className="glass-card p-12 rounded-[3.5rem] border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
           <div className="absolute inset-0 bg-linear-to-r from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <div className="flex flex-col gap-3 relative z-10">
              <h3 className="text-2xl font-black font-heading text-neon-blue flex items-center gap-3 italic">
                 <ShieldCheck size={32} /> DATA PACKET LOCKED
              </h3>
              <p className="text-slate-500 text-sm max-w-md font-medium">Your session results have been encrypted and submitted to the global leaderboard. Awaiting host verification protocols.</p>
           </div>
           
           <button 
             onClick={() => { localStorage.clear(); navigate('/'); }}
             className="w-full md:w-auto px-12 py-5 bg-white text-black font-black font-heading text-lg rounded-2xl hover:bg-neon-blue hover:text-black transition-all group/btn relative overflow-hidden active:scale-95"
           >
              <span className="relative z-10 flex items-center justify-center gap-4">
                 RETURN TO HUB
                 <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
              </span>
           </button>
        </div>
      </motion.div>

      {/* Decorative Decal */}
      <footer className="fixed bottom-10 left-10 flex flex-col gap-2 opacity-10 select-none pointer-events-none">
         <div className="h-[2px] w-32 bg-neon-blue/50" />
         <div className="font-heading text-[10px] tracking-[0.5em] text-white">QUIZ ENGINE V2.6 // TERMINATED</div>
      </footer>

      <div className="scanline" />
    </div>
  );
};

const ResultCard = ({ label, value, sub, detail, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col items-center text-center relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700`}>
       <Icon size={160} />
    </div>
    
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border-2 transition-all duration-500 ${
      color === 'blue' ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue shadow-[0_0_20px_#00f2ff33]' :
      color === 'purple' ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple shadow-[0_0_20px_#bc13fe33]' :
      'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_20px_#22c55e33]'
    }`}>
      <Icon size={28} />
    </div>
    
    <span className="text-[10px] font-heading font-black tracking-[0.3em] text-slate-700 uppercase mb-3">{label}</span>
    
    <div className="flex flex-col items-center gap-1 mb-6">
       <span className="text-5xl font-black font-heading text-white">{value}</span>
       <span className="text-[8px] font-heading font-black text-slate-700 uppercase tracking-widest">{sub}</span>
    </div>
    
    <div className="mt-4 pt-4 border-t border-white/5 w-full">
       <span className="text-[10px] font-heading font-medium text-slate-500 italic">{detail}</span>
    </div>
  </motion.div>
);

export default Result;
