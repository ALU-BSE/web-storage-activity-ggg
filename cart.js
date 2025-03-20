// Initialize an empty cart array to store products
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

// Function to update the cart count in the header
function updateCartCount() {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = cartItems.length;
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingItem = cart.find(item => item.id === productId);
    if (!existingItem) {
        cart.push(product);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    updateButtonsState();
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id !== productId);

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    updateButtonsState();

    // If on cart page, refresh display
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// Function to display cart items on the cart page
function displayCartItems() {
    const cartContainer = document.getElementById('cartItemsContainer');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<div class="alert alert-info text-center">Your cart is empty.</div>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'table table-striped text-center';

    // Table Header
    table.innerHTML = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${cartItems.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    cartContainer.appendChild(table);

    // Total Price
    const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'text-end mt-3';
    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
    cartContainer.appendChild(totalDiv);
}

// Function to update button states based on cart contents
function updateButtonsState() {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];

    sampleProducts.forEach(product => {
        const inCart = cartItems.some(item => item.id === product.id);
        const button = document.querySelector(`.add-cart-btn-${product.id}`);

        if (button) {
            button.textContent = inCart ? "Remove from Cart" : "Add to Cart";
            button.classList.toggle("btn-danger", inCart);
            button.classList.toggle("btn-success", !inCart);
            button.onclick = inCart ? () => removeFromCart(product.id) : () => addToCart(product.id);
        }
    });
}

// Function to add random products to the cart for demo purposes
function addRandomProductsToCart(count = 2) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Clear the cart first to avoid duplicates
    cart = [];
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Add random products
    for (let i = 0; i < count; i++) {
        const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        if (!cart.some(item => item.id === randomProduct.id)) {
            cart.push(randomProduct);
        }
    }

    // Save the updated cart to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display and count
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add random products to the cart for demo purposes
    addRandomProductsToCart(2); // Add 2 random products

    updateCartCount();

    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    } else {
        updateButtonsState();
    }

    // Add event listener for the "Reset Demo Cart" button
    const resetDemoBtn = document.getElementById('resetDemoBtn');
    if (resetDemoBtn) {
        resetDemoBtn.addEventListener('click', () => addRandomProductsToCart(2));
    }
});