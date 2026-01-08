import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DocumentationPage: React.FC = () => {
    const [activePhase, setActivePhase] = useState<string | null>(null);
    const [activeFunc, setActiveFunc] = useState<string | null>(null);
    const [showDefinitions, setShowDefinitions] = useState(false);

    const togglePhase = (phaseId: string) => {
        setActivePhase(activePhase === phaseId ? null : phaseId);
        setActiveFunc(null); // Close inner functions when switching phases
    };

    const toggleFunc = (funcId: string) => {
        setActiveFunc(activeFunc === funcId ? null : funcId);
    };

    const definitions = [
        { term: 'Data Normalization', def: 'The process of converting all raw grade formats (e.g., "A-", "4/5", "absent") into a single, standardized format.' },
        { term: 'Weighted Average', def: 'An average where each value is multiplied by a "weight" before being summed.' },
        { term: 'Linear Regression', def: 'A statistical method to find the "line of best fit" (y = mx + b) that models the relationship between variables.' },
        { term: 'Slope (m)', def: 'Represents the rate of change. Positive slope means improvement, negative means decline.' },
        { term: 'R-squared (R²)', def: 'Measure of how well the trend line fits the data (0.0 to 1.0).' },
        { term: 'Standard Deviation', def: 'Measure of volatility or inconsistency. Low is stable, high is erratic.' },
        { term: 'Monte Carlo Simulation', def: 'A technique that runs thousands of simulations to predict a range of possible future outcomes.' },
    ];

    const phases = [
        {
            id: '1', title: 'Data Normalization & Aggregation', subtitle: '(The "Truth")', color: 'var(--primary-color)',
            content: (
                <div>
                    <p><strong>Objective:</strong> To clean all raw data into standardized numbers.</p>
                    <div onClick={(e) => { e.stopPropagation(); toggleFunc('1-1'); }} style={{ cursor: 'pointer', background: '#f9fafb', padding: '10px', marginBottom: '5px', border: '1px solid #eee' }}>
                        <code>getNumericGrade(result)</code> {activeFunc === '1-1' ? '-' : '+'}
                    </div>
                    {activeFunc === '1-1' && <div style={{ padding: '10px', background: '#fff', border: '1px solid #eee', marginBottom: '10px' }}>Parses text to float.</div>}
                </div>
            )
        },
        {
            id: '2', title: 'Statistical Profiling', subtitle: '(The "Why")', color: '#059669',
            content: (
                <div>
                    <p><strong>Objective:</strong> To find patterns using Linear Regression.</p>
                    <div onClick={(e) => { e.stopPropagation(); toggleFunc('2-1'); }} style={{ cursor: 'pointer', background: '#f9fafb', padding: '10px', marginBottom: '5px', border: '1px solid #eee' }}>
                        <code>linearRegression(x, y)</code> {activeFunc === '2-1' ? '-' : '+'}
                    </div>
                    {activeFunc === '2-1' && <div style={{ padding: '10px', background: '#fff', border: '1px solid #eee', marginBottom: '10px' }}>Calculates slope, intercept, and R2.</div>}
                </div>
            )
        },
        // ... (Simplified for brevity, but replicates key structure)
        {
            id: '4', title: 'Predictive Forecasting', subtitle: '(The "Future")', color: '#DC2626',
            content: (
                <div>
                    <p><strong>Objective:</strong> Run Monte Carlo simulations for Etape 3 predictions.</p>
                    <p>Runs 100,000 simulations using your statistical fingerprint.</p>
                </div>
            )
        }
    ];

    return (
        <div className="documentation-page" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6' }}>
            <button
                onClick={() => setShowDefinitions(true)}
                style={{ position: 'fixed', top: '20px', right: '20px', padding: '10px 20px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', zIndex: 100 }}
            >
                Show Definitions
            </button>

            {showDefinitions && (
                <>
                    <div onClick={() => setShowDefinitions(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 999 }}></div>
                    <div style={{ position: 'fixed', top: 0, right: 0, width: '400px', maxWidth: '90%', height: '100%', background: 'var(--widget-background)', padding: '20px', overflowY: 'auto', zIndex: 1000, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
                        <button onClick={() => setShowDefinitions(false)} style={{ float: 'right', background: 'none', border: 'none', fontSize: '2em', cursor: 'pointer' }}>&times;</button>
                        <h2>Concepts & Definitions</h2>
                        <dl>
                            {definitions.map((d, i) => (
                                <React.Fragment key={i}>
                                    <dt style={{ fontWeight: 'bold', color: 'var(--primary-color)', marginTop: '15px' }}>{d.term}</dt>
                                    <dd style={{ marginLeft: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{d.def}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </div>
                </>
            )}

            <Link to="/dashboard" className="icon-btn" style={{ marginBottom: '20px', display: 'inline-flex' }}><i className="fa-solid fa-arrow-left"></i></Link>
            <h1 style={{ borderBottom: '3px solid var(--primary-color)', paddingBottom: '10px', textAlign: 'center' }}>Nested Algorithmic Pipeline (MBS-V10)</h1>

            <div className="pipeline-container">
                {phases.map(phase => (
                    <React.Fragment key={phase.id}>
                        <div
                            onClick={() => togglePhase(phase.id)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '20px', background: 'var(--widget-background)',
                                border: '1px solid #ddd', borderLeft: `8px solid ${phase.color}`,
                                borderRadius: '12px', marginBottom: '5px', cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div>
                                <h2 style={{ margin: 0, color: phase.color, display: 'inline-block', marginRight: '10px' }}>PHASE {phase.id}:</h2>
                                <span style={{ fontStyle: 'italic', color: '#666' }}>{phase.title} {phase.subtitle}</span>
                            </div>
                            <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: phase.color }}>{activePhase === phase.id ? '-' : '+'}</span>
                        </div>

                        {activePhase === phase.id && (
                            <div style={{ padding: '20px', background: 'var(--widget-background)', border: '1px solid #ddd', borderTop: 'none', marginBottom: '20px', borderRadius: '0 0 12px 12px' }}>
                                {phase.content}
                            </div>
                        )}
                        <div style={{ textAlign: 'center', fontSize: '2em', color: '#888', margin: '10px 0' }}>&darr;</div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DocumentationPage;
