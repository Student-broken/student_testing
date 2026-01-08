import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ImportPage from './components/ImportPage';
import WelcomePage from './components/WelcomePage';
import { ThemeProvider } from './context/ThemeContext';

// Placeholder components for routes we are about to build
const ImprovePage = () => <div className="content"><h1 style={{ color: 'var(--text-color)' }}>Analyse (Bientôt disponible)</h1></div>;
const ProjectionPage = () => <div className="content"><h1 style={{ color: 'var(--text-color)' }}>Projection (Bientôt disponible)</h1></div>;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="background-container"></div>
      <div className="background-overlay"></div>

      {/* Theme Toggle is global */}
      {/* We can move it to a Layout component, but for now it's in ThemeProvider's responsibility or simple absolute div */}

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/improve" element={<ImprovePage />} />
        <Route path="/projection" element={<ProjectionPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
