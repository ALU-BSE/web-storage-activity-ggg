// Enhanced product data with more detailed information
const sampleProducts = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        description: "Noise-cancelling wireless headphones with 30-hour battery life and premium sound quality",
        imageUrl: "headphones.jpg",
        category: "Electronics",
        stock: 45,
        rating: 4.7,
        features: ["Noise cancellation", "Bluetooth 5.0", "30hr battery", "Quick charge"],
        colors: ["Black", "Silver", "Blue"],
        specifications: {
            weight: "250g",
            connectivity: "Bluetooth, 3.5mm jack",
            warranty: "2 years"
        },
        dateAdded: "2024-02-15"
    },
    {
        id: 2,
        name: "Ergonomic Office Chair",
        price: 249.99,
        description: "Fully adjustable ergonomic office chair with lumbar support and breathable mesh back",
        imageUrl: "chair.jpg",
        category: "Furniture",
        stock: 12,
        rating: 4.5,
        features: ["Adjustable height", "Lumbar support", "360° swivel", "Breathable mesh"],
        colors: ["Black", "Gray", "White"],
        specifications: {
            weight: "15kg",
            maxWeight: "150kg",
            warranty: "5 years"
        },
        dateAdded: "2024-01-20"
    },
    {
        id: 3,
        name: "Professional Chef Knife Set",
        price: 129.99,
        description: "8-piece professional grade chef knife set with German stainless steel blades",
        imageUrl: "knives.jpg",
        category: "Kitchen",
        stock: 28,
        rating: 4.8,
        features: ["German steel", "Ergonomic handles", "Full tang", "Balanced weight"],
        colors: ["Steel/Black"],
        specifications: {
            material: "German stainless steel",
            includes: "Chef, bread, utility, paring knives, shears, sharpener",
            warranty: "Lifetime"
        },
        dateAdded: "2024-03-05"
    },
    {
        id: 4,
        name: "Smart Fitness Watch",
        price: 149.99,
        description: "Waterproof fitness tracker with heart rate monitor, GPS, and 7-day battery life",
        imageUrl: "watch.jpg",
        category: "Fitness",
        stock: 37,
        rating: 4.6,
        features: ["Heart rate monitor", "GPS tracking", "Sleep analysis", "Waterproof"],
        colors: ["Black", "Blue", "Pink", "Green"],
        specifications: {
            display: "1.4 inch AMOLED",
            battery: "7 days normal use",
            waterRating: "5 ATM",
            warranty: "1 year"
        },
        dateAdded: "2024-02-28"
    }
];

console.log("[DEBUG] Enhanced sample products loaded:", sampleProducts.length, "products");

// Function to check if product is in cart
function isProductInCart(productId) {
    console.log(`[DEBUG] Checking if product ${productId} is in cart`);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(`[DEBUG] Current cart:`, cart);
    const isInCart = cart.some(item => item.id === productId);
    console.log(`[DEBUG] Product ${productId} in cart: ${isInCart}`);
    return isInCart;
}

// Function to display products in the catalog with enhanced information
function displayProducts() {
    console.log("[DEBUG] Starting displayProducts function");
    const productCatalog = document.querySelector('.product-catalog');
    
    if (!productCatalog) {
        console.warn("[DEBUG] Product catalog element not found - not on index page");
        return; // Not on index page
    }
    
    console.log("[DEBUG] Clearing existing products");
    productCatalog.innerHTML = ''; // Clear existing products
    
    // Create a row container for products
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('row', 'g-4');
    productCatalog.appendChild(rowContainer);
    
    console.log("[DEBUG] Beginning to render", sampleProducts.length, "products");
    
    sampleProducts.forEach(product => {
        console.log(`[DEBUG] Rendering product ${product.id}: ${product.name}`);
        
        // Check if product is in cart
        const inCart = isProductInCart(product.id);
        const buttonClass = inCart ? 'btn-danger' : 'btn-success';
        const buttonText = inCart ? 'Remove from Cart' : 'Add to Cart';
        const buttonAction = inCart ? `removeFromCart(${product.id})` : `addToCart(${product.id})`;
        
        console.log(`[DEBUG] Button state for product ${product.id}: ${buttonText}`);
        
        // Create features list
        const featuresList = product.features ? 
            `<p class="card-text"><small>Key features: ${product.features.join(', ')}</small></p>` : '';
        
        // Create colors list
        const colorsList = product.colors ? 
            `<p class="card-text"><small>Available in: ${product.colors.join(', ')}</small></p>` : '';
        
        // Stock indicator
        const stockStatus = product.stock > 0 ? 
            `<span class="badge bg-success">In Stock (${product.stock})</span>` : 
            `<span class="badge bg-danger">Out of Stock</span>`;
        
        // Format rating
        const ratingDisplay = product.rating ? 
            `<div class="mb-2">
                <span class="text-warning">★★★★★</span>
                <span class="small">${product.rating}/5</span>
            </div>` : '';
        
        // Create a product card with image on left and details on right
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-6', 'mb-4'); // Two cards per row

        productCard.innerHTML = `
            <div class="card h-100">
                <div class="row g-0">
                    <div class="col-md-4 position-relative">
                        <img src="${product.imageUrl}" class="img-fluid rounded-start h-100 w-100 object-fit-cover" 
                            alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
                        <div class="position-absolute top-0 start-0 m-2">
                            ${stockStatus}
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body d-flex flex-column h-100">
                            <h5 class="card-title">${product.name}</h5>
                            ${ratingDisplay}
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                            <p class="card-text"><strong>Category:</strong> ${product.category}</p>
                            ${featuresList}
                            ${colorsList}
                            <div class="mt-auto pt-2 d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary" onclick="viewProductDetails(${product.id})">
                                    View Details
                                </button>
                                <button class="btn btn-sm ${buttonClass} add-cart-btn-${product.id}" onclick="${buttonAction}">
                                    ${buttonText}
                                </button>
                            </div>
                            <div class="mt-2">
                                <small class="text-muted">Added on: ${new Date(product.dateAdded).toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append the product card to the row container
        rowContainer.appendChild(productCard);
        console.log(`[DEBUG] Enhanced product ${product.id} added to catalog`);
    });
    
    console.log("[DEBUG] All enhanced products rendered successfully");
}

// Enhanced function to view product details with more information
function viewProductDetails(productId) {
    console.log(`[DEBUG] Viewing detailed info for product ${productId}`);
    const product = sampleProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error(`[DEBUG] Product with ID ${productId} not found`);
        return;
    }
    
    console.log(`[DEBUG] Found product details:`, product);
    
    // Create a modal with detailed product information
    // This is a placeholder for actual modal implementation
    let specsList = '';
    if (product.specifications) {
        for (const [key, value] of Object.entries(product.specifications)) {
            specsList += `<li>${key}: ${value}</li>`;
        }
    }
    
    const detailsContent = `
        <div class="row">
            <div class="col-md-4">
                <img src="${product.imageUrl}" class="img-fluid rounded" alt="${product.name}" 
                    onerror="this.src='https://via.placeholder.com/300'">
            </div>
            <div class="col-md-8">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>In Stock:</strong> ${product.stock} units</p>
                <p><strong>Rating:</strong> ${product.rating}/5</p>
                
                <h4>Features:</h4>
                <ul>
                    ${product.features ? product.features.map(f => `<li>${f}</li>`).join('') : 'No features listed'}
                </ul>
                
                <h4>Available Colors:</h4>
                <p>${product.colors ? product.colors.join(', ') : 'No color options'}</p>
                
                <h4>Specifications:</h4>
                <ul>
                    ${specsList || 'No specifications listed'}
                </ul>
                
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    
    console.log(`[DEBUG] Displaying detailed modal for product ${productId}`);
    // In a real implementation, this would populate a modal
    alert(`Product Details:\n${product.name}\n$${product.price.toFixed(2)}\n${product.description}`);
}

// Call the function to display products when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("[DEBUG] DOM fully loaded, initializing enhanced product display");
    displayProducts();
    console.log("[DEBUG] Initial enhanced product display completed");
});

// Add error handling for image loading
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        console.warn(`[DEBUG] Failed to load image: ${e.target.src}`);
    }
}, true);