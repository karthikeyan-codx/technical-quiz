import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, AlertCircle, ChevronRight, Ban, Zap, Shield, Cpu, Activity, Lock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, WS_BASE_URL } from '../apiConfig';

const Quiz = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [isEliminated, setIsEliminated] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [selectedOption, setSelectedOption] = useState(null);
  const [ws, setWs] = useState(null);

  const timerRef = useRef(null);
  const playerInfo = JSON.parse(localStorage.getItem('player_info'));

  // Anti-cheat detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !finished && !isEliminated) {
        eliminate('Tab switching detected');
      }
    };

    const handleBlur = () => {
      if (!finished && !isEliminated) {
        eliminate('Window minimized or focus lost');
      }
    };

    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 'i' || e.key === 'j')) {
        e.preventDefault();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finished, isEliminated]);

  const eliminate = (reason) => {
    setIsEliminated(true);
    if (ws) {
      ws.send(JSON.stringify({ 
        type: 'ELIMINATE_PLAYER', 
        player_id: playerInfo.player_id, 
        reason 
      }));
    }
    axios.post(`${API_BASE_URL}/api/admin/eliminate/${playerInfo.player_id}`, { reason }).catch(console.error);
  };

  useEffect(() => {
    if (!playerInfo) {
      navigate('/join');
      return;
    }

    const fetchQuestions = async () => {
       try {
         const res = await axios.get(`${API_BASE_URL}/api/quiz/questions/${roomCode}`);
         setQuestions(res.data);
       } catch (err) { console.error(err); }
    };
    fetchQuestions();

    const socket = new WebSocket(`${WS_BASE_URL}/ws/${roomCode}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PLAYER_ELIMINATED' && data.player_id === playerInfo.player_id) {
        setIsEliminated(true);
      }
    };
    setWs(socket);

    return () => socket.close();
  }, [roomCode]);

  useEffect(() => {
    if (questions.length > 0 && !finished && !isEliminated) {
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions, finished, isEliminated]);

  const startTimer = () => {
    if (finished || isEliminated) return;
    setTimeLeft(15);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOptionSelect = (option) => {
    if (selectedOption !== null || finished || isEliminated) return;
    setSelectedOption(option);
    if (option === questions[currentIndex].correct) setScore(prev => prev + 1);
    setTimeout(() => handleNextQuestion(), 600);
  };

  const handleNextQuestion = () => {
    if (finished || isEliminated) return;
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (finished) return;
    setFinished(true);
    clearInterval(timerRef.current);
    const totalTime = (Date.now() - startTime) / 1000;
    try {
      const formData = new FormData();
      formData.append('player_id', playerInfo.player_id);
      formData.append('score', score);
      formData.append('time_taken', totalTime);
      await axios.post(`${API_BASE_URL}/api/quiz/submit`, formData);
      localStorage.setItem('quiz_result', JSON.stringify({ score, totalQuestions: questions.length, timeTaken: totalTime }));
      navigate('/result');
    } catch (err) { navigate('/result'); }
  };

  if (isEliminated) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
         <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass-card p-16 rounded-[3rem] border-red-500/20 relative z-10">
            <div className="w-24 h-24 bg-red-500/5 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-red-500 shadow-[0_0_30px_#ef444433] animate-pulse">
               <Ban size={48} />
            </div>
            <h1 className="text-5xl font-heading font-black text-red-500 mb-6 tracking-tighter uppercase">Connection Terminated</h1>
            <p className="text-xl text-slate-500 font-heading tracking-widest uppercase italic mb-8">Security Violation: Unauthorized Redirect Detected</p>
            <button onClick={() => navigate('/')} className="btn-primary bg-red-500 text-white shadow-[#ef444466]">System Reset</button>
         </motion.div>
      </div>
    );
  }

  if (questions.length === 0) return (
     <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center gap-6">
        <Activity size={48} className="text-neon-blue animate-pulse" />
        <span className="font-heading tracking-[0.5em] text-slate-700 uppercase">Synchronizing Packet Stream...</span>
     </div>
  );

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark font-body relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      {/* Top Telemetry */}
      <header className="h-24 px-10 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-40">
         <div className="flex items-center gap-10">
            <div>
               <h2 className="text-lg font-black font-heading text-white tracking-widest uppercase">
                  Arena <span className="text-neon-blue">0X {roomCode}</span>
               </h2>
               <div className="flex items-center gap-2 text-[9px] font-heading text-slate-600 tracking-widest uppercase">
                  <Shield size={10} className="text-neon-blue" /> Grid Secure // Anti-Cheat Operational
               </div>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block" />
            <div className="hidden md:flex gap-3">
               {[1, 2, 3].map(r => (
                  <div key={r} className={`px-4 py-1 rounded-lg text-[9px] font-black font-heading tracking-widest uppercase border ${
                    (currentIndex < 20 && r === 1) || (currentIndex >= 20 && currentIndex < 40 && r === 2) || (currentIndex >= 40 && r === 3)
                    ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_#00f2ff66]' : 'bg-white/5 text-slate-700 border-white/5'
                  }`}>
                    Round 0{r}
                  </div>
               ))}
            </div>
         </div>

         <div className="flex items-center gap-12">
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-heading font-black text-slate-700 uppercase tracking-widest">Score Vector</span>
               <span className="text-2xl font-heading font-black text-neon-blue">{score} <span className="text-slate-800">/ 60</span></span>
            </div>
            
            {/* Round Timer Circle */}
            <div className="relative w-16 h-16 flex items-center justify-center group overflow-hidden">
               <div className="absolute inset-0 rounded-full border-2 border-white/5" />
               <motion.div 
                 className={`absolute inset-0 rounded-full border-2 ${timeLeft <= 5 ? 'border-red-500' : 'border-neon-blue'}`}
                 initial={{ scale: 0.8 }}
                 animate={{ scale: 1 }}
                 transition={{ repeat: Infinity, duration: 2 }}
               />
               <span className={`text-xl font-heading font-black relative z-10 ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                 {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
               </span>
            </div>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-30">
         <div className="w-full max-w-5xl">
            
            {/* Global Progress Bar */}
            <div className="mb-12 flex items-center gap-6">
               <span className="text-[10px] font-heading text-slate-700">01</span>
               <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-linear-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_#00f2ff33]" />
               </div>
               <span className="text-[10px] font-heading text-slate-700">60</span>
            </div>

            <AnimatePresence mode="wait">
               <motion.div
                 key={currentIndex}
                 initial={{ opacity: 0, scale: 0.98, x: 20 }}
                 animate={{ opacity: 1, scale: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 1.02, x: -20 }}
                 className="w-full"
               >
                  <div className="glass-card p-12 md:p-16 rounded-[3rem] relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-neon-blue group-hover:opacity-[0.06] transition-opacity">
                        <Cpu size={240} />
                     </div>
                     
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[9px] font-heading font-black text-neon-blue tracking-widest uppercase mb-10">
                           <Activity size={12} /> Packet #{currentIndex + 1} // {currentQuestion.type}
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl font-black font-heading mb-16 leading-tight tracking-tighter">
                           {currentQuestion.question}
                        </h3>

                        {/* Image Round Asset */}
                        {currentQuestion.type === 'Image' && (
                          <div className="grid grid-cols-3 gap-6 mb-16 px-4">
                            {currentQuestion.images.map((img, i) => (
                               <motion.div key={i} whileHover={{ y: -10 }} className="aspect-square rounded-3xl overflow-hidden glass-card border-white/10 p-2 shadow-2xl">
                                  <img src={img || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentIndex}-${i}`} alt="Clue" className="w-full h-full object-cover rounded-2xl" />
                               </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentQuestion.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionSelect(option)}
                              disabled={selectedOption !== null}
                              className={`flex items-center justify-between p-8 rounded-2xl border-2 transition-all duration-300 relative group/btn ${
                                selectedOption === option ? 'bg-neon-blue/10 border-neon-blue/50 ring-4 ring-neon-blue/10' : 'bg-black/40 border-white/5 hover:border-white/20'
                              }`}
                            >
                               <div className="flex items-center gap-6 relative z-10">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-sm border-2 transition-all ${
                                     selectedOption === option ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_#00f2ff]' : 'border-white/10 text-slate-600 group-hover/btn:border-neon-blue/30 group-hover/btn:text-neon-blue'
                                  }`}>
                                     {String.fromCharCode(65 + idx)}
                                  </div>
                                  <span className="text-xl font-bold font-heading uppercase tracking-tight">{option}</span>
                               </div>
                               {selectedOption === option && <ChevronRight size={24} className="text-neon-blue" />}
                               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                            </button>
                          ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </AnimatePresence>
         </div>
      </main>

      {/* Footer System Status */}
      <footer className="h-12 border-t border-white/5 px-10 flex items-center justify-between relative z-40 bg-black/20 text-[8px] font-heading font-black text-slate-700 tracking-[0.4em] uppercase">
         <div className="flex items-center gap-6 italic">
            <span>Neural Link Established</span>
            <div className="w-1 h-1 rounded-full bg-slate-900" />
            <span>Encrypted Session</span>
         </div>
         <div className="text-neon-blue opacity-50">
            Node Identity: {playerInfo?.name} // Dev-ID: {playerInfo?.player_id}
         </div>
      </footer>

      <div className="scanline" />
    </div>
  );
};

export default Quiz;
