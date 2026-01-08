import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
    return (
        <div className="info-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            <Link to="/" className="icon-btn" style={{ marginBottom: '20px', display: 'inline-flex' }}><i className="fa-solid fa-arrow-left"></i></Link>
            <h1>Conditions d'utilisation de l'Outil MBS</h1>
            <p>Dernière mise à jour : 17 novembre 2025</p>

            <div style={{ background: 'rgba(250, 166, 26, 0.1)', borderLeft: '5px solid #faa61a', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <p><strong>Avis Important :</strong> En accédant à l'Outil MBS*, vous reconnaissez et acceptez que ces Conditions constituent une entente légale.</p>
            </div>

            <h2>1. Acceptation des Conditions</h2>
            <p>En utilisant l'Outil MBS ("l'Outil"), vous acceptez d'être lié par les présentes Conditions d'utilisation et par notre <Link to="/privacy">Politique de confidentialité</Link>.</p>

            <h2>2. Licence d'Utilisation et Responsabilité</h2>
            <p>L'Outil est fourni pour une utilisation <strong>personnelle et éducative uniquement</strong>.</p>
            <ul>
                <li><strong>Fourniture "Telle Quelle" :</strong> L'Outil est fourni "tel quel" sans aucune garantie d'exactitude.</li>
                <li><strong>Responsabilité de l'utilisateur :</strong> Vous êtes seul responsable des données que vous entrez.</li>
            </ul>

            <h2>3. Fonctionnalité de Classement ("Analyzer")</h2>
            <p>L'Outil propose une fonctionnalité de classement <strong>optionnelle</strong>. En accédant à la page "Analyzer", vous consentez à ce que votre nom (chiffré) et vos moyennes soient envoyés à un serveur sécurisé.</p>

            <h2>4. Propriété Intellectuelle</h2>
            <p>L'Outil MBS (code, algorithmes, design) est la propriété de son créateur.</p>

            <h2>5. Limitation de Responsabilité</h2>
            <p>Le créateur ne peut être tenu responsable de tout dommage découlant de l'utilisation de l'Outil.</p>

            <h2>8. Contact</h2>
            <p>Pour toute question : <strong>notabot.chat@gmail.com</strong>.</p>

            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ccc' }} />
            <p style={{ textAlign: 'center', fontSize: '0.9em', color: '#666' }}>*MBS : Mon Bulletin Scolaire</p>
        </div>
    );
};

export default TermsOfService;
