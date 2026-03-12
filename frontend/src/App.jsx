import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import Join from './pages/Join';
import WaitingRoom from './pages/WaitingRoom';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';
import Result from './pages/Result';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-bg-dark text-white selection:bg-neon-blue selection:text-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/waiting/:roomCode" element={<WaitingRoom />} />
          <Route path="/quiz/:roomCode" element={<Quiz />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
