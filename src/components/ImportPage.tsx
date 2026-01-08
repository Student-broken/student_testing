import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsePortalData } from '../lib/parser';
import { storage } from '../lib/storage';

const ImportPage: React.FC = () => {
    const [rawText, setRawText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const processData = async () => {
        setLoading(true);
        setError(null);
        try {
            const parsed = parsePortalData(rawText);
            if (!parsed.nom || !parsed.etapeKey) {
                setError("Erreur d'analyse : Le nom ou le numéro d'étape n'a pas été trouvé. Assurez-vous d'avoir bien copié toute la page du portail.");
                setLoading(false);
                return;
            }

            // Load existing data
            const existingData = (await storage.loadData()) || {};

            // Initialize user_random if missing
            if (!existingData.user_random) {
                existingData.user_random = 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
            }

            // Update data
            const updatedData = {
                ...existingData,
                valid: true,
                nom: parsed.nom,
                [parsed.etapeKey]: parsed.etapeData
            };

            // Just saving for now.
            await storage.saveData(updatedData);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Importer vos données</h2>
            <p>Copiez (CTRL+A, CTRL+C) le contenu de votre portail et collez-le ci-dessous.</p>

            {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}

            <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Collez ici..."
                style={{ width: '100%', height: '300px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)' }}
            />

            <button
                onClick={processData}
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
                disabled={loading}
            >
                {loading ? 'Traitement...' : 'Analyser et Sauvegarder'}
            </button>
        </div>
    );
};

export default ImportPage;
