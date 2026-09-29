// ========================================
// ELEMENTS
// ========================================

const popularList = document.querySelector("#popular-list");
const exploreList = document.querySelector("#explore-list");
const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const orderNowBtn = document.querySelector("#order-now-btn");
const checkoutBtn = document.querySelector(".checkout-btn");
const categoryButtons = document.querySelectorAll(".category-btn");


// ========================================
// DATA
// ========================================

let productList = [];
let cart = quickBites.getCart();

// ========================================
// LOAD PRODUCTS
// ========================================

const PRODUCTS_KEY = "quickBitesProducts";


async function loadProducts() {

    /*
        First check localStorage.

        Admin products are stored here.
    */

    const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);


    if (savedProducts) {

        try {

            productList =
                JSON.parse(savedProducts);


            showPopularProducts();

            showExploreProducts("All");

            updateCartButtons();

            return;

        }
        catch (error) {

            console.error(
                "Could not read saved products:",
                error
            );

        }

    }



    /*
        If there are no products in localStorage,
        load the original products.json.
    */

    try {

        const response =
            await fetch("../public/products.json");


        if (!response.ok) {

            throw new Error(
                "Could not load products"
            );

        }


        const data =
            await response.json();


        productList = data;



        /*
            Save the original products
            to localStorage.

            This creates the shared product
            list used by Admin and Customer.
        */

        localStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(productList)
        );



        showPopularProducts();

        showExploreProducts("All");

        updateCartButtons();

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}


loadProducts();

// ========================================
// CREATE PRODUCT CARD
// ========================================

function createProductCard(product) {
    const orderCard = document.createElement("div");
    const isInCart = cart.some(item => item.id === product.id);

    orderCard.classList.add("food-card");

    orderCard.innerHTML = `
        <div class="card-image">
            <img
                src="../public/${product.image}"
                alt="${product.name}">
        </div>

        <h4>${product.name}</h4>

        <h4 class="price">${product.price}</h4>

        <p class="product-category">
            ${product.category}
        </p>

        <a
            href="#"
            class="btn card-btn ${isInCart ? "added" : ""}"
            data-product-id="${product.id}">
            ${isInCart ? "Added to Cart ✓" : "Add to Cart"}
        </a>
    `;

    orderCard.querySelector(".card-btn").addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            addToCart(product);
        }
    );

    return orderCard;
}


// ========================================
// SHOW MOST POPULAR PRODUCTS
// ========================================

function showPopularProducts() {
    popularList.innerHTML = "";

    const popularProducts = productList.filter(
        product => product.popular === true
    );

    popularProducts.forEach(product => {
        popularList.appendChild(createProductCard(product));
    });
}


// ========================================
// SHOW EXPLORE PRODUCTS
// ========================================

function showExploreProducts(category) {
    exploreList.innerHTML = "";

    const productsToShow =
        category === "All"
            ? productList
            : productList.filter(
                product => product.category === category
            );

    productsToShow.forEach(product => {
        exploreList.appendChild(createProductCard(product));
    });
}


// ========================================
// CATEGORY FILTERS
// ========================================

categoryButtons.forEach(button => {
    button.addEventListener("click", function () {

        categoryButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        showExploreProducts(button.dataset.category);
    });
});


// ========================================
// ADD TO CART
// ========================================

function addToCart(product) {
    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}


// ========================================
// UPDATE CART BUTTONS
// ========================================

function updateCartButtons() {
    document.querySelectorAll(".card-btn").forEach(button => {
        const productId = Number(button.dataset.productId);
        const isInCart = cart.some(
            item => item.id === productId
        );

        button.textContent = isInCart
            ? "Added to Cart ✓"
            : "Add to Cart";

        button.classList.toggle("added", isInCart);
    });
}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {
    cartList.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach((product, index) => {
        const price = quickBites.parsePrice(product.price);

        const itemTotal = price * product.quantity;

        total += itemTotal;
        totalItems += product.quantity;

        const item = document.createElement("div");
        item.classList.add("item");

        item.innerHTML = `
            <div class="item-image">
                <img
                    src="${quickBites.getImagePath(product.image)}"
                    alt="${product.name}">
            </div>

            <div class="detail">
                <h4>${product.name}</h4>
                <h4 class="item-total">
                    Rs.${itemTotal.toFixed(2)}
                </h4>
            </div>

            <div class="flex">
                <a
                    href="#"
                    class="quantity-btn decrease"
                    aria-label="Decrease ${product.name} quantity">
                    <i class="fa-solid fa-minus"></i>
                </a>

                <h4 class="quantity-value">
                    ${product.quantity}
                </h4>

                <a
                    href="#"
                    class="quantity-btn increase"
                    aria-label="Increase ${product.name} quantity">
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        `;

        item.querySelector(".decrease").addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                decreaseQuantity(index);
            }
        );

        item.querySelector(".increase").addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                increaseQuantity(index);
            }
        );

        cartList.appendChild(item);
    });

    cartTotal.textContent = `Rs.${total.toFixed(2)}`;
    cartValue.textContent = totalItems;

    quickBites.saveCart(cart);
    updateCartButtons();
}


// ========================================
// INCREASE QUANTITY
// ========================================

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}


// ========================================
// DECREASE QUANTITY
// ========================================

function decreaseQuantity(index) {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


// ========================================
// OPEN / CLOSE CART
// ========================================

cartIcon.addEventListener("click", function (event) {
    event.preventDefault();
    cartTab.classList.add("cart-tab-active");
});

closeBtn.addEventListener("click", function (event) {
    event.preventDefault();
    cartTab.classList.remove("cart-tab-active");
});


// ========================================
// ORDER NOW
// ========================================

orderNowBtn.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelector("#menu").scrollIntoView({
        behavior: "smooth"
    });
});


// ========================================
// CHECKOUT
// ========================================

checkoutBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    quickBites.saveCart(cart);
    window.location.href = "checkout.html";
});
