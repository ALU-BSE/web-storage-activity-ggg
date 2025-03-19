// Initialize an empty cart array to store products
let cart = [];

// Function to update the cart count in the header
function updateCartCount() {
    // Get cart from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cartItems.length;
}

// Function to open the cart modal
function openCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    // Clear existing cart items in modal
    cartItems.innerHTML = '';

    // Retrieve the cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // If the cart is empty, show a message
    if (cart.length === 0) {
        cartItems.innerHTML = `<li>Your cart is empty.</li>`;
    } else {
        // Add cart items to modal
        cart.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price}`;
            cartItems.appendChild(li);
        });
    }
    
    cartModal.style.display = 'block';
}

// Function to close the cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = sampleProducts.find(p => p.id === productId);

    // Retrieve existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const productIndex = cart.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        // Add the product to the cart if it's not already in there
        cart.push(product);
        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Update button text to "Remove from Cart"
        const addButton = document.querySelector(`.add-cart-btn-${productId}`);
        if (addButton) {
            addButton.textContent = "Remove from Cart";
            addButton.classList.remove("btn-success");
            addButton.classList.add("btn-danger");
            addButton.onclick = function() { removeFromCart(productId); };
        }
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    // Retrieve existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Remove the product from the cart
    cart = cart.filter(p => p.id !== productId);
    
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Update button text back to "Add to Cart"
    const removeButton = document.querySelector(`.add-cart-btn-${productId}`);
    if (removeButton) {
        removeButton.textContent = "Add to Cart";
        removeButton.classList.remove("btn-danger");
        removeButton.classList.add("btn-success");
        removeButton.onclick = function() { addToCart(productId); };
    }
    
    // If we're on the cart page, refresh the display
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// Function to display cart items on the cart page
function displayCartItems() {
    const cartContainer = document.getElementById('cartItemsContainer');
    if (!cartContainer) return; // Not on cart page
    
    // Clear existing content
    cartContainer.innerHTML = '';
    
    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<div class="alert alert-info">Your cart is empty.</div>';
        return;
    }
    
    // Create a table to display cart items
    const table = document.createElement('table');
    table.className = 'table table-striped';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Action</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add each cart item to the table
    cartItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>
                <button class="btn btn-danger btn-sm add-cart-btn-${item.id}" 
                onclick="removeFromCart(${item.id})">Remove from Cart</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Calculate total price
    const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    
    // Create total row
    const totalDiv = document.createElement('div');
    totalDiv.className = 'text-end mt-3';
    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
    
    // Add table and total to the container
    cartContainer.appendChild(table);
    cartContainer.appendChild(totalDiv);
}

// Event listener for opening the cart
document.getElementById('cartLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    // If we're on index page, open modal. If cart link points to cart.html, let it navigate
    if (this.getAttribute('href') === '#') {
        openCart();
    }
});

// Event listener for closing the cart modal
document.getElementById('closeCartBtn')?.addEventListener('click', function() {
    closeCart();
});

// Initialize the cart count and cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // If on cart page, display cart items
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    // Update buttons on product catalog page
    if (document.querySelector('.product-catalog')) {
        updateButtonsState();
    }
});

// Function to update button states based on cart contents
function updateButtonsState() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // For each product in the catalog, check if it's in the cart and update button accordingly
    sampleProducts.forEach(product => {
        const inCart = cartItems.some(item => item.id === product.id);
        const button = document.querySelector(`.add-cart-btn-${product.id}`);
        
        if (button) {
            if (inCart) {
                button.textContent = "Remove from Cart";
                button.classList.remove("btn-success");
                button.classList.add("btn-danger");
                button.onclick = function() { removeFromCart(product.id); };
            } else {
                button.textContent = "Add to Cart";
                button.classList.remove("btn-danger");
                button.classList.add("btn-success");
                button.onclick = function() { addToCart(product.id); };
            }
        }
    });
}