// Main JavaScript file for the e-commerce website with Django messages support

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initProductGrid();
    initCart();
    initProductDetails();
    initFilters();
    initTabs();
    initResponsive();
    initProfile();
    initOrderHistory();
    initWishlist();
    initPayment();
    
    // Show Django messages first thing
    showDjangoMessages();
    
    // Update cart count on all pages
    updateCartCount();
});

// Function to show Django messages
function showDjangoMessages() {
    console.log('Checking for Django messages...');
    
    // Check for Bootstrap alerts first
    const bootstrapAlerts = document.querySelectorAll('.alert');
    console.log('Found', bootstrapAlerts.length, 'Bootstrap alerts');
    
    bootstrapAlerts.forEach((alert, index) => {
        try {
            // Get the message text (remove close button text)
            const alertClone = alert.cloneNode(true);
            const closeButtons = alertClone.querySelectorAll('[data-dismiss="alert"], .close, button');
            closeButtons.forEach(btn => btn.remove());
            
            const messageText = alertClone.textContent.trim();
            console.log(`Bootstrap Alert ${index + 1}: "${messageText}"`);
            
            // Determine message type
            let messageType = 'info';
            if (alert.classList.contains('alert-danger')) {
                messageType = 'error';
            } else if (alert.classList.contains('alert-warning')) {
                messageType = 'warning';
            } else if (alert.classList.contains('alert-info')) {
                messageType = 'info';
            } else if (alert.classList.contains('alert-success')) {
                messageType = 'success';
            }
            
            // Show as notification
            setTimeout(() => {
                showNotification(messageText, messageType);
            }, 500 + (index * 300));
            
            // Remove the alert after a short delay
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error processing Bootstrap alert:', error);
        }
    });
    
    // Also check for messages in Django messages framework container
    const djangoMessagesContainer = document.querySelector('#django-messages, [class*="messages"]');
    if (djangoMessagesContainer) {
        const djangoMessages = djangoMessagesContainer.querySelectorAll('[class*="message"], li');
        console.log('Found', djangoMessages.length, 'Django framework messages');
        
        djangoMessages.forEach((message, index) => {
            try {
                const messageText = message.textContent.trim();
                console.log(`Django Message ${index + 1}: "${messageText}"`);
                
                // Determine message type from classes
                const messageClasses = message.className;
                let messageType = 'info';
                
                if (messageClasses.includes('error') || messageClasses.includes('danger')) {
                    messageType = 'error';
                } else if (messageClasses.includes('warning')) {
                    messageType = 'warning';
                } else if (messageClasses.includes('info')) {
                    messageType = 'info';
                } else if (messageClasses.includes('success')) {
                    messageType = 'success';
                }
                
                // Show as notification
                setTimeout(() => {
                    showNotification(messageText, messageType);
                }, 500 + (index * 300));
                
                // Remove the message
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 1000);
                
            } catch (error) {
                console.error('Error processing Django message:', error);
            }
        });
        
        // Clean up empty container
        setTimeout(() => {
            if (djangoMessagesContainer && djangoMessagesContainer.children.length === 0) {
                djangoMessagesContainer.remove();
            }
        }, 1500);
    }
}

// Navigation & Mobile Menu
function initNavigation() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Mobile dropdown functionality
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    mobileDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.mobile-submenu');
        
        if (link && submenu) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) { // Only on mobile
                    e.preventDefault();
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    });
    
    // Dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 992) {
                const dropdownContent = this.querySelector('.dropdown-content');
                dropdownContent.style.opacity = '1';
                dropdownContent.style.visibility = 'visible';
                dropdownContent.style.transform = 'translateY(0)';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 992) {
                const dropdownContent = this.querySelector('.dropdown-content');
                dropdownContent.style.opacity = '0';
                dropdownContent.style.visibility = 'hidden';
                dropdownContent.style.transform = 'translateY(10px)';
            }
        });
    });
}

// Product Grid
function initProductGrid() {
    // Check if we're on a page with product grid
    const productGrids = document.querySelectorAll('#productGrid, #dashboardProductGrid, #relatedProductsGrid, #recommendedProducts');
    
    if (productGrids.length === 0) return;
    
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Premium Cotton T-Shirt",
            category: "Men's Clothing",
            price: 24.99,
            originalPrice: 34.99,
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            rating: 4.5,
            badge: "Sale"
        },
        {
            id: 2,
            name: "Floral Summer Dress",
            category: "Women's Clothing",
            price: 45.99,
            originalPrice: 59.99,
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            rating: 4.7,
            badge: "New"
        },
        {
            id: 3,
            name: "Sport Running Shoes",
            category: "Men's Shoes",
            price: 79.99,
            originalPrice: 99.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            rating: 4.3,
            badge: "Popular"
        },
        {
            id: 4,
            name: "Classic Denim Jacket",
            category: "Men's Clothing",
            price: 65.99,
            originalPrice: 85.99,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            rating: 4.8,
            badge: null
        }
    ];
    
    // Function to generate product HTML
    function generateProductHTML(product) {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="wishlist-btn" title="Add to Wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="quick-view-btn" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount">Save ${discount}%</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStarRating(product.rating)}
                        </div>
                        <span>${product.rating}</span>
                    </div>
                    <button class="btn btn-primary btn-block add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
    }
    
    // Function to generate star rating HTML
    function generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    // Populate product grids
    productGrids.forEach(grid => {
        // For related products, show only 4 products
        const productsToShow = grid.id === 'relatedProductsGrid' || grid.id === 'recommendedProducts' ? products.slice(0, 4) : products;
        
        grid.innerHTML = productsToShow.map(product => generateProductHTML(product)).join('');
        
        // Add event listeners to product buttons
        const addToCartBtns = grid.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.dataset.id;
                addToCart(productId);
            });
        });
        
        const wishlistBtns = grid.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.dataset.id;
                addToWishlist(productId);
            });
        });
        
        const quickViewBtns = grid.querySelectorAll('.quick-view-btn');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.dataset.id;
                // In a real app, this would open a modal with product details
                showNotification('Quick view feature would open in a real application');
            });
        });
    });
}

// Cart Management
function initCart() {
    // Cart quantity controls
    const minusBtns = document.querySelectorAll('.qty-btn.minus');
    const plusBtns = document.querySelectorAll('.qty-btn.plus');
    const qtyInputs = document.querySelectorAll('.qty-input');
    
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartItemTotal(this.closest('.cart-item'));
            }
        });
    });
    
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            if (value < 10) {
                input.value = value + 1;
                updateCartItemTotal(this.closest('.cart-item'));
            }
        });
    });
    
    qtyInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
            updateCartItemTotal(this.closest('.cart-item'));
        });
    });
    
    // Remove item buttons
    const removeBtns = document.querySelectorAll('.cart-item-actions .fa-trash');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.style.transform = 'translateX(-100%)';
            cartItem.style.opacity = '0';
            
            setTimeout(() => {
                cartItem.remove();
                updateCartSummary();
                updateCartCount();
            }, 300);
        });
    });
    
    // Move to wishlist buttons
    const moveToWishlistBtns = document.querySelectorAll('.cart-item-actions .fa-heart');
    moveToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productName = cartItem.querySelector('h3').textContent;
            
            // Show notification
            showNotification(`Added "${productName}" to wishlist`);
            
            // Remove from cart
            cartItem.style.transform = 'translateX(-100%)';
            cartItem.style.opacity = '0';
            
            setTimeout(() => {
                cartItem.remove();
                updateCartSummary();
                updateCartCount();
            }, 300);
        });
    });
    
    // Apply coupon button
    const applyCouponBtn = document.querySelector('.coupon-input .btn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', function() {
            const couponInput = this.previousElementSibling;
            const couponCode = couponInput.value.trim();
            
            if (couponCode === 'STYLE10') {
                showNotification('Coupon applied! 10% discount added.');
                couponInput.value = '';
            } else if (couponCode) {
                showNotification('Invalid coupon code. Please try again.', 'error');
            } else {
                showNotification('Please enter a coupon code.', 'error');
            }
        });
    }
    
    // Update cart summary
    updateCartSummary();
}

// Update cart item total
function updateCartItemTotal(cartItem) {
    const priceElement = cartItem.querySelector('.item-price');
    const quantityInput = cartItem.querySelector('.qty-input');
    const totalElement = cartItem.querySelector('.cart-item-total');
    
    const price = parseFloat(priceElement.textContent.replace('$', ''));
    const quantity = parseInt(quantityInput.value);
    const total = price * quantity;
    
    totalElement.textContent = '$' + total.toFixed(2);
    
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.item-price');
        const quantityInput = item.querySelector('.qty-input');
        
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        const quantity = parseInt(quantityInput.value);
        
        subtotal += price * quantity;
    });
    
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Update summary elements if they exist
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:nth-child(2)');
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:nth-child(2)');
    const taxElement = document.querySelector('.summary-row:nth-child(3) span:nth-child(2)');
    const totalElement = document.querySelector('.summary-row.total span:nth-child(2)');
    
    if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toFixed(2);
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    if (taxElement) taxElement.textContent = '$' + tax.toFixed(2);
    if (totalElement) totalElement.textContent = '$' + total.toFixed(2);
    
    // Update cart count in header
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length > 0) {
        // If we're on cart page, count actual items
        let totalCount = 0;
        cartItems.forEach(item => {
            const quantityInput = item.querySelector('.qty-input');
            totalCount += parseInt(quantityInput ? quantityInput.value : 1);
        });
        
        cartCountElements.forEach(element => {
            element.textContent = totalCount;
        });
    } else {
        // Otherwise use stored cart count or default
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
    }
}

// Add to cart function
function addToCart(productId) {
    const currentCount = parseInt(localStorage.getItem('cartCount') || 0);
    const newCount = currentCount + 1;
    localStorage.setItem('cartCount', newCount);
    
    updateCartCount();
    showNotification('Product added to cart!');
}

// Add to wishlist function
function addToWishlist(productId) {
    showNotification('Product added to wishlist!');
}

// Product Details Page
function initProductDetails() {
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorElement = document.getElementById('selectedColor');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.dataset.color;
            
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update selected color display
            if (selectedColorElement) {
                selectedColorElement.textContent = color.charAt(0).toUpperCase() + color.slice(1);
            }
        });
    });
    
    // Size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    const selectedSizeElement = document.getElementById('selectedSize');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = this.dataset.size;
            
            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected size display
            if (selectedSizeElement) {
                selectedSizeElement.textContent = size === 'XS' ? 'Extra Small (XS)' :
                                                size === 'S' ? 'Small (S)' :
                                                size === 'M' ? 'Medium (M)' :
                                                size === 'L' ? 'Large (L)' :
                                                size === 'XL' ? 'Extra Large (XL)' :
                                                'Extra Extra Large (XXL)';
            }
        });
    });
    
    // Quantity controls
    const minusBtn = document.querySelector('.quantity-selector .minus');
    const plusBtn = document.querySelector('.quantity-selector .plus');
    const quantityInput = document.getElementById('quantity');
    
    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
    }
    
    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
    }
    
    // Add to cart button on product details page
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-info h1')?.textContent || 'Product';
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            
            // Update cart count
            const currentCount = parseInt(localStorage.getItem('cartCount') || 0);
            const newCount = currentCount + quantity;
            localStorage.setItem('cartCount', newCount);
            
            updateCartCount();
            showNotification(`Added ${quantity} "${productName}" to cart!`);
        });
    }
    
    // Add to wishlist button on product details page
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-info h1')?.textContent || 'Product';
            showNotification(`Added "${productName}" to wishlist!`);
        });
    }
    
    // Thumbnail image selection
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            if (mainImage) {
                const thumbnailImg = this.querySelector('img');
                mainImage.src = thumbnailImg.src;
            }
        });
    });
}

// Dashboard Filters
function initFilters() {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const selectedPrice = document.getElementById('selectedPrice');
    
    if (priceRange && selectedPrice) {
        priceRange.addEventListener('input', function() {
            selectedPrice.textContent = '$' + this.value;
        });
    }
    
    // Color filter options
    const colorFilterOptions = document.querySelectorAll('.filter-section .color-option');
    colorFilterOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Size filter options
    const sizeFilterButtons = document.querySelectorAll('.filter-section .size-btn');
    sizeFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('.sidebar .btn-primary');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            showNotification('Filters applied!');
        });
    }
    
    // Reset filters button
    const resetFiltersBtn = document.querySelector('.sidebar .btn-outline');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset all filters
            if (priceRange && selectedPrice) {
                priceRange.value = 250;
                selectedPrice.textContent = '$250';
            }
            
            colorFilterOptions.forEach(option => option.classList.remove('active'));
            sizeFilterButtons.forEach(button => button.classList.remove('active'));
            
            // Reset size filter to Medium
            const mediumBtn = document.querySelector('.size-btn[data-size="M"]');
            if (mediumBtn) mediumBtn.classList.add('active');
            
            showNotification('Filters reset!');
        });
    }
    
    // Sort options
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            showNotification(`Sorted by: ${this.options[this.selectedIndex].text}`);
        });
    }
}

// Tab System
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all headers and contents
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked header
            this.classList.add('active');
            
            // Show corresponding content
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Responsive Features
function initResponsive() {
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu if window is resized to desktop size
            if (window.innerWidth > 992) {
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }, 250);
    });
    
    // Handle search on mobile
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    showNotification(`Searching for: "${searchTerm}"`);
                }
            }
        });
    }
}

// Profile Page
function initProfile() {
    // Check if we're on the profile page
    if (!document.querySelector('.profile-section')) return;
    
    // Tab switching
    const tabHeaders = document.querySelectorAll('.profile-tabs .tab-header');
    const tabContents = document.querySelectorAll('.profile-tabs .tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all headers and contents
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked header
            this.classList.add('active');
            
            // Show corresponding content
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // Add Address Button
    const addAddressBtn = document.getElementById('addAddressBtn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            showNotification('Address management feature would be implemented in a real application');
        });
    }
    
    // Address Actions
    const addressEditBtns = document.querySelectorAll('.address-actions .fa-edit');
    addressEditBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Address editing feature would be implemented in a real application');
        });
    });
    
    const addressDeleteBtns = document.querySelectorAll('.address-actions .fa-trash');
    addressDeleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const addressCard = this.closest('.address-card');
            const addressName = addressCard.querySelector('h4').textContent;
            
            // Confirm deletion
            if (confirm(`Are you sure you want to delete the "${addressName}" address?`)) {
                addressCard.style.opacity = '0';
                addressCard.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    addressCard.remove();
                    showNotification('Address deleted successfully');
                }, 300);
            }
        });
    });
    
    // Change Password Button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    
    if (changePasswordBtn && changePasswordForm) {
        changePasswordBtn.addEventListener('click', function() {
            changePasswordForm.style.display = 'block';
            this.style.display = 'none';
        });
    }
    
    if (cancelPasswordBtn && changePasswordForm) {
        cancelPasswordBtn.addEventListener('click', function() {
            changePasswordForm.style.display = 'none';
            changePasswordBtn.style.display = 'block';
        });
    }
    
    // Two-factor authentication toggle
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            if (this.checked) {
                showNotification('Two-factor authentication enabled. You will be prompted to set it up.');
            } else {
                showNotification('Two-factor authentication disabled.');
            }
        });
    }
    
    // View Activity Button
    const viewActivityBtn = document.getElementById('viewActivityBtn');
    if (viewActivityBtn) {
        viewActivityBtn.addEventListener('click', function() {
            showNotification('Login activity feature would be implemented in a real application');
        });
    }
    
    // Manage Devices Button
    const manageDevicesBtn = document.getElementById('manageDevicesBtn');
    if (manageDevicesBtn) {
        manageDevicesBtn.addEventListener('click', function() {
            showNotification('Device management feature would be implemented in a real application');
        });
    }
    
    // Save Preferences Button
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', function() {
            showNotification('Preferences saved successfully!');
        });
    }
    
    // Save Notifications Button
    const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
    if (saveNotificationsBtn) {
        saveNotificationsBtn.addEventListener('click', function() {
            showNotification('Notification settings saved successfully!');
        });
    }
    
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
        
        // Initialize active state
        if (toggle.checked) {
            toggle.nextElementSibling.classList.add('active');
        }
    });
    
    // Avatar edit button
    const avatarEditBtn = document.querySelector('.avatar-edit');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            showNotification('Avatar editing feature would be implemented in a real application');
        });
    }
}

// Order History Page
function initOrderHistory() {
    // Check if we're on the order history page
    if (!document.querySelector('.order-history-section')) return;
    
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('order') === 'success') {
        showNotification('Order placed successfully! Thank you for your purchase.');
    }
    
    // Time filter
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            filterOrders();
        });
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterOrders();
        });
    }
    
    // Quick action buttons
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', function() {
            showNotification('Order tracking feature would be implemented in a real application');
        });
    }
    
    const returnItemBtn = document.getElementById('returnItemBtn');
    if (returnItemBtn) {
        returnItemBtn.addEventListener('click', function() {
            showNotification('Return process would be implemented in a real application');
        });
    }
    
    const contactSupportBtn = document.getElementById('contactSupportBtn');
    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', function() {
            showNotification('Contact support feature would be implemented in a real application');
        });
    }
    
    // Reorder buttons in sidebar
    const reorderButtons = document.querySelectorAll('.reorder-section .btn');
    reorderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.reorder-item');
            const productName = productCard.querySelector('h4').textContent;
            
            showNotification(`Added "${productName}" to cart!`);
            
            // Update cart count
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                const currentCount = parseInt(element.textContent) || 0;
                element.textContent = currentCount + 1;
            });
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('orderDetailsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add event listeners to order action buttons
    const viewDetailsBtns = document.querySelectorAll('.order-actions .btn-outline');
    viewDetailsBtns.forEach(btn => {
        if (btn.textContent.includes('View Details')) {
            btn.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderNumber = orderCard.querySelector('.order-info h3').textContent.replace('Order #', '');
                viewOrderDetails(orderNumber);
            });
        }
    });
    
    const reorderBtns = document.querySelectorAll('.order-actions .btn-primary');
    reorderBtns.forEach(btn => {
        if (btn.textContent.includes('Reorder')) {
            btn.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderNumber = orderCard.querySelector('.order-info h3').textContent.replace('Order #', '');
                reorder(orderNumber);
            });
        }
    });
}

// Wishlist Page
function initWishlist() {
    // Check if we're on the wishlist page
    if (!document.querySelector('.wishlist-section')) return;
    
    // Add to cart buttons in wishlist
    const addToCartBtns = document.querySelectorAll('.wishlist-grid .add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            // Update cart count
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                const currentCount = parseInt(element.textContent) || 0;
                element.textContent = currentCount + 1;
            });
            
            showNotification(`Added "${productName}" to cart!`);
            
            // Remove from wishlist
            const removeBtn = productCard.querySelector('.remove-wishlist-btn');
            if (removeBtn) removeBtn.click();
        });
    });
    
    // Remove from wishlist buttons
    const removeWishlistBtns = document.querySelectorAll('.remove-wishlist-btn');
    removeWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            // Animate removal
            productCard.style.opacity = '0';
            productCard.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                productCard.remove();
                
                // Update wishlist count
                const wishlistCount = document.getElementById('wishlistCount');
                if (wishlistCount) {
                    const currentCount = parseInt(wishlistCount.textContent);
                    wishlistCount.textContent = currentCount - 1;
                }
                
                // Show empty state if no items left
                const wishlistGrid = document.querySelector('.wishlist-grid');
                if (wishlistGrid && wishlistGrid.children.length === 0) {
                    wishlistGrid.innerHTML = `
                        <div class="empty-wishlist" style="grid-column: 1 / -1;">
                            <i class="far fa-heart"></i>
                            <h3>Your wishlist is empty</h3>
                            <p>Save items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
                            <a href="dashboard.html" class="btn btn-primary">Start Shopping</a>
                        </div>
                    `;
                }
            }, 300);
            
            showNotification(`Removed "${productName}" from wishlist.`);
        });
    });
    
    // Add all to cart button
    const addAllToCartBtn = document.getElementById('addAllToCartBtn');
    if (addAllToCartBtn) {
        addAllToCartBtn.addEventListener('click', function() {
            const productCards = document.querySelectorAll('.wishlist-grid .product-card');
            const itemCount = productCards.length;
            
            if (itemCount === 0) {
                showNotification('Your wishlist is empty!', 'error');
                return;
            }
            
            // Update cart count
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                const currentCount = parseInt(element.textContent) || 0;
                element.textContent = currentCount + itemCount;
            });
            
            showNotification(`Added ${itemCount} items to cart!`);
            
            // Clear wishlist
            const wishlistGrid = document.querySelector('.wishlist-grid');
            wishlistGrid.innerHTML = `
                <div class="empty-wishlist" style="grid-column: 1 / -1;">
                    <i class="far fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
                    <a href="dashboard.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            
            // Update wishlist count
            const wishlistCount = document.getElementById('wishlistCount');
            if (wishlistCount) {
                wishlistCount.textContent = '0';
            }
        });
    }
    
    // Share wishlist button
    const shareWishlistBtn = document.getElementById('shareWishlistBtn');
    if (shareWishlistBtn) {
        shareWishlistBtn.addEventListener('click', function() {
            showNotification('Wishlist sharing feature would be implemented in a real application');
        });
    }
    
    // Wishlist items heart buttons
    const wishlistHeartBtns = document.querySelectorAll('.wishlist-btn');
    wishlistHeartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const heartIcon = this.querySelector('i');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                showNotification(`Added "${productName}" to wishlist!`);
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                showNotification(`Removed "${productName}" from wishlist.`);
            }
        });
    });
}

// Payment Page
function initPayment() {
    // Check if we're on the payment page
    if (!document.querySelector('.payment-section')) return;
    
    // Shipping method selection
    const shippingOptions = document.querySelectorAll('.shipping-option');
    const shippingCostElement = document.getElementById('shippingCost');
    const orderTotalElement = document.getElementById('orderTotal');
    
    shippingOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        const label = option.querySelector('label');
        
        label.addEventListener('click', function() {
            // Remove active class from all options
            shippingOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            option.classList.add('active');
            radio.checked = true;
            
            // Update shipping cost and total
            updateOrderTotal();
        });
    });
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentType = this.dataset.payment;
            
            // Remove active class from all options
            paymentOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            
            // Show corresponding payment details
            paymentDetails.forEach(detail => {
                detail.classList.remove('active');
            });
            
            const detailsElement = document.getElementById(paymentType + 'Details');
            if (detailsElement) {
                detailsElement.classList.add('active');
            }
        });
    });
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            this.value = formattedValue.substring(0, 19);
        });
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            this.value = value.substring(0, 5);
        });
    }
    
    // Apply coupon button
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', function() {
            const couponCode = document.getElementById('couponCode').value.trim();
            
            if (couponCode === 'STYLE10') {
                showNotification('Coupon applied! 10% discount added.');
            } else if (couponCode) {
                showNotification('Invalid coupon code. Please try again.', 'error');
            } else {
                showNotification('Please enter a coupon code.', 'error');
            }
        });
    }
    
    // Add new address button
    const addNewAddressBtn = document.getElementById('addNewAddressBtn');
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', function() {
            showNotification('Address management feature would be implemented in a real application');
        });
    }
    
    // Edit address button
    const editAddressBtn = document.querySelector('.btn-edit');
    if (editAddressBtn) {
        editAddressBtn.addEventListener('click', function() {
            showNotification('Address editing feature would be implemented in a real application');
        });
    }
    
    // Initialize order total
    updateOrderTotal();
}

// Helper Functions

// Function to update order total on payment page
function updateOrderTotal() {
    const subtotal = 150.97;
    let shipping = 5.99;
    
    // Get selected shipping method
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (selectedShipping) {
        if (selectedShipping.id === 'expressShipping') {
            shipping = 12.99;
        } else if (selectedShipping.id === 'freeShipping') {
            shipping = 0;
        }
    }
    
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Update display
    const shippingCostElement = document.getElementById('shippingCost');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (shippingCostElement) {
        shippingCostElement.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    }
    
    if (orderTotalElement) {
        orderTotalElement.textContent = '$' + total.toFixed(2);
    }
}

// Function to filter orders on order history page
function filterOrders() {
    const timeFilter = document.getElementById('timeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const orderCards = document.querySelectorAll('.order-card');
    const emptyOrders = document.getElementById('emptyOrders');
    
    let visibleCount = 0;
    
    orderCards.forEach(card => {
        const status = card.querySelector('.order-status span').textContent.toLowerCase();
        let showCard = true;
        
        // Apply status filter
        if (statusFilter !== 'all' && status !== statusFilter) {
            showCard = false;
        }
        
        // Apply time filter (simplified for demo)
        if (timeFilter !== 'all') {
            // In a real app, you would filter by actual order dates
            // For demo, we'll just show all cards
        }
        
        if (showCard) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (emptyOrders) {
        if (visibleCount === 0) {
            emptyOrders.style.display = 'block';
        } else {
            emptyOrders.style.display = 'none';
        }
    }
}

// Function to view order details
function viewOrderDetails(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    const modalContent = document.getElementById('orderDetailsContent');
    
    if (!modal || !modalContent) return;
    
    // Sample order details (in a real app, you would fetch this from an API)
    const orderDetails = {
        'SH-2023-001245': {
            orderNumber: 'SH-2023-001245',
            date: 'October 15, 2023',
            status: 'Delivered',
            statusClass: 'delivered',
            shippingAddress: {
                name: 'John Doe',
                street: '123 Fashion Street',
                city: 'New York, NY 10001',
                country: 'United States',
                phone: '(123) 456-7890'
            },
            billingAddress: {
                name: 'John Doe',
                street: '123 Fashion Street',
                city: 'New York, NY 10001',
                country: 'United States'
            },
            paymentMethod: 'Credit Card (•••• •••• •••• 1234)',
            items: [
                {
                    name: 'Premium Cotton T-Shirt',
                    size: 'M',
                    color: 'Black',
                    quantity: 1,
                    price: 24.99,
                    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
                },
                {
                    name: 'Sport Running Shoes',
                    size: '10',
                    color: 'White/Red',
                    quantity: 1,
                    price: 79.99,
                    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
                }
            ],
            subtotal: 104.98,
            shipping: 5.99,
            tax: 8.40,
            discount: 0,
            total: 119.37,
            trackingNumber: 'TRK123456789',
            carrier: 'FedEx',
            estimatedDelivery: 'October 20, 2023',
            deliveredDate: 'October 19, 2023'
        }
    };
    
    const order = orderDetails[orderId] || orderDetails['SH-2023-001245'];
    
    // Generate order details HTML
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-detail-item">
                <div class="detail-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="detail-item-info">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size}, Color: ${item.color}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="detail-item-price">$${item.price.toFixed(2)}</div>
                <div class="detail-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    
    const orderDetailsHTML = `
        <div class="order-details-container">
            <div class="order-details-header">
                <div class="order-details-info">
                    <h3>Order #${order.orderNumber}</h3>
                    <p>Placed on ${order.date}</p>
                </div>
                <div class="order-status ${order.statusClass}">
                    <i class="fas fa-${order.statusClass === 'delivered' ? 'check-circle' : order.statusClass === 'shipped' ? 'shipping-fast' : order.statusClass === 'processing' ? 'clock' : 'times-circle'}"></i>
                    <span>${order.status}</span>
                </div>
            </div>
            
            <div class="order-details-grid">
                <div class="details-section">
                    <h4>Shipping Address</h4>
                    <div class="details-content">
                        <p>${order.shippingAddress.name}</p>
                        <p>${order.shippingAddress.street}</p>
                        <p>${order.shippingAddress.city}</p>
                        <p>${order.shippingAddress.country}</p>
                        <p>Phone: ${order.shippingAddress.phone}</p>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Billing Address</h4>
                    <div class="details-content">
                        <p>${order.billingAddress.name}</p>
                        <p>${order.billingAddress.street}</p>
                        <p>${order.billingAddress.city}</p>
                        <p>${order.billingAddress.country}</p>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Payment Method</h4>
                    <div class="details-content">
                        <p>${order.paymentMethod}</p>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Shipping Info</h4>
                    <div class="details-content">
                        <p><strong>Carrier:</strong> ${order.carrier}</p>
                        <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
                        <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
                        ${order.deliveredDate ? `<p><strong>Delivered:</strong> ${order.deliveredDate}</p>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="order-items-details">
                <h4>Order Items</h4>
                <div class="order-items-list">
                    ${itemsHTML}
                </div>
            </div>
            
            <div class="order-totals-details">
                <div class="totals-row">
                    <span>Subtotal</span>
                    <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                    <span>Shipping</span>
                    <span>$${order.shipping.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                    <span>Tax</span>
                    <span>$${order.tax.toFixed(2)}</span>
                </div>
                ${order.discount > 0 ? `
                <div class="totals-row">
                    <span>Discount</span>
                    <span>-$${order.discount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="totals-row total">
                    <span>Total</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="order-actions-details">
                <button class="btn btn-outline">
                    <i class="fas fa-print"></i> Print Invoice
                </button>
                <button class="btn btn-outline">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </button>
                <button class="btn btn-primary" onclick="reorder('${orderId}')">
                    <i class="fas fa-redo"></i> Reorder Items
                </button>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = orderDetailsHTML;
    modal.style.display = 'block';
}

// Function to reorder
function reorder(orderId) {
    showNotification(`Adding items from order ${orderId} to cart...`);
    
    // Update cart count
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        const currentCount = parseInt(element.textContent) || 0;
        element.textContent = currentCount + 2; // Assuming 2 items per order for demo
    });
    
    // Close modal if open
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    setTimeout(() => {
        showNotification('All items added to cart!');
    }, 1000);
}

// Notification System - Enhanced with Django messages support
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'fa-check-circle';
    switch(type) {
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        case 'info':
            icon = 'fa-info-circle';
            break;
        case 'success':
            icon = 'fa-check-circle';
            break;
    }
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}
