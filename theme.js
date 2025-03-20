// Improved theme management to prevent glitching
let isThemeTransitioning = false; // Flag to prevent multiple theme switches

document.addEventListener('DOMContentLoaded', function() {
    // Get theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    
    // Check if theme exists in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load (without animation initially)
    document.body.classList.add('no-transition');
    applyTheme(savedTheme);
    
    // Force a reflow before removing the class
    window.getComputedStyle(document.body).transition;
    document.body.classList.remove('no-transition');
    
    // Add event listener to theme toggle button with debounce
    if (themeToggle) {
        themeToggle.addEventListener('click', debounce(function() {
            if (isThemeTransitioning) return; // Prevent multiple rapid clicks
            
            isThemeTransitioning = true;
            
            // Toggle between light and dark themes
            const currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            
            // Save theme preference to localStorage
            localStorage.setItem('theme', currentTheme);
            
            // Apply the new theme
            applyTheme(currentTheme);
            
            // Reset the flag after transition completes
            setTimeout(() => {
                isThemeTransitioning = false;
            }, 500); // Match this with your CSS transition time
        }, 250));
    }
});

// Simple debounce function to prevent multiple rapid calls
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Function to apply theme to the document
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        // Update toggle button text if it exists
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = 'Light Mode';
        }
    } else {
        document.body.classList.remove('dark-theme');
        // Update toggle button text if it exists
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = 'Dark Mode';
        }
    }
}