"use strict";
// Modern African Dance Styles Map Application
// Main application class to handle all functionality

class AfricanDanceMap {
    constructor() {
        this.countryData = {};
        this.elements = {
            countryInfo: null,
            modal: null,
            modalClose: null,
            paths: []
        };
        
        this.init();
    }

    async init() {
        try {
            this.setupElements();
            await this.loadCountryData();
            this.setupEventListeners();
            this.handleInitialRoute();
        } catch (error) {
            console.error('Failed to initialize African Dance Map:', error);
        }
    }

    setupElements() {
        // Get DOM elements
        this.elements.countryInfo = document.querySelector('.country-info');
        this.elements.modal = document.getElementById('country-modal');
        this.elements.modalClose = document.querySelector('.country-modal-close');
        this.elements.paths = document.querySelectorAll('path');

        // Validate required elements
        if (!this.elements.countryInfo) {
            throw new Error('Country info element not found');
        }
        if (!this.elements.modal) {
            throw new Error('Modal element not found');
        }

        // Initialize country info display
        this.elements.countryInfo.textContent = '';
        this.elements.countryInfo.style.display = 'none';
    }

    async loadCountryData() {
        try {
            const response = await fetch('map.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.countryData = await response.json();
            console.log(`Country data loaded: ${Object.keys(this.countryData).length} countries`);
        } catch (error) {
            console.error('Error loading country data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Add event listeners to all country paths
        this.elements.paths.forEach(path => {
            path.addEventListener('mouseenter', this.handleCountryHover.bind(this));
            path.addEventListener('mouseleave', this.handleCountryLeave.bind(this));
            path.addEventListener('mousemove', this.handleMouseMove.bind(this));
            path.addEventListener('click', this.handleCountryClick.bind(this));
        });

        // Modal close events
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', this.closeModal.bind(this));
        }

        // Close modal when clicking outside
        window.addEventListener('click', this.handleOutsideClick.bind(this));

        // Handle hash changes
        window.addEventListener('hashchange', this.handleInitialRoute.bind(this));

        // Close with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    handleCountryHover(event) {
        const countryName = event.target.getAttribute('data-name');
        if (!countryName) return;

        this.elements.countryInfo.textContent = countryName;
        this.elements.countryInfo.style.display = 'block';
        this.updateCountryInfoPosition(event.clientX, event.clientY);

        // On hover we only show tooltip; URL changes happen on click
    }

    handleCountryLeave() {
        this.elements.countryInfo.textContent = '';
        this.elements.countryInfo.style.display = 'none';
    }

    handleMouseMove(event) {
        if (this.elements.countryInfo.style.display === 'block') {
            this.updateCountryInfoPosition(event.clientX, event.clientY);
        }
    }

    updateCountryInfoPosition(x, y) {
        this.elements.countryInfo.style.position = 'fixed';
        this.elements.countryInfo.style.left = (x + 15) + 'px';
        this.elements.countryInfo.style.top = (y + 15) + 'px';
    }

    handleCountryClick(event) {
        const countryCode = event.target.getAttribute('data-id');
        if (countryCode) {
            // Update URL and open modal
            window.location.hash = countryCode;
            this.showCountryModal(countryCode);
        }
    }

    showCountryModal(countryCode) {
        const countryInfo = this.countryData[countryCode];
        if (!countryInfo) {
            console.error('No data found for country code:', countryCode);
            return;
        }

        try {
            this.updateModalContent(countryInfo);
            this.elements.modal.style.display = 'flex';
        } catch (error) {
            console.error('Error showing modal:', error);
            // Fallback: show basic modal
            this.elements.modal.style.display = 'flex';
        }
    }

    updateModalContent(countryInfo) {
        // Update flag and title
        const flagImg = document.getElementById('modal-flag');
        const titleElement = document.getElementById('modal-title');
        
        if (flagImg) {
            flagImg.src = countryInfo.flag;
            flagImg.alt = `${countryInfo.name} Flag`;
        }
        
        if (titleElement) {
            titleElement.textContent = countryInfo.name;
        }

        // Update quick facts
        this.updateQuickFacts(countryInfo);

        // Update dance styles
        this.updateDanceStyles(countryInfo);

        // Update learn more link
        this.updateLearnMoreLink(countryInfo);
    }

    updateQuickFacts(countryInfo) {
        const quickFactsList = document.querySelector('.modal-quick-facts ul');
        if (!quickFactsList) return;

        quickFactsList.innerHTML = '';
        
        const facts = [
            { label: 'Capital', value: countryInfo.capital },
            { label: 'Population', value: countryInfo.population },
            { label: 'Languages', value: countryInfo.languages?.join(', ') },
            { label: 'Major Tribes', value: countryInfo.tribes?.join(', ') },
            { label: 'Cultural Highlight', value: countryInfo.highlight }
        ];

        facts.forEach(fact => {
            if (fact.value && fact.value.trim() !== '') {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${fact.label}:</strong> ${fact.value}`;
                quickFactsList.appendChild(li);
            }
        });
    }

    updateDanceStyles(countryInfo) {
        const stylesContainer = document.querySelector('.modal-dance-styles');
        if (!stylesContainer) return;

        stylesContainer.innerHTML = '<div class="dance-title">💃 Dance Styles:</div>';

        if (countryInfo.dance_styles_details && countryInfo.dance_styles_details.length > 0) {
            // Use new detailed format
            countryInfo.dance_styles_details.forEach(style => {
                const styleDiv = this.createDanceStyleElement(style);
                stylesContainer.appendChild(styleDiv);
            });
        } else if (countryInfo.dance_styles && countryInfo.dance_styles.length > 0) {
            // Fallback for old data format - convert to new format
            countryInfo.dance_styles.forEach(name => {
                const styleObj = {
                    name: name,
                    description: `Traditional ${countryInfo.name} dance style`,
                    youtube: null
                };
                const styleDiv = this.createDanceStyleElement(styleObj);
                stylesContainer.appendChild(styleDiv);
            });
        } else {
            // No dance styles available
            const noStylesDiv = document.createElement('div');
            noStylesDiv.className = 'dance-style-block';
            noStylesDiv.innerHTML = '<div class="dance-style-name">No dance styles information available</div>';
            stylesContainer.appendChild(noStylesDiv);
        }
    }

    createDanceStyleElement(style) {
        const styleDiv = document.createElement('div');
        styleDiv.className = 'dance-style-block';
        
        let videoHtml = '';
        let youtubeLink = '';
        
        // Check if style has a YouTube link
        if (style.youtube && style.youtube.trim() !== '') {
            // If it's a full YouTube URL, extract the video ID
            let videoId = style.youtube;
            if (style.youtube.includes('youtube.com/watch?v=')) {
                videoId = style.youtube.split('v=')[1].split('&')[0];
            } else if (style.youtube.includes('youtu.be/')) {
                videoId = style.youtube.split('youtu.be/')[1].split('?')[0];
            }
            
            // Create embedded video
            videoHtml = `
                <div class="dance-style-video">
                    <iframe width="100%" height="180" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" allowfullscreen>
                    </iframe>
                </div>`;
            
            // Create YouTube link button
            youtubeLink = `
                <div class="dance-style-youtube-link">
                    <a href="https://www.youtube.com/watch?v=${videoId}" 
                       target="_blank" 
                       class="youtube-btn">
                        🎥 Watch on YouTube
                    </a>
                </div>`;
        } else if (style.youtube_link && style.youtube_link.trim() !== '') {
            // Alternative field for YouTube links
            let videoId = style.youtube_link;
            if (style.youtube_link.includes('youtube.com/watch?v=')) {
                videoId = style.youtube_link.split('v=')[1].split('&')[0];
            } else if (style.youtube_link.includes('youtu.be/')) {
                videoId = style.youtube_link.split('youtu.be/')[1].split('?')[0];
            }
            
            youtubeLink = `
                <div class="dance-style-youtube-link">
                    <a href="https://www.youtube.com/watch?v=${videoId}" 
                       target="_blank" 
                       class="youtube-btn">
                        🎥 Watch on YouTube
                    </a>
                </div>`;
        }
        
        styleDiv.innerHTML = `
            <div class="dance-style-name">▶️ ${style.name}</div>
            ${style.description ? `<div class="dance-style-desc">${style.description}</div>` : ''}
            ${youtubeLink}
            ${videoHtml}
        `;
        
        // Add click event to make the entire block clickable if there's a YouTube link
        if (youtubeLink) {
            styleDiv.addEventListener('click', (e) => {
                // Don't trigger if clicking on the YouTube link itself
                if (!e.target.closest('.youtube-btn')) {
                    const youtubeBtn = styleDiv.querySelector('.youtube-btn');
                    if (youtubeBtn) {
                        youtubeBtn.click();
                    }
                }
            });
        }
        
        return styleDiv;
    }

    updateLearnMoreLink(countryInfo) {
        const learnMore = document.getElementById('modal-learn-more');
        if (!learnMore) return;

        if (countryInfo.learn_more) {
            learnMore.href = countryInfo.learn_more;
            learnMore.style.display = '';
        } else {
            learnMore.style.display = 'none';
        }
    }

    closeModal() {
        this.elements.modal.style.display = 'none';
    }

    handleOutsideClick(event) {
        if (event.target === this.elements.modal) {
            this.closeModal();
        }
    }

    handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.showCountryModal(hash);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AfricanDanceMap();
});