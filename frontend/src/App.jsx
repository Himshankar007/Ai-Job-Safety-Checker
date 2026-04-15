import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetection from './pages/JobDetection';
import ResumeATS from './pages/ResumeATS';
import CompanyAnalysis from './pages/CompanyAnalysis';
import SkillGap from './pages/SkillGap';
import InterviewAI from './pages/InterviewAI';
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<JobDetection />} />
          <Route path="/ats" element={<ResumeATS />} />
          <Route path="/company" element={<CompanyAnalysis />} />
          <Route path="/skills" element={<SkillGap />} />
          <Route path="/interview" element={<InterviewAI />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
