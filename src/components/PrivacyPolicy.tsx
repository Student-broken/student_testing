import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="info-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            <Link to="/" className="icon-btn" style={{ marginBottom: '20px', display: 'inline-flex' }}><i className="fa-solid fa-arrow-left"></i></Link>
            <h1>Politique de confidentialité</h1>
            <p>Dernière mise à jour : 17 novembre 2025</p>

            <div style={{ background: 'rgba(250, 166, 26, 0.1)', borderLeft: '5px solid #faa61a', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                <p><strong>Notre engagement envers votre vie privée :</strong> Votre confiance est essentielle. Nous nous engageons à protéger vos renseignements personnels conformément à la <em>Loi sur la protection des renseignements personnels dans le secteur privé</em> du Québec, modernisée par la Loi 25.</p>
            </div>

            <h2>1. Responsable de la protection des renseignements personnels</h2>
            <p>Pour toute question ou pour exercer vos droits, vous pouvez contacter le responsable à :</p>
            <p><strong>Courriel :</strong> notabot.chat@gmail.com</p>

            <h2>2. Collecte et Utilisation des Renseignements</h2>
            <p>L'Outil MBS gère deux catégories de données de manière distincte :</p>

            <h3>2.1 Données stockées localement sur votre appareil</h3>
            <p>Ces renseignements sont stockés <strong>uniquement</strong> dans la mémoire de votre navigateur (localStorage). Ils ne nous sont jamais transmis et nous n'y avons pas accès.</p>
            <ul>
                <li><strong>Renseignements personnels et scolaires :</strong> L'intégralité des informations que vous collez (nom, détails des matières, résultats, etc.).</li>
                <li><strong>Vos préférences :</strong> Tous les réglages que vous configurez dans l'Outil.</li>
            </ul>
            <p><strong>Finalité :</strong> Le stockage local est strictement nécessaire au fonctionnement de l'Outil.</p>

            <h3>2.2 Données transmises pour le Classement ("Analyzer")</h3>
            <p>Lorsque vous accédez à la page "Analyzer" (Classement), vous consentez à ce que des données limitées soient transmises et stockées de manière sécurisée sur un serveur Google.</p>
            <p>Les données transmises sont :</p>
            <ul>
                <li><strong>Votre nom chiffré (encrypté) :</strong> Votre nom est transformé en un code illisible sur votre ordinateur avant d'être envoyé. Ce code sert à vous identifier de manière unique dans le classement sans révéler votre identité.</li>
                <li><strong>Vos moyennes agrégées :</strong> Uniquement les moyennes calculées (générale, par étape, etc.).</li>
                <li><strong>Un horodatage ("timestamp").</strong></li>
            </ul>
            <p><strong>Ce qui n'est JAMAIS transmis :</strong> Le détail de vos travaux, vos notes individuelles ou toute autre information personnelle sensible.</p>

            <h2>3. Consentement</h2>
            <p>L'utilisation de l'Outil implique votre acceptation du stockage local. Pour la fonctionnalité "Analyzer", nous demandons votre <strong>consentement explicite et éclairé</strong> via le panneau initial.</p>

            <h2>4. Sécurité, Conservation et Transfert</h2>
            <p><strong>Données locales :</strong> La sécurité de ces données dépend de celle de votre appareil. Elles sont effacées si vous videz le cache de votre navigateur.</p>
            <p><strong>Données du classement :</strong> Stockées sur l'infrastructure sécurisée de Google. Purgées périodiquement.</p>

            <h2>5. Vos Droits</h2>
            <p>Vous avez un droit d'accès, de rectification et de retrait du consentement. Contactez le responsable pour toute demande.</p>

            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ccc' }} />
            <p style={{ textAlign: 'center', fontSize: '0.9em', color: '#666' }}>*MBS : Mon Bulletin Scolaire</p>
        </div>
    );
};

export default PrivacyPolicy;
