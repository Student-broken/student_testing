import React from 'react';
import { Link } from 'react-router-dom';

const ProjectionPage: React.FC = () => {
    return (
        <div className="projection-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <header className="site-header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <Link to="/dashboard" className="icon-btn"><i className="fa-solid fa-arrow-left"></i></Link>
                <h1 className="site-header" style={{ margin: 0, fontSize: '2em' }}>Projection & IA</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <div className="content-area">
                <div style={{
                    background: 'var(--widget-background)',
                    padding: '30px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <i className="fa-solid fa-robot" style={{ fontSize: '4em', color: 'var(--primary-color)', marginBottom: '20px' }}></i>
                    <h2>Assistant MBS (IA)</h2>
                    <p>L'assistant intelligent pour analyser vos résultats est en cours de migration.</p>
                    <p>Revenez bientôt pour des prédictions personnalisées !</p>

                    <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
                        <h3>Calculateur de Projection</h3>
                        <p>Simulez vos résultats futurs pour voir leur impact sur votre moyenne globale.</p>
                        <button className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Bientôt disponible</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectionPage;
