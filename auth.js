document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        if (username && password) {
            localStorage.setItem("authenticatedUser", username);
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Please enter both username and password.");
        }
    });

    // Check if user is already logged in
    if (localStorage.getItem("authenticatedUser")) {
        window.location.href = "dashboard.html";
    }
});
