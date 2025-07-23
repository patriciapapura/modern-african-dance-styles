document.addEventListener('DOMContentLoaded', () => {
    const countryInfo = document.querySelector('.country-info');
    const paths = document.querySelectorAll('path');
    
    // Function to handle country hover
    function handleCountryHover(event) {
        const countryName = event.target.getAttribute('data-name');
        if (countryName) {
            countryInfo.textContent = countryName;
            countryInfo.style.display = 'block';
            
            // Update URL with country code
            const countryCode = event.target.getAttribute('data-id');
            if (countryCode) {
                window.history.pushState({}, '', `#${countryCode}`);
            }
        }
    }

    // Function to handle mouse leave
    function handleCountryLeave() {
        countryInfo.style.display = 'none';
    }

    // Add event listeners to all country paths
    paths.forEach(path => {
        path.addEventListener('mouseenter', handleCountryHover);
        path.addEventListener('mouseleave', handleCountryLeave);
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