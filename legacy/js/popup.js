    document.addEventListener('DOMContentLoaded', function() {
    /**
     * Checks local storage for the 'mbs_accept' key.
     * @returns {boolean} - True if terms and privacy are accepted, false otherwise.
     */
    const checkLocalStorage = () => {
        const storedData = localStorage.getItem('mbs_accept');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                return parsedData.terms === true && parsedData.privacy === true;
            } catch (e) {
                // If parsing fails, treat it as if no consent was given.
                console.error("Error parsing mbs_accept from localStorage:", e);
                return false;
            }
        }
        return false;
    };

    // If consent is already given, do nothing.
    if (checkLocalStorage()) {
        return;
    }

    /**
     * Creates and displays the consent widget.
     */
    const createWidget = () => {
        // --- Main Widget Container (Overlay) ---
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mbs-widget-container';
        Object.assign(widgetContainer.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark semi-transparent overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '10000',
            fontFamily: 'Arial, sans-serif'
        });

        // --- Widget Content Box ---
        const widgetContent = document.createElement('div');
        Object.assign(widgetContent.style, {
            backgroundColor: '#2c2f33', // Dark grey background
            color: '#ffffff', // White text
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
            maxWidth: '550px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            borderTop: '5px solid #7289da' // Accent color
        });

        // --- Title ---
        const title = document.createElement('h1');
        title.textContent = 'Outil MBS';
        Object.assign(title.style, {
            fontSize: '2.5em',
            margin: '0 0 15px 0',
            color: '#ffffff'
        });

        // --- Warning Message ---
        const warningMessage = document.createElement('p');
        warningMessage.innerHTML = 'OUTIL MBS ne collecte <b>aucune</b> information personnelle sensible. Tous les calculs s’effectuent localement dans votre navigateur.';
        Object.assign(warningMessage.style, {
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            color: '#ff5252', // Bright Red
            fontWeight: 'bold',
            padding: '15px',
            borderRadius: '5px',
            border: '1px solid #ff5252',
            lineHeight: '1.5'
        });
        
        // --- No Data Collection Message ---
        const noDataCollectionMessage = document.createElement('p');
        noDataCollectionMessage.textContent = 'Ce site ne collecte ni mots de passe, ni noms d’utilisateur.';
        Object.assign(noDataCollectionMessage.style, {
            fontSize: '0.9em',
            color: '#b9bbbe', // Lighter grey text
            marginTop: '20px'
        });

        // --- Checkboxes and Links Container ---
        const termsContainer = document.createElement('div');
        Object.assign(termsContainer.style, {
            margin: '30px 0',
            fontSize: '0.9em',
            color: '#b9bbbe'
        });

        const createCheckboxLine = (id, htmlContent) => {
            const line = document.createElement('div');
            Object.assign(line.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
            });

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.style.marginRight = '10px';

            const label = document.createElement('label');
            label.htmlFor = id;
            label.innerHTML = htmlContent;
            
            label.querySelectorAll('a').forEach(link => {
                Object.assign(link.style, { color: '#7289da', textDecoration: 'none' });
                link.onmouseover = () => link.style.textDecoration = 'underline';
                link.onmouseout = () => link.style.textDecoration = 'none';
            });
            
            line.appendChild(checkbox);
            line.appendChild(label);
            return { line, checkbox };
        };

        const { line: termsLine, checkbox: termsCheckbox } = createCheckboxLine('mbs-terms', 'J\'ai lu et j\'accepte les <a href="info/condition.html" target="_blank">termes et conditions</a>');
        const { line: privacyLine, checkbox: privacyCheckbox } = createCheckboxLine('mbs-privacy', 'J\'ai lu et j\'accepte la <a href="info/privacy.html" target="_blank">politique de confidentialité</a>.');
        
        termsContainer.appendChild(termsLine);
        termsContainer.appendChild(privacyLine);

        // --- Accept Button ---
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accepter et continuer';
        acceptButton.disabled = true;
        Object.assign(acceptButton.style, {
            width: '100%',
            padding: '15px',
            fontSize: '1.1em',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#7289da',
            border: 'none',
            borderRadius: '5px',
            cursor: 'not-allowed',
            opacity: '0.5',
            transition: 'background-color 0.3s ease, opacity 0.3s ease'
        });

        // --- Iframe Popup for FAQ ---
        const faqIframeContainer = document.createElement('div');
        Object.assign(faqIframeContainer.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'none', justifyContent: 'center', alignItems: 'center',
            zIndex: '10001'
        });

        const iframeContentWrapper = document.createElement('div');
        Object.assign(iframeContentWrapper.style, {
            position: 'relative',
            width: '80%',
            height: '80%',
            maxWidth: '1000px',
            backgroundColor: '#36393f',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
        });

        const faqIframe = document.createElement('iframe');
        faqIframe.src = 'info/faq.html';
        Object.assign(faqIframe.style, {
            width: '100%', height: '100%', border: 'none'
        });

        // --- **NEW** Red Close Button for FAQ ---
        const closeIframeButton = document.createElement('button');
        closeIframeButton.textContent = 'Fermer';
        Object.assign(closeIframeButton.style, {
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#f04747', // Red color
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out'
        });
        closeIframeButton.onmouseover = () => closeIframeButton.style.backgroundColor = '#d84040';
        closeIframeButton.onmouseout = () => closeIframeButton.style.backgroundColor = '#f04747';
        
        iframeContentWrapper.appendChild(faqIframe);
        iframeContentWrapper.appendChild(closeIframeButton);
        faqIframeContainer.appendChild(iframeContentWrapper);

        // --- **UPDATED** Logic for Checkboxes and Button ---
        let faqHasBeenShown = false;

        const checkAndTriggerFAQ = () => {
            if (termsCheckbox.checked && privacyCheckbox.checked && !faqHasBeenShown) {
                faqIframeContainer.style.display = 'flex';
                faqHasBeenShown = true;
            }
        };

        termsCheckbox.addEventListener('change', checkAndTriggerFAQ);
        privacyCheckbox.addEventListener('change', checkAndTriggerFAQ);
        
        // **UPDATED** Close button now enables the accept button
        closeIframeButton.addEventListener('click', () => {
            faqIframeContainer.style.display = 'none';
            // Enable the accept button only after the FAQ is closed
            acceptButton.disabled = false;
            acceptButton.style.opacity = '1';
            acceptButton.style.cursor = 'pointer';
        });

        acceptButton.addEventListener('mouseover', () => {
            if (!acceptButton.disabled) acceptButton.style.backgroundColor = '#677bc4';
        });
        acceptButton.addEventListener('mouseout', () => {
            if (!acceptButton.disabled) acceptButton.style.backgroundColor = '#7289da';
        });

        acceptButton.addEventListener('click', () => {
            if (acceptButton.disabled) return;
            localStorage.setItem('mbs_accept', JSON.stringify({ terms: true, privacy: true }));
            document.body.removeChild(widgetContainer);
        });
        
        // --- Assemble The Widget ---
        widgetContent.appendChild(title);
        widgetContent.appendChild(warningMessage);
        widgetContent.appendChild(noDataCollectionMessage);
        widgetContent.appendChild(termsContainer);
        widgetContent.appendChild(acceptButton);
        widgetContainer.appendChild(widgetContent);
        widgetContainer.appendChild(faqIframeContainer); // Add iframe container to main widget
        document.body.appendChild(widgetContainer);
    };

    // Create the widget if consent is not found.
    createWidget();
});
