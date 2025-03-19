// Theming functionality
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    
    if (!themeToggle) return; // Skip if theme toggle doesn't exist on this page
    
    // Theme Toggle function
    themeToggle.addEventListener("click", function () {
        const body = document.body;
        const currentTheme = body.classList.contains("light") ? "light" : "dark";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        body.classList.remove(currentTheme);
        body.classList.add(newTheme);
        
        // Update button text
        themeToggle.textContent = newTheme === "light" ? "Dark Mode" : "Light Mode";
        
        // Save theme preference to localStorage
        localStorage.setItem("theme", newTheme);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === "light" ? "Dark Mode" : "Light Mode";
});