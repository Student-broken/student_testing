import React, { useState } from 'react';
import type { Settings } from '../lib/types';

interface SettingsPanelProps {
    settings: Settings | undefined;
    onUpdate: (newSettings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ ...settings, niveau: e.target.value as any });
    };

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ ...settings, unitesMode: e.target.value as any });
    };

    return (
        <div className="settings-widget">
            <button className="btn btn-secondary" onClick={() => setIsOpen(!isOpen)}>
                <i className="fa-solid fa-cog"></i> Paramètres
            </button>

            {isOpen && (
                <div className="settings-content" style={{ marginTop: '10px', padding: '10px', background: 'var(--card-bg)', borderRadius: '8px' }}>
                    <div className="form-group">
                        <label>Niveau:</label>
                        <select value={settings?.niveau || ''} onChange={handleNiveauChange}>
                            <option value="">Sélectionner...</option>
                            <option value="sec4">Secondaire 4</option>
                            <option value="sec5">Secondaire 5</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Mode Unités:</label>
                        <select value={settings?.unitesMode || 'defaut'} onChange={handleModeChange}>
                            <option value="defaut">Défaut (MELS)</option>
                            <option value="sans">Sans unités (Moyenne simple)</option>
                            <option value="perso">Personnalisé</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPanel;
