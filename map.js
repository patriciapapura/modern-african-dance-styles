document.addEventListener('DOMContentLoaded', () => {
    const countryInfo = document.querySelector('.country-info');
    const paths = document.querySelectorAll('path');
    
    
    countryInfo.textContent = '';
    countryInfo.style.display = 'none';
    
    // Function to handle country hover
    function handleCountryHover(event) {
        const countryName = event.target.getAttribute('data-name');
        if (countryName) {
            countryInfo.textContent = countryName;
            countryInfo.style.display = 'block';
            // Position the div near the mouse
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            countryInfo.style.position = 'fixed';
            countryInfo.style.left = (mouseX + 15) + 'px';
            countryInfo.style.top = (mouseY + 15) + 'px';
            
            // Update URL with country code
            const countryCode = event.target.getAttribute('data-id');
            if (countryCode) {
                window.history.pushState({}, '', `#${countryCode}`);
            }
        }
    }

    // Function to handle mouse leave
    function handleCountryLeave() {
        countryInfo.textContent = '';
        countryInfo.style.display = 'none';
    }

    // Add event listeners to all country paths
    paths.forEach(path => {
        path.addEventListener('mouseenter', handleCountryHover);
        path.addEventListener('mouseleave', handleCountryLeave);
        // Also update position as the mouse moves over the country
        path.addEventListener('mousemove', (event) => {
            if (countryInfo.style.display === 'block') {
                countryInfo.style.left = (event.clientX + 15) + 'px';
                countryInfo.style.top = (event.clientY + 15) + 'px';
            }
        });
    });

    // Load country data from map.json
    let countryData = {};
    fetch('map.json')
      .then(response => response.json())
      .then(data => { countryData = data; });

    const modal = document.getElementById('country-modal');
    const modalBody = document.getElementById('country-modal-body');
    const modalClose = document.querySelector('.country-modal-close');

    function showCountryModal(countryCode) {
      const info = countryData[countryCode];
      if (!info) return;
      
      try {
        // Flag and title
        document.getElementById('modal-flag').src = info.flag;
        document.getElementById('modal-flag').alt = `${info.name} Flag`;
        document.getElementById('modal-title').textContent = info.name;
        
        // Quick facts
        const quickFactsList = document.querySelector('.modal-quick-facts ul');
        quickFactsList.innerHTML = '';
        // Capital
        if (info.capital) quickFactsList.innerHTML += `<li><strong>Capital:</strong> ${info.capital}</li>`;
        // Population
        if (info.population) quickFactsList.innerHTML += `<li><strong>Population:</strong> ${info.population}</li>`;
        // Languages
        if (info.languages) quickFactsList.innerHTML += `<li><strong>Languages:</strong> ${info.languages.join(', ')}</li>`;
        // Tribes
        if (info.tribes) quickFactsList.innerHTML += `<li><strong>Major Tribes:</strong> ${info.tribes.join(', ')}</li>`;
        // Cultural Highlight
        if (info.highlight) quickFactsList.innerHTML += `<li><strong>Cultural Highlight:</strong> ${info.highlight}</li>`;
        
        // Dance styles
        const stylesContainer = document.querySelector('.modal-dance-styles');
        stylesContainer.innerHTML = '<div class="dance-title">💃 Dance Styles:</div>';
        
        if (info.dance_styles_details) {
          info.dance_styles_details.forEach(style => {
            const styleDiv = document.createElement('div');
            styleDiv.className = 'dance-style-block';
            
            let videoHtml = '';
            if (style.youtube && style.youtube.trim() !== '') {
              videoHtml = `<div class="dance-style-video">
                <iframe width="100%" height="180" src="https://www.youtube.com/embed/${style.youtube}" frameborder="0" allowfullscreen></iframe>
              </div>`;
            }
            
            styleDiv.innerHTML = `
              <div class="dance-style-name">▶️ ${style.name}</div>
              ${style.description ? `<div class="dance-style-desc">${style.description}</div>` : ''}
              ${videoHtml}
            `;
            stylesContainer.appendChild(styleDiv);
          });
        } else if (info.dance_styles) {
          // fallback for old data
          info.dance_styles.forEach(name => {
            const styleDiv = document.createElement('div');
            styleDiv.className = 'dance-style-block';
            styleDiv.innerHTML = `<div class="dance-style-name">▶️ ${name}</div>`;
            stylesContainer.appendChild(styleDiv);
          });
        }
        
        // Learn more link
        const learnMore = document.getElementById('modal-learn-more');
        if (info.learn_more) {
          learnMore.href = info.learn_more;
          learnMore.style.display = '';
        } else {
          learnMore.style.display = 'none';
        }
        
        // Show modal
        modal.style.display = 'flex';
      } catch (error) {
        console.error('Error showing modal:', error);
        // Fallback: show basic modal even if there's an error
        modal.style.display = 'flex';
      }
    }

    // Keep X icon close
    if (modalClose) {
      modalClose.onclick = function() { modal.style.display = 'none'; };
    }
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    // Add click event to all country paths
    paths.forEach(path => {
      path.addEventListener('click', (event) => {
        const countryCode = event.target.getAttribute('data-id');
        if (countryCode) {
          showCountryModal(countryCode);
        }
      });
    });

    // Handle initial route
    function handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const countryPath = document.querySelector(`path[data-id="${hash}"]`);
            if (countryPath) {
                const countryName = countryPath.getAttribute('data-name');
                countryInfo.textContent = countryName;
                countryInfo.style.display = 'block';
            }
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleInitialRoute);

    // Handle initial route on page load
    handleInitialRoute();
}); 