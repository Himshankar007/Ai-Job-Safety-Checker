import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobDetection from './pages/JobDetection';
import ResumeATS from './pages/ResumeATS';
import CompanyAnalysis from './pages/CompanyAnalysis';
import SkillGap from './pages/SkillGap';
import InterviewAI from './pages/InterviewAI';

// Placeholder components for other routes
const Placeholder = ({ name }) => (
  <div className="pt-32 px-10 min-h-screen text-white">
    <h1 className="text-4xl font-bold underline decoration-primary">{name}</h1>
    <p className="mt-4 text-gray-400">Coming soon... development in progress!</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<JobDetection />} />
          <Route path="/ats" element={<ResumeATS />} />
          <Route path="/company" element={<CompanyAnalysis />} />
          <Route path="/skills" element={<SkillGap />} />
          <Route path="/interview" element={<InterviewAI />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
