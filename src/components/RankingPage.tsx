import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../lib/storage';
import { calculateAllAverages } from '../lib/math';

// Legacy Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1CoMUIieKjENe1jE-5It-pIEi7qiU2Mv6ian-3yDNs6uz383wlQYmCdDNXXHAgLjpGw/exec';

const RankingPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userLevel, setUserLevel] = useState<string>('');
    const [currentUserEncoded, setCurrentUserEncoded] = useState<string>('');
    const [category, setCategory] = useState<string>('GlobalAverage');
    const [syncStatus, setSyncStatus] = useState<string>('Initialisation...');

    // Load data and sync
    useEffect(() => {
        const syncData = async () => {
            try {
                const storedData = await storage.loadData();
                if (!storedData || !storedData.valid || !storedData.nom || !storedData.settings?.niveau) {
                    setError("Données manquantes. Veuillez importer votre bulletin et configurer le niveau.");
                    setLoading(false);
                    return;
                }

                setUserLevel(storedData.settings.niveau);
                const encodedName = btoa(unescape(encodeURIComponent(storedData.nom)));
                setCurrentUserEncoded(encodedName);

                // Calculate averages
                setSyncStatus("Calcul des moyennes...");
                const averages = calculateAllAverages(storedData);

                // Prepare FormData for POST
                const formData = new FormData();
                formData.append('encodedName', encodedName);
                formData.append('secondaryLevel', storedData.settings.niveau);
                formData.append('Timestamp', new Date().toISOString());

                // Append Term Averages
                Object.entries(averages).forEach(([key, val]: [string, any]) => {
                    // math.ts returns { etape1: { overall: number, ... }, global: { overall: number... } }
                    // Legacy expects 'Etape1Average', 'GlobalAverage' keys directly if possible, or we follow legacy logic.
                    // Legacy calculateAveragesFromRawData returns flat object { term: { GlobalAverage, Etape1Average... } }
                    // Our calculateAllAverages structure is nesting. Let's flatten/adapt.

                    if (key === 'global' && val.overall !== null) formData.append('GlobalAverage', val.overall.toFixed(2));
                    if (key === 'etape1' && val.overall !== null) formData.append('Etape1Average', val.overall.toFixed(2));
                    if (key === 'etape2' && val.overall !== null) formData.append('Etape2Average', val.overall.toFixed(2));
                    if (key === 'etape3' && val.overall !== null) formData.append('Etape3Average', val.overall.toFixed(2));

                    // Subjects
                    if (val.subjects) {
                        Object.entries(val.subjects).forEach(([subCode, subAvg]) => {
                            if (typeof subAvg === 'number') formData.append(subCode, subAvg.toFixed(2));
                        });
                    }
                });

                setSyncStatus("Envoi des données encryptées...");
                const postResponse = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
                if (!postResponse.ok) throw new Error(`Erreur réseau (POST): ${postResponse.status}`);
                const postResult = await postResponse.json();
                if (postResult.result !== 'success') throw new Error(`Erreur serveur: ${postResult.error}`);

                setSyncStatus("Récupération du classement...");
                const getResponse = await fetch(SCRIPT_URL);
                if (!getResponse.ok) throw new Error(`Erreur réseau (GET): ${getResponse.status}`);
                const allData = await getResponse.json();

                if (Array.isArray(allData)) {
                    setLeaderboard(allData);
                } else {
                    throw new Error("Format de données invalide reçu du serveur.");
                }

                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Une erreur inconnue est survenue.");
                setLoading(false);
            }
        };

        syncData();
    }, []);

    const filteredLeaderboard = useMemo(() => {
        // Filter by level and sort by selected category
        return leaderboard
            .filter(user => user.secondaryLevel === userLevel)
            .filter(user => user[category] && !isNaN(parseFloat(user[category])))
            .sort((a, b) => parseFloat(b[category]) - parseFloat(a[category]));
    }, [leaderboard, userLevel, category]);

    const userRank = useMemo(() => {
        const index = filteredLeaderboard.findIndex(u => u.encodedName === currentUserEncoded);
        return index !== -1 ? index + 1 : null;
    }, [filteredLeaderboard, currentUserEncoded]);

    const getTrophy = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="ranking-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <header className="site-header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <Link to="/dashboard" className="icon-btn"><i className="fa-solid fa-arrow-left"></i></Link>
                <h1 className="site-header" style={{ margin: 0, fontSize: '2em' }}>Classement</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="spinner" style={{ marginBottom: '15px' }}><i className="fa-solid fa-circle-notch fa-spin fa-2x"></i></div>
                    <p>{syncStatus}</p>
                </div>
            ) : error ? (
                <div className="error-message" style={{ color: 'var(--danger-color)', textAlign: 'center', padding: '20px', border: '1px solid var(--danger-color)', borderRadius: '8px' }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> {error}
                    <br />
                    <button onClick={() => window.location.reload()} className="btn btn-secondary" style={{ marginTop: '15px' }}>Réessayer</button>
                </div>
            ) : (
                <div className="ranking-content">
                    <div className="controls" style={{ marginBottom: '20px', background: 'var(--widget-background)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Comparer les classements pour :</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1em' }}
                        >
                            <optgroup label="Moyennes Générales">
                                <option value="GlobalAverage">Moyenne Globale</option>
                                <option value="Etape1Average">Étape 1</option>
                                <option value="Etape2Average">Étape 2</option>
                                <option value="Etape3Average">Étape 3</option>
                            </optgroup>
                            {/* Ideally filter subjects present in data, simplified list for now */}
                            <optgroup label="Matières">
                                <option value="MAT">Mathématiques</option>
                                <option value="FRA">Français</option>
                                <option value="ANG">Anglais</option>
                                <option value="SCI">Sciences</option>
                                <option value="HIS">Histoire</option>
                                <option value="ART">Arts</option>
                                <option value="EDP">Éducation Physique</option>
                            </optgroup>
                        </select>
                    </div>

                    <div className="stat-widget" style={{ background: 'var(--widget-background)', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                        <div className="widget-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>{category}</h3>
                            {userRank ? (
                                <div style={{ marginTop: '10px' }}>
                                    <span style={{ fontSize: '3em', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        {parseFloat(filteredLeaderboard.find(u => u.encodedName === currentUserEncoded)[category]).toFixed(1)}%
                                    </span>
                                    <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                        Rang: {userRank} sur {filteredLeaderboard.length}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: '#aaa', padding: '10px' }}>Non classé dans cette catégorie</div>
                            )}
                        </div>

                        <div className="mini-leaderboard-container" style={{ borderTop: '1px solid var(--light-grey)', paddingTop: '15px', maxHeight: '400px', overflowY: 'auto' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {filteredLeaderboard.map((user, idx) => {
                                    const isUser = user.encodedName === currentUserEncoded;
                                    const rank = idx + 1;
                                    return (
                                        <li key={user.encodedName + idx} style={{
                                            display: 'flex', alignItems: 'center', padding: '10px',
                                            borderRadius: '8px', marginBottom: '5px',
                                            backgroundColor: isUser ? (localStorage.getItem('mbs-theme') === 'dark' ? '#2c3e50' : '#eaf2f8') : 'transparent',
                                            fontWeight: isUser ? 'bold' : 'normal'
                                        }}>
                                            <span style={{ width: '40px', fontWeight: 'bold', fontSize: '1.2em' }}>{getTrophy(rank)}</span>
                                            <span style={{ flexGrow: 1 }}>{isUser ? 'Vous' : `Anonyme #${rank}`}</span>
                                            <span style={{ fontWeight: 'bold' }}>{parseFloat(user[category]).toFixed(1)}%</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RankingPage;
