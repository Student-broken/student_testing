import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { MBSData } from '../lib/types';

const WelcomePage: React.FC = () => {
    const [data, setData] = useState<MBSData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const d = await storage.loadData();
            if (d && d.valid && d.nom) {
                setData(d);
            } else {
                setData(null);
            }
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return null; // Or a ghost loader

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background managed by global CSS or Layout, but for now we rely on index.css or App container */}
            <div className="welcome-widget">
                {!data ? (
                    <div id="signup-flow">
                        <h1>Outil MBS</h1>
                        <Link to="/import" className="btn btn-primary">
                            <span>🚀</span>
                            <span>Commencer</span>
                        </Link>
                    </div>
                ) : (
                    <div id="login-flow">
                        <p className="welcome-back">Bon retour,</p>
                        <h2 className="user-name">{data.nom}</h2>

                        <Link to="/dashboard" className="btn btn-primary">
                            <span>📊</span>
                            <span>Accéder au tableau de bord</span>
                        </Link>
                        <Link to="/import" className="btn btn-secondary">
                            <span>🔄</span>
                            <span>Mettre à jour les données</span>
                        </Link>
                        <Link to="/improve" className="btn btn-performance">
                            <span>📈</span>
                            <span>Analyser ma performance</span>
                        </Link>
                        <Link to="/projection" className="btn btn-secondary" style={{ marginTop: '15px' }}>
                            <span>🔮</span>
                            <span>Projection</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomePage;
