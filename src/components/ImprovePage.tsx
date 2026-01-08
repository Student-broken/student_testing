import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { MBSData } from '../lib/types';
import { calculateAllAverages } from '../lib/math';
import '../styles/ImprovePage.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Subject Widget Component ---
const SubjectWidget: React.FC<{
    subjectCode: string;
    subjectName: string;
    average: number | null;
    previousAverage: number | null;
    termKey: string;
}> = ({ subjectName, average, previousAverage }) => {

    // Calculate trend
    const trend = useMemo(() => {
        if (average === null || previousAverage === null) return 'neutral';
        const diff = average - previousAverage;
        if (Math.abs(diff) < 0.5) return 'neutral';
        return diff > 0 ? 'up' : 'down';
    }, [average, previousAverage]);

    const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
    const trendClass = `widget-trend ${trend}`;

    // Gauge data (Simplified doughnut)
    const gaugeData = {
        labels: ['Score', 'Remaining'],
        datasets: [{
            data: average ? [average, 100 - average] : [0, 100],
            backgroundColor: [
                (average || 0) >= 60 ? '#27ae60' : '#e74c3c',
                '#e0e6eb'
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '75%',
        }]
    };

    return (
        <div className="subject-widget">
            <div className="widget-top-section">
                <div className="widget-info">
                    <h3 className="widget-title">{subjectName}</h3>
                    <div className="widget-average">
                        {average !== null ? `${average.toFixed(1)}%` : '--'}
                    </div>
                    {previousAverage !== null && (
                        <div className={trendClass}>
                            {trendIcon} vs préc. ({previousAverage.toFixed(1)}%)
                        </div>
                    )}
                </div>
                <div className="gauge-container">
                    <Doughnut
                        data={gaugeData}
                        options={{
                            plugins: { legend: { display: false }, tooltip: { enabled: false } },
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const ImprovePage: React.FC = () => {
    const [data, setData] = useState<MBSData | null>(null);
    const [activeTab, setActiveTab] = useState<'generale' | 'etape1' | 'etape2' | 'etape3'>('generale');
    const [averages, setAverages] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const d = await storage.loadData();
            setData(d);
            if (d && d.valid) {
                const avgs = calculateAllAverages(d);
                setAverages(avgs);
            }
        };
        load();
    }, []);

    const visibleSubjects = useMemo(() => {
        if (!data || !averages) return [];

        const subjects: { code: string, name: string, avg: number | null, prevAvg: number | null }[] = [];

        let currentTermData: any = null;
        let prevTermData: any = null;

        if (activeTab === 'generale') {
            // For Generale, assuming global/all-year data structure or fallback to latest
            currentTermData = averages.global || averages.etape3;
        } else {
            currentTermData = averages[activeTab];
            if (activeTab === 'etape2') prevTermData = averages.etape1;
            else if (activeTab === 'etape3') prevTermData = averages.etape2;
        }

        if (currentTermData && currentTermData.subjects) {
            Object.entries(currentTermData.subjects).forEach(([code, avg]) => {
                let numAvg = typeof avg === 'number' ? avg : null;
                let prevAvg = null;
                if (prevTermData && prevTermData.subjects && prevTermData.subjects[code]) {
                    prevAvg = prevTermData.subjects[code];
                }
                subjects.push({
                    code,
                    name: code,
                    avg: numAvg,
                    prevAvg: prevAvg
                });
            });
        }

        return subjects;
    }, [data, averages, activeTab]);

    if (!data) return <div className="content">Chargement des données... <Link to="/import">Importer</Link></div>;

    const SUBJECT_NAMES: { [key: string]: string } = {
        'ART': 'Arts Plastiques', 'ANG': 'Anglais', 'FRA': 'Français',
        'MAT': 'Mathématiques', 'SCI': 'Science', 'HIS': 'Histoire',
        'ETH': 'Éthique', 'GEO': 'Géographie', 'EDP': 'Éducation Physique',
        'ESP': 'Espagnol', 'MON': 'Monde Contemporain', 'FIN': 'Éducation Financière'
    };

    const getSubjectName = (code: string) => {
        for (const key of Object.keys(SUBJECT_NAMES)) {
            if (code.includes(key)) return SUBJECT_NAMES[key];
        }
        return code;
    };

    return (
        <div className="improve-page">
            <header className="site-header-container">
                <div className="header-left">
                    <Link to="/dashboard" className="icon-btn"><i className="fa-solid fa-arrow-left"></i></Link>
                </div>
                <h1 className="site-header">Analyse</h1>
                <div className="header-right">
                </div>
            </header>

            <div className="sticky-tabs">
                <button
                    className={`tab-btn ${activeTab === 'generale' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generale')}
                >Générale</button>
                <button
                    className={`tab-btn ${activeTab === 'etape1' ? 'active' : ''}`}
                    onClick={() => setActiveTab('etape1')}
                >Étape 1</button>
                <button
                    className={`tab-btn ${activeTab === 'etape2' ? 'active' : ''}`}
                    onClick={() => setActiveTab('etape2')}
                >Étape 2</button>
                <button
                    className={`tab-btn ${activeTab === 'etape3' ? 'active' : ''}`}
                    onClick={() => setActiveTab('etape3')}
                >Étape 3</button>
            </div>

            <main className="widget-grid">
                {visibleSubjects.length > 0 ? (
                    visibleSubjects.map(sub => (
                        <SubjectWidget
                            key={sub.code}
                            subjectCode={sub.code}
                            subjectName={getSubjectName(sub.code)}
                            average={sub.avg}
                            previousAverage={sub.prevAvg}
                            termKey={activeTab}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                        Aucune donnée pour cette étape.
                    </div>
                )}
            </main>
        </div>
    );
};

export default ImprovePage;
