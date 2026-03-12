import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  Lock,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Zap,
  Activity,
  ArrowRight,
  Terminal,
  Server,
  Radio,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const Home = () => {
  const navigate = useNavigate();
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    localStorage.removeItem("admin_room"); // Clear stale session
    try {
      console.log("Attempting Admin Login...");
      const formData = new FormData();
      formData.append("password", adminPassword.trim());
      const response = await axios.post(
        `${API_BASE_URL}/api/host/login`,
        formData
      );
      console.log("Login Success:", response.data);
      localStorage.setItem("admin_room", JSON.stringify(response.data));
      navigate("/admin");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.detail || "AUTHENTICATION FAILED: INVALID ACCESS KEY");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-dark text-slate-100 overflow-hidden font-mono">
      {/* Scanning Line Effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-neon-blue/20 shadow-[0_0_15px_#00f2ff] z-50 animate-scan" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-grid-slate-900/[0.04] bg-position-[bottom_1px_center] mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* Header Hero */}
        <header className="text-center mb-16 max-w-4xl pt-10">
           <motion.div
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 mb-6"
           >
              <Terminal size={14} className="text-neon-blue" />
              <span className="text-[10px] tracking-[0.2em] text-neon-blue uppercase font-bold">Protocol v4.2.1 // Operational</span>
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="text-5xl md:text-7xl font-black mb-4 tracking-tighter"
           >
              TECHNICAL <span className="text-neon-blue drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">QUIZ</span> ENGINE
           </motion.h1>
           
           <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-slate-400 text-lg tracking-tight max-w-2xl mx-auto"
           >
              Modern technical battlefield for competitive engineers.
              Deploy your knowledge across the digital grid.
           </motion.p>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-20">
          
          {/* Initialize Room Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-linear-to-r from-neon-blue to-neon-purple rounded-3xl opacity-20 blur-sm group-hover:opacity-40 transition" />
            <div className="relative h-full bg-black/40 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-8 border border-neon-blue/20 text-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.1)]">
                  <Server size={28} />
               </div>
               
               <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Initialize Room</h3>
               <p className="text-slate-500 mb-10 text-sm leading-relaxed">Create a multiplayer quiz arena. Manage rounds, view telemetry, and orchestrate the session.</p>

               <AnimatePresence mode="wait">
                 {!showAdminLogin ? (
                   <motion.button
                     key="host-btn"
                     onClick={() => setShowAdminLogin(true)}
                     className="mt-auto w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-neon-blue text-black hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all flex items-center justify-center gap-2"
                   >
                     Launch Room
                     <ChevronRight size={18} />
                   </motion.button>
                 ) : (
                   <motion.form
                     key="admin-form"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     onSubmit={handleAdminLogin}
                     className="space-y-4"
                   >
                     <input
                       type="password"
                       value={adminPassword}
                       onChange={(e) => setAdminPassword(e.target.value)}
                       placeholder="SYSTEM ACCESS CODE"
                       className="w-full bg-black/60 border border-white/10 py-4 px-4 rounded-xl outline-none focus:border-neon-blue transition-all font-mono text-sm tracking-widest placeholder:text-slate-700"
                       required
                       autoFocus
                     />
                     <div className="flex gap-2">
                        <button type="submit" disabled={isLoading} className="flex-1 bg-neon-blue text-black py-4 rounded-xl font-black tracking-widest text-xs uppercase hover:bg-white transition-colors">
                           {isLoading ? 'SYNCING...' : 'AUTHORIZE'}
                        </button>
                        <button type="button" onClick={() => setShowAdminLogin(false)} className="px-4 border border-white/5 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                           ESC
                        </button>
                     </div>
                   </motion.form>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>

          {/* Join Session Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-linear-to-r from-neon-purple to-pink-500 rounded-3xl opacity-20 blur-sm group-hover:opacity-40 transition" />
            <div className="relative h-full bg-black/40 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-8 border border-neon-purple/20 text-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.1)]">
                  <Radio size={28} />
               </div>
               
               <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Engage Session</h3>
               <p className="text-slate-500 mb-10 text-sm leading-relaxed">Join a live technical challenge. Verify your sector identity and engage in the grid combat.</p>

               <button
                 onClick={() => navigate('/join')}
                 className="mt-auto w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-neon-purple text-white hover:shadow-[0_0_25px_rgba(188,19,254,0.4)] transition-all flex items-center justify-center gap-2"
               >
                 Join Now
                 <ArrowRight size={18} />
               </button>
            </div>
          </motion.div>
        </div>

        {/* System Status Indicators */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-12">
            <div className="flex flex-wrap items-center justify-center gap-10">
               <StatusIndicator label="Realtime Synced" active color="blue" />
               <StatusIndicator label="Database Ready" active color="green" />
               <StatusIndicator label="Server Stable" active color="blue" />
            </div>
            <div className="text-[10px] tracking-[0.4em] text-slate-700 uppercase font-black">
               © 2026 technical//engine//root
            </div>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ label, active, color }) => (
  <div className="flex items-center gap-3">
     <div className={`relative w-2.5 h-2.5 rounded-full ${active ? (color === 'green' ? 'bg-cyber-green' : 'bg-neon-blue') : 'bg-slate-800'}`}>
        {active && (
          <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${color === 'green' ? 'bg-cyber-green' : 'bg-neon-blue'}`} />
        )}
     </div>
     <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-slate-200' : 'text-slate-600'}`}>
        {label} {active ? '✓' : ''}
     </span>
  </div>
);

export default Home;
