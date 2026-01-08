import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzpiASb3xyq5Hf3b2-i8MvjYm-p0QW4-JwdyBU0IUFhFn8KlgKtAPCMFriYz0JnFOsf/exec';

const TicketPage: React.FC = () => {
    const [ticketId, setTicketId] = useState('');
    const [isWidgetCollapsed, setIsWidgetCollapsed] = useState(true);
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formMessage, setFormMessage] = useState('');
    const [statusResult, setStatusResult] = useState<{ message: string; color: string } | null>(null);

    useEffect(() => {
        const lastId = localStorage.getItem('lastTicketId');
        if (lastId) {
            setTicketId(lastId);
            setIsWidgetCollapsed(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('loading');
        setFormMessage('Submitting your request...');

        const formData = new FormData(e.currentTarget);
        const searchParams = new URLSearchParams(formData as any);

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: searchParams
            });
            const data = await response.json();

            if (data.status === 'success') {
                setFormStatus('success');
                setFormMessage(`✅ Succès! Votre ticket ID est: ${data.ticketId}`);
                localStorage.setItem('lastTicketId', data.ticketId);
                setTicketId(data.ticketId);
                setIsWidgetCollapsed(false);
                (e.target as HTMLFormElement).reset();
            } else {
                throw new Error(data.message || 'Error occurred');
            }
        } catch (error: any) {
            console.error(error);
            setFormStatus('error');
            setFormMessage('❌ An error occurred during submission.');
        }
    };

    const checkStatus = async () => {
        if (!ticketId.trim()) {
            setStatusResult({ message: '⚠️ Veuillez entrer un ticket ID.', color: '#FFB74D' });
            return;
        }

        setStatusResult({ message: 'Votre demande est en cours de traitement...', color: '#B0BEC5' });

        try {
            const response = await fetch(`${WEB_APP_URL}?ticketId=${encodeURIComponent(ticketId)}`);
            const data = await response.json();

            if (data.status === 'success') {
                let color = '#fff';
                let emoji = '';
                switch (data.statusCode) {
                    case 'D': color = '#81C784'; emoji = '✅'; localStorage.removeItem('lastTicketId'); break;
                    case 'P': color = '#FFB74D'; emoji = '⚙️'; break;
                    case 'W': color = '#64B5F6'; emoji = '⏳'; break;
                    default: color = '#BDBDBD'; emoji = '❓';
                }
                setStatusResult({ message: `${emoji} Status for ${ticketId}: ${data.statusText}`, color });
            } else {
                setStatusResult({ message: `❌ Error: ${data.message}`, color: '#E57373' });
            }
        } catch (error) {
            setStatusResult({ message: '❌ Network error.', color: '#E57373' });
        }
    };

    return (
        <div className="ticket-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <header className="site-header-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <Link to="/dashboard" className="icon-btn"><i className="fa-solid fa-arrow-left"></i></Link>
                <h1 className="site-header" style={{ flexGrow: 1, textAlign: 'center' }}>Signaler un Problème</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <main className="content" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div className="form-widget" style={{ flex: 2, minWidth: '300px', background: 'var(--widget-background)', padding: '30px', borderRadius: '16px', boxShadow: '0 8px 15px rgba(0,0,0,0.08)' }}>
                    <h2>Soumettre une Demande</h2>
                    <form onSubmit={handleSubmit}>
                        <label style={{ display: 'block', margin: '15px 0 5px' }}>Votre nom / nom d'utilisateur *</label>
                        <input type="text" name="Name" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />

                        <label style={{ display: 'block', margin: '15px 0 5px' }}>Contact email (Optionnel)</label>
                        <input type="text" name="Contact" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />

                        <label style={{ display: 'block', margin: '15px 0 5px' }}>Message *</label>
                        <textarea name="Message" rows={5} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>

                        <label style={{ display: 'block', margin: '15px 0 5px' }}>Type de demande *</label>
                        <select name="Category" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <option value="" disabled selected>--Sélectionnez une option--</option>
                            <option value="Request erasure of your data">Signaler un problème</option>
                            <option value="Request copy of your data">Donner une suggestion</option>
                            <option value="Request information about how data is collected">Question sur le stockage de donnés</option>
                            <option value="Other">Autre</option>
                        </select>

                        <button type="submit" disabled={formStatus === 'loading'} className="btn" style={{ marginTop: '20px', width: '100%', padding: '15px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                            {formStatus === 'loading' ? 'Envoi...' : 'Soumettre le ticket'}
                        </button>

                        {formMessage && <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', background: formStatus === 'success' ? '#d4edda' : formStatus === 'error' ? '#f8d7da' : '#d1ecf1', color: formStatus === 'success' ? '#155724' : formStatus === 'error' ? '#721c24' : '#0c5460' }}>{formMessage}</div>}
                    </form>
                </div>

                <div className="status-widget" style={{ flex: 1, minWidth: '300px', background: '#2c3e50', color: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                    <div
                        className="status-header"
                        onClick={() => setIsWidgetCollapsed(!isWidgetCollapsed)}
                        style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #4a627a', fontWeight: 'bold' }}
                    >
                        Statut du ticket <span>{isWidgetCollapsed ? '►' : '▼'}</span>
                    </div>

                    {!isWidgetCollapsed && (
                        <div className="status-content" style={{ padding: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px' }}>Entrer votre Ticket ID</label>
                            <input
                                type="text"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                placeholder="TICKET-..."
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', marginBottom: '15px', color: '#333' }}
                            />
                            <button onClick={checkStatus} style={{ width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Vérifier le Statut</button>

                            {statusResult && <div style={{ marginTop: '15px', color: statusResult.color, fontWeight: 'bold' }}>{statusResult.message}</div>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TicketPage;
