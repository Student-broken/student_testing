import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsePortalData } from '../lib/parser';
import { storage } from '../lib/storage';
import { getNumericGrade } from '../lib/math';

const ImportPage: React.FC = () => {
    const [rawText, setRawText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const processData = async (textToProcess: string) => {
        if (!textToProcess.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const parsed = parsePortalData(textToProcess);
            if (!parsed.nom || !parsed.etapeKey) {
                setError("Erreur d'analyse : Le nom ou le numéro d'étape n'a pas été trouvé. Assurez-vous d'avoir bien copié toute la page du portail.");
                setLoading(false);
                return;
            }

            // Load existing data
            const existingData = (await storage.loadData()) || {};

            // Initialize user_random
            if (!existingData.user_random) {
                existingData.user_random = 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
            }

            // --- History Tracking Logic ---
            let currentTermAverage = 0;
            let totalWeight = 0;

            parsed.etapeData.forEach(subject => {
                subject.competencies.forEach(comp => {
                    const compWeightMatch = comp.name.match(/\((\d+)%\)/);
                    if (compWeightMatch) {
                        const compWeight = parseFloat(compWeightMatch[1]);
                        let competencyGrade = 0;
                        let competencyTotalWeight = 0;

                        comp.assignments.forEach(assign => {
                            const grade = getNumericGrade(assign.result);
                            const weight = parseFloat(assign.pond);

                            if (grade !== null && !isNaN(weight) && weight > 0) {
                                competencyGrade += grade * weight;
                                competencyTotalWeight += weight;
                            }
                        });

                        if (competencyTotalWeight > 0) {
                            currentTermAverage += (competencyGrade / competencyTotalWeight) * compWeight;
                            totalWeight += compWeight;
                        }
                    }
                });
            });

            const finalTermAvg = totalWeight > 0 ? currentTermAverage / totalWeight : null;

            // Updated Data Object
            const updatedData = {
                ...existingData,
                valid: true,
                nom: parsed.nom,
                [parsed.etapeKey]: parsed.etapeData
            };

            // Append to history
            if (finalTermAvg !== null) {
                if (!updatedData.historique) updatedData.historique = {};
                if (!updatedData.historique[parsed.etapeKey]) {
                    updatedData.historique[parsed.etapeKey] = { timestamps: [], moyennes: [] };
                }
                // Push new data point
                updatedData.historique[parsed.etapeKey]!.timestamps.push(Date.now());
                updatedData.historique[parsed.etapeKey]!.moyennes.push(finalTermAvg);
            }

            await storage.saveData(updatedData);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const text = e.clipboardData.getData('text');
        setRawText(text); // Update UI

        // Auto-submit after short delay
        setTimeout(() => {
            processData(text);
        }, 100);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>Importer vos données</h2>
            <p>Copiez (CTRL+A, CTRL+C) le contenu de votre portail et collez-le dans la zone ci-dessous.</p>

            {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '5px' }}>{error}</div>}

            <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                onPaste={handlePaste}
                placeholder="Collez ici (CTRL+V)..."
                style={{
                    width: '100%',
                    height: '300px',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '2px dashed var(--border-color)',
                    backgroundColor: 'var(--input-bg-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}
            />

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => processData(rawText)}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Analyser
                </button>
                <button onClick={() => navigate('/')} className="btn btn-secondary">Annuler</button>
            </div>
        </div>
    );
};

export default ImportPage;
