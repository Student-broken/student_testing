import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { MBSData, Subject } from '../lib/types';
import { storage } from '../lib/storage';
import { calculateAllAverages } from '../lib/math';

interface TermTableProps {
    data: Subject[] | undefined;
}

const TermTable: React.FC<TermTableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="no-data">Aucune donnée pour cette étape.</p>;
    }

    return (
        <div>
            {data.map((subject, idx) => (
                <table key={idx} className="subject-table">
                    <thead>
                        <tr><th colSpan={6}>{subject.code} - {subject.name}</th></tr>
                        <tr><th>Catégorie</th><th>Travail</th><th>Pond.</th><th>Date assignée</th><th>Date due</th><th>Résultat</th></tr>
                    </thead>
                    <tbody>
                        {subject.competencies.map((comp, cIdx) => (
                            <React.Fragment key={cIdx}>
                                <tr className="competency-row"><td colSpan={6}>{comp.name}</td></tr>
                                {comp.assignments.map((assign, aIdx) => (
                                    <tr key={aIdx}>
                                        <td>{assign.category || '-'}</td>
                                        <td dangerouslySetInnerHTML={{ __html: assign.work || '-' }} />
                                        <td>
                                            <input className="pond-input-field" disabled defaultValue={assign.pond} placeholder="--" />
                                        </td>
                                        <td>{assign.assignedDate || '-'}</td>
                                        <td>{assign.dueDate?.replace('à', '') || '-'}</td>
                                        <td>
                                            <span className="grade-percentage">{assign.result}</span>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ))}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [data, setData] = useState<MBSData | null>(null);
    const [activeTab, setActiveTab] = useState<'etape1' | 'etape2' | 'etape3'>('etape1');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        storage.loadData().then(d => {
            setData(d);
            setLoading(false);
        });
    }, []);

    const averages = useMemo(() => {
        if (!data) return null;
        return calculateAllAverages(data);
    }, [data]);

    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Chargement...</div>;

    if (!data || !data.valid) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Aucune donnée disponible.</p>
                <Link to="/import" className="btn btn-primary">Importer vos données</Link>
            </div>
        );
    }

    return (
        <>
            <section className="data-section">
                <div className="tabs">
                    {(['etape1', 'etape2', 'etape3'] as const).map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'etape1' ? 'Étape 1' : tab === 'etape2' ? 'Étape 2' : 'Étape 3'}
                        </button>
                    ))}
                </div>
                <div>
                    <TermTable data={data[activeTab]} />
                </div>
            </section>

            <aside className="side-panel">
                <div className="moyenne-widgets">
                    <div className="moyenne-widget">
                        <h4>Moyenne générale</h4>
                        <div className="moyenne-value">
                            {averages?.globalAverage !== null ? `${averages?.globalAverage?.toFixed(2)}%` : '--'}
                        </div>
                    </div>
                    <div className="moyenne-widget">
                        <h4>Moyenne de l'étape</h4>
                        <div className="moyenne-value">
                            {averages?.termAverages[activeTab] !== null ? `${averages?.termAverages[activeTab]?.toFixed(2)}%` : '--'}
                        </div>
                    </div>
                </div>

                {/* Simplified Side Panel: No settings controls yet for simplicity in v1 refactor */}

                <div className="subject-averages">
                    <h4>Moyennes par matière</h4>
                    <ul id="subject-averages-list">
                        {averages?.subjectAverages[activeTab] && Object.entries(averages.subjectAverages[activeTab]).map(([code, subj]) => (
                            <li key={code}>
                                <span>{subj.name}</span>
                                <strong className="grade-percentage">{subj.average !== null ? `${subj.average?.toFixed(2)}%` : '--'}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Dashboard;
