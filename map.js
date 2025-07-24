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
      modalBody.innerHTML = `
         <img src="${info.flag}" alt="${info.name} Flag" style="width: 32px; height: auto; vertical-align: middle; margin-right: 8px;" />
  ${info.name}
</h2>
        <ul>
          <li><strong>Population:</strong> ${info.population}</li>
          <li><strong>Capital:</strong> ${info.capital}</li>
          <li><strong>Languages:</strong> ${info.languages.join(', ')}</li>
          <li><strong>Tribes:</strong> ${info.tribes.join(', ')}</li>
          <li><strong>Dance Styles:</strong> ${info.dance_styles.join(', ')}</li>
        </ul>
      `;
      modal.style.display = 'flex';
    }

    modalClose.onclick = function() {
      modal.style.display = 'none';
    };
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