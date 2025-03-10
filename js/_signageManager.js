class SignageManager {
    constructor() {
        this.content = null;
    }

    async init() {
        try {
            await this.loadContent();
            this.renderContent();
            return Promise.resolve();
        } catch (error) {
            console.error('Error initializing SignageManager:', error);
            return Promise.reject(error);
        }
    }

    async loadContent() {
        try {
            const response = await fetch('content/_signageContent.json');
            this.content = await response.json();
        } catch (error) {
            console.error('Error loading signage content:', error);
            throw error;
        }
    }

    createSvgElement(symbolData) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', symbolData.width);
        svg.setAttribute('height', symbolData.height);
        svg.setAttribute('viewBox', `0 0 ${symbolData.width} ${symbolData.height}`);
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        if (Array.isArray(symbolData.paths)) {
            symbolData.paths.forEach(pathData => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathData);
                path.setAttribute('fill', 'var(--main-primary)');
                svg.appendChild(path);
            });
        } else {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', symbolData.path);
            path.setAttribute('fill', 'var(--main-primary)');
            svg.appendChild(path);
        }

        return svg;
    }

    renderContent() {
        const signageSection = document.getElementById('signage');
        if (!signageSection || !this.content) return;

        // Clear existing content
        signageSection.innerHTML = '';

        // Render left group
        if (this.content.leftGroup) {
            const leftGroup = document.createElement('div');
            leftGroup.className = 'signageComp';
            this.content.leftGroup.entries.forEach(entry => {
                leftGroup.appendChild(this.createEntryElement(entry, false));
            });
            signageSection.appendChild(leftGroup);
        }

        // Render right group
        if (this.content.rightGroup) {
            const rightGroup = document.createElement('div');
            rightGroup.className = 'signageComp signageCompRight';
            this.content.rightGroup.entries.forEach(entry => {
                rightGroup.appendChild(this.createEntryElement(entry, true));
            });
            signageSection.appendChild(rightGroup);
        }
    }

    createEntryElement(entry, isRight) {
        const entryDiv = document.createElement('div');
        entryDiv.className = `signageEntry${isRight ? ' signageEntryRight' : ''}`;

        // Add symbols
        if (entry.symbols) {
            const symbolsDiv = document.createElement('div');
            symbolsDiv.className = 'signageSymbols';

            if (entry.symbols.triangle) {
                const triangleDiv = document.createElement('div');
                triangleDiv.className = 'signageTriangle';
                triangleDiv.appendChild(this.createSvgElement(entry.symbols.triangle));
                symbolsDiv.appendChild(triangleDiv);
            }

            if (entry.symbols.icon) {
                const iconDiv = document.createElement('div');
                iconDiv.className = 'signageIcon';
                iconDiv.appendChild(this.createSvgElement(entry.symbols.icon));
                symbolsDiv.appendChild(iconDiv);
            }

            entryDiv.appendChild(symbolsDiv);
        }

        // Add text
        if (entry.text) {
            const textDiv = document.createElement('div');
            textDiv.className = `signageText${isRight ? ' signageTextRight' : ''}`;

            if (entry.text.title) {
                const titleDiv = document.createElement('div');
                titleDiv.className = 'signageTextTitle';
                
                ['de', 'en', 'fr'].forEach(lang => {
                    if (entry.text.title[lang]) {
                        const p = document.createElement('p');
                        p.className = `signaletik fade content-${lang}${isRight ? ' textRight' : ''}`;
                        p.textContent = entry.text.title[lang];
                        titleDiv.appendChild(p);
                    }
                });

                textDiv.appendChild(titleDiv);
            }

            if (entry.text.place) {
                const placeDiv = document.createElement('div');
                placeDiv.className = 'signageTextPlace';
                const h5 = document.createElement('h5');
                h5.textContent = entry.text.place;
                placeDiv.appendChild(h5);
                textDiv.appendChild(placeDiv);
            }

            entryDiv.appendChild(textDiv);
        }

        return entryDiv;
    }
}