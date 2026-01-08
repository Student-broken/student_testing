import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import ImportPage from './components/ImportPage';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <header className="site-header-container">
        <div className="header-left">
          {/* Placeholder for Back button if needed, or Conditionally render */}
          <Link to="/" className="icon-btn" title="Retour à l'accueil">
            <i className="fa-solid fa-home"></i>
          </Link>
        </div>
        <div className="header-center">
          <h1 className="site-header">Outil MBS</h1>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="icon-btn" aria-label="Changer de thème">
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <Link to="/import" className="btn btn-secondary">Mise à jour</Link>
          <a href="#" className="btn btn-primary">Analyser</a>
        </div>
      </header>
      <main className="main-container">
        {children}
      </main>
      <footer>
        <p>Outil MBS - Moyenne, Bilan, Stratégie</p>
        <p><a href="#">Signaler un problème</a></p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/import" element={<ImportPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
