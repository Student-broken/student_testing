import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ImportPage from './components/ImportPage';
import WelcomePage from './components/WelcomePage';
import ImprovePage from './components/ImprovePage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import RankingPage from './components/RankingPage';
import ProjectionPage from './components/ProjectionPage';
import TicketPage from './components/TicketPage';
import DocumentationPage from './components/DocumentationPage';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="background-container"></div>
      <div className="background-overlay"></div>

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/improve" element={<ImprovePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/projection" element={<ProjectionPage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
