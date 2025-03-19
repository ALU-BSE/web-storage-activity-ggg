document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");
    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutButton");
    const themeToggle = document.getElementById("themeToggle");
    const shoppingSection = document.getElementById("shoppingSection");
    const cartItemsDiv = document.getElementById("cartItems");
    const userInfoDiv = document.getElementById("userInfo");
    const displayUsername = document.getElementById("displayUsername");
    const lastLogin = document.getElementById("lastLogin");
    const totalItemsSpan = document.getElementById("totalItems");
    const cartTotalSpan = document.getElementById("cartTotal");
    
    // Modal functions
    function showModal(message) {
        const modalMessage = document.getElementById("modalMessage");
        const modal = document.getElementById("modal");
        const modalOverlay = document.getElementById("modalOverlay");
        
        modalMessage.textContent = message;
        modal.style.display = "block";
        modalOverlay.style.display = "block";
    }
    
    function closeModal() {
        document.getElementById("modal").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    }
    
    document.getElementById("closeModalButton").addEventListener("click", closeModal);
    document.getElementById("modalOverlay").addEventListener("click", closeModal);
    
    // Theme Toggle
    themeToggle.addEventListener("click", function () {
        const body = document.body;
        const currentTheme = body.classList.contains("light") ? "light" : "dark";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        body.classList.remove(currentTheme);
        body.classList.add(newTheme);
        
        // Update button text
        themeToggle.textContent = newTheme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme";
        
        // Save theme preference to localStorage
        localStorage.setItem("theme", newTheme);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme";
    
    // Validation functions
    function validateUsername(username) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!username.trim()) {
            return "Username is required";
        } else if (!regex.test(username)) {
            return "Username must be 3-20 characters and can only contain letters, numbers, and underscores";
        }
        return "";
    }
    
    function validatePassword(password) {
        if (!password) {
            return "Password is required";
        } else if (password.length < 8) {
            return "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(password)) {
            return "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(password)) {
            return "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(password)) {
            return "Password must contain at least one number";
        }
        return "";
    }
    
    // Input validation listeners
    usernameInput.addEventListener("input", function() {
        usernameError.textContent = validateUsername(this.value);
    });
    
    passwordInput.addEventListener("input", function() {
        passwordError.textContent = validatePassword(this.value);
    });
    
    // Login Form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Validate on submit
        const usernameValue = usernameInput.value;
        const passwordValue = passwordInput.value;
        
        const usernameErrorMsg = validateUsername(usernameValue);
        const passwordErrorMsg = validatePassword(passwordValue);
        
        usernameError.textContent = usernameErrorMsg;
        passwordError.textContent = passwordErrorMsg;
        
        // If no validation errors, proceed with login
        if (!usernameErrorMsg && !passwordErrorMsg) {
            // Store login info in localStorage
            const now = new Date();
            const userData = {
                username: usernameValue,
                lastLogin: now.toLocaleString()
            };
            
            localStorage.setItem("userData", JSON.stringify(userData));
            
            // Set cookie for user session
            document.cookie = `username=${encodeURIComponent(usernameValue)}; path=/; max-age=86400; samesite=strict`;
            
            // Show success message
            document.getElementById("loginSuccess").style.display = "block";
            showModal(`Login successful. Welcome, ${usernameValue}!`);
            
            // Update UI for logged in state
            loginForm.style.display = "none";
            logoutButton.style.display = "block";
            shoppingSection.style.display = "block";
            userInfoDiv.style.display = "flex";
            displayUsername.textContent = usernameValue;
            lastLogin.textContent = now.toLocaleString();
        }
    });
    
    // Logout Button
    logoutButton.addEventListener("click", function () {
        // Clear localStorage user data
        localStorage.removeItem("userData");
        
        // Clear user session cookie
        document.cookie = "username=; path=/; max-age=0";
        
        // Reset UI to logged out state
        loginForm.style.display = "block";
        logoutButton.style.display = "none";
        shoppingSection.style.display = "none";
        userInfoDiv.style.display = "none";
        document.getElementById("loginSuccess").style.display = "none";
        
        showModal("Logout successful. See you again soon!");
    });
    
    // CSRF Token generation
    function generateCSRFToken() {
        const token = Math.random().toString(36).substr(2);
        document.getElementById("csrfToken").value = token;
        sessionStorage.setItem("csrfToken", token);
    }
    
    generateCSRFToken();
    
    // Shopping Cart functionality
    function updateCart() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        cartItemsDiv.innerHTML = "";
        
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = "<div class='empty-cart-message'>Your cart is empty</div>";
        } else {
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const itemDiv = document.createElement("div");
                itemDiv.className = "cart-item";
                itemDiv.innerHTML = `
                    <span>${item.product} - $${item.price} x ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-secondary remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsDiv.appendChild(itemDiv);
            });
            
            // Update cart summary
            totalItemsSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartTotalSpan.textContent = total.toFixed(2);
        }
        
        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                removeFromCart(index);
            });
        });
    }
    
    function addToCart(product, price) {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.product === product);
        
        if (existingProductIndex >= 0) {
            // Increment quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                product: product,
                price: parseFloat(price),
                quantity: 1
            });
        }
        
        // Update sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(cart));
        
        // Update UI
        updateCart();
    }
    
    function removeFromCart(index) {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    }
    
    // Add to cart button listeners
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.getAttribute("data-product");
            const price = this.getAttribute("data-price");
            addToCart(product, price);
            showModal(`${product} added to your cart.`);
        });
    });
    
    // Check if user is already logged in
    function checkLoginStatus() {
        const userData = JSON.parse(localStorage.getItem("userData"));
        
        if (userData && userData.username) {
            // Check cookies as well for double validation
            const cookies = document.cookie.split(';');
            let cookieUsername = null;
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith("username=")) {
                    cookieUsername = decodeURIComponent(cookie.substring("username=".length));
                    break;
                }
            }
            
            // Only consider user logged in if both localStorage and cookies agree
            if (cookieUsername && userData.username) {
                // Update UI for logged in state
                loginForm.style.display = "none";
                logoutButton.style.display = "block";
                shoppingSection.style.display = "block";
                userInfoDiv.style.display = "flex";
                displayUsername.textContent = userData.username;
                lastLogin.textContent = userData.lastLogin;
            }
        }
    }
    
    window.addEventListener('resize', function() {
        // Adjust UI elements if needed on resize
        const windowWidth = window.innerWidth;
        
        // Example of dynamic UI adjustments
        if (windowWidth <= 480) {
            // Mobile view adjustments
            document.querySelectorAll('.product-actions').forEach(el => {
                el.classList.add('mobile-view');
            });
        } else {
            // Desktop/tablet view
            document.querySelectorAll('.product-actions').forEach(el => {
                el.classList.remove('mobile-view');
            });
        }
    });
    
    // Call once on page load to set initial state
    window.dispatchEvent(new Event('resize'));
    
    // Initialize cart display
    updateCart();
    
    // Check login status on page load
    checkLoginStatus();
});