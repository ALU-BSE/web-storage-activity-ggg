// Assuming sampleProducts data is already loaded from samples.js
const sampleProducts = [
    {
        id: 1,
        name: "Product 1",
        price: 19.99,
        description: "It's a fantastic item that you'll love",
        imageUrl: "product1.jpg",
        category: "Category 1"
    },
    {
        id: 2,
        name: "Product 2",
        price: 29.99,
        description: "Product 2 is our premium offering with enhanced features",
        imageUrl: "product2.jpg",
        category: "Category 2"
    },
    {
        id: 3,
        name: "Product 3",
        price: 39.99,
        description: "Description for Product 3",
        imageUrl: "product3.jpg",
        category: "Category 3"
    },
    {
        id: 4,
        name: "Product 4",
        price: 49.99,
        description: "Description for Product 4",
        imageUrl: "product4.jpg",
        category: "Category 4"
    }
];

// Function to check if product is in cart
function isProductInCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.some(item => item.id === productId);
}

// Function to display products in the catalog
function displayProducts() {
    const productCatalog = document.querySelector('.product-catalog');
    if (!productCatalog) return; // Not on index page
    
    productCatalog.innerHTML = ''; // Clear existing products
    
    sampleProducts.forEach(product => {
        // Check if product is in cart
        const inCart = isProductInCart(product.id);
        const buttonClass = inCart ? 'btn-danger' : 'btn-success';
        const buttonText = inCart ? 'Remove from Cart' : 'Add to Cart';
        const buttonAction = inCart ? `removeFromCart(${product.id})` : `addToCart(${product.id})`;
        
        // Create a product card
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'col-md-3', 'mb-4');

        productCard.innerHTML = `
            <div class="card">
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" 
                onerror="this.src='https://via.placeholder.com/150'">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                    <p class="card-text"><strong>Category:</strong> ${product.category}</p>
                    <button class="btn ${buttonClass} add-cart-btn-${product.id}" onclick="${buttonAction}">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
        
        // Append the product card to the catalog
        productCatalog.appendChild(productCard);
    });
}
let productsLoaded = false;

function loadProducts() {
    if (productsLoaded) return; // Prevent multiple loads
    
    const productCatalog = document.querySelector('.product-catalog');
    if (!productCatalog) return;

    productsLoaded = true; // Mark as loaded
}
// Function to view product details (can be expanded for a modal)
function viewProductDetails(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    alert(`Viewing details for ${product.name}`);
}

// Call the function to display products when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
});