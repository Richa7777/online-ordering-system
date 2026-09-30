
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
let cart = [];
let databaseCartId = null;


// ========================================
// CURRENT USER
// ========================================

let currentUser = null;

async function getCurrentUser() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8080/api/auth/me",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {

        console.error("Could not get current user:", error);
        return null;
    }
}

// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    try {

        currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "CUSTOMER") {
            alert("Please sign in as a customer.");
            window.location.href = "../public/login.html";
            return;
        }

        // ----------------------------------------
        // LOAD CATEGORIES
        // ----------------------------------------

        const categoryResponse = await fetch(
            "http://127.0.0.1:8080/api/categories",
            {
                credentials: "include"
            }
        );

        if (!categoryResponse.ok) {

            throw new Error(
                `Could not load categories: ${categoryResponse.status}`
            );
        }

        const categories =
            await categoryResponse.json();


        // ----------------------------------------
        // LOAD FOOD ITEMS
        // ----------------------------------------

        const productResponse = await fetch(
            "http://127.0.0.1:8080/api/food-items",
            {
                credentials: "include"
            }
        );

        if (!productResponse.ok) {

            throw new Error(
                `Could not load food items: ${productResponse.status}`
            );
        }

        const data =
            await productResponse.json();


        // ----------------------------------------
        // CONVERT BACKEND DATA
        // ----------------------------------------

        productList = data
            .filter(product => product.isAvailable)
            .map(product => {

                const category =
                    categories.find(
                        item =>
                            Number(item.categoryId) ===
                            Number(product.categoryId)
                    );

                return {

                    id: product.foodId,

                    name: product.foodName,

                    description:
                        product.description,

                    price:
                        `Rs.${Number(product.price).toFixed(2)}`,

                    image:
                        product.imageUrl,

                    categoryId:
                        product.categoryId,

                    category:
                        category
                            ? category.categoryName
                            : "Other",

                    popular:
                        product.isPopular === true
                };
            });


        console.log(
            "Products loaded:",
            productList
        );


        // ----------------------------------------
        // LOAD DATABASE CART
        // ----------------------------------------

        await loadDatabaseCart();


        // ----------------------------------------
        // DISPLAY PRODUCTS
        // ----------------------------------------

        showPopularProducts();

        showExploreProducts("All");

        updateCart();


    } catch (error) {

        console.error(
            "Error loading customer data:",
            error
        );

    }

}


// ========================================
// LOAD DATABASE CART
// ========================================

async function loadDatabaseCart() {

    if (!currentUser) {
        currentUser = await getCurrentUser();
    }

    if (!currentUser) {
        cart = [];
        databaseCartId = null;
        return;
    }

    const userId = currentUser.id;


    try {

        // ----------------------------------------
        // GET OR CREATE USER CART
        // ----------------------------------------

        const cartResponse = await fetch(
            `http://127.0.0.1:8080/api/carts/user/${userId}`,
            {
                method: "POST",
                credentials: "include"
            }
        );


        if (!cartResponse.ok) {

            throw new Error(
                `Could not load cart: ${cartResponse.status}`
            );
        }


        const databaseCart =
            await cartResponse.json();


        databaseCartId =
            databaseCart.cartId ??
            databaseCart.cart_id;


        if (!databaseCartId) {

            throw new Error(
                "Cart ID was not returned by the server."
            );
        }


        // ----------------------------------------
        // GET CART ITEMS
        // ----------------------------------------

        const itemsResponse = await fetch(
            `http://127.0.0.1:8080/api/cart-items/cart/${databaseCartId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (!itemsResponse.ok) {

            throw new Error(
                `Could not load cart items: ${itemsResponse.status}`
            );
        }


        const databaseItems =
            await itemsResponse.json();

cart = databaseItems
    .map(databaseItem => {

        const foodId =
            databaseItem.food_id;

        const quantity =
            databaseItem.quantity;

        const product =
            productList.find(
                item =>
                    Number(item.id) ===
                    Number(foodId)
            );

        if (!product) {
            return null;
        }

        return {

            ...product,

            quantity:
                Number(quantity) || 1,

            cartItemId:
                databaseItem.cart_item_id
        };

    })
    .filter(item => item !== null);



    } catch (error) {

        console.error(
            "Error loading database cart:",
            error
        );

        cart = [];

    }
}


// ========================================
// CREATE PRODUCT CARD
// ========================================

function createProductCard(product) {

    const orderCard =
        document.createElement("div");

    const isInCart =
        cart.some(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    orderCard.classList.add(
        "food-card"
    );


    orderCard.innerHTML = `

        <div class="card-image">

            <img
                src="../public/${product.image}"
                alt="${product.name}">

        </div>


        <h4>
            ${product.name}
        </h4>


        <h4 class="price">
            ${product.price}
        </h4>


        <p class="product-category">
            ${product.category}
        </p>


        <a
            href="#"
            class="btn card-btn ${isInCart ? "added" : ""}"
            data-product-id="${product.id}">

            ${
                isInCart
                    ? "Added to Cart ✓"
                    : "Add to Cart"
            }

        </a>

    `;


    orderCard
        .querySelector(".card-btn")
        .addEventListener(
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

    if (!popularList) {
        return;
    }


    popularList.innerHTML = "";


    const popularProducts =
        productList.filter(
            product =>
                product.popular === true
        );


    popularProducts.forEach(
        product => {

            popularList.appendChild(
                createProductCard(product)
            );

        }
    );
}


// ========================================
// SHOW EXPLORE PRODUCTS
// ========================================

function showExploreProducts(category) {

    if (!exploreList) {
        return;
    }


    exploreList.innerHTML = "";


    const productsToShow =
        category === "All"
            ? productList
            : productList.filter(
                product =>
                    product.category === category
            );


    productsToShow.forEach(
        product => {

            exploreList.appendChild(
                createProductCard(product)
            );

        }
    );
}


// ========================================
// CATEGORY FILTERS
// ========================================

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                showExploreProducts(
                    button.dataset.category
                );

            }
        );

    }
);


// ========================================
// ADD TO CART
// ========================================

async function addToCart(product) {

    if (!currentUser) {
        currentUser = await getCurrentUser();
    }

    if (!currentUser) {
        alert("Please sign in before adding items to your cart.");
        return;
    }

    const userId = currentUser.id;


    try {

        // ----------------------------------------
        // MAKE SURE DATABASE CART EXISTS
        // ----------------------------------------

        if (!databaseCartId) {

            const cartResponse =
                await fetch(
                    `http://127.0.0.1:8080/api/carts/user/${userId}`,
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );


            if (!cartResponse.ok) {

                throw new Error(
                    `Could not create cart: ${cartResponse.status}`
                );
            }


            const databaseCart =
                await cartResponse.json();


            databaseCartId =
                databaseCart.cartId ??
                databaseCart.cart_id;
        }


        // ----------------------------------------
        // ADD ITEM TO DATABASE
        // ----------------------------------------

        const response =
            await fetch(
                `http://127.0.0.1:8080/api/cart-items/cart/${databaseCartId}`,
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        foodId:
                            product.id,

                        quantity:
                            1

                    })
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Cart backend error:",
                errorText
            );

            throw new Error(
                `Could not add item: ${response.status}`
            );
        }


        // ----------------------------------------
        // RELOAD DATABASE CART
        // ----------------------------------------

        await loadDatabaseCart();


        updateCart();


        // Update product buttons
        showPopularProducts();

        showExploreProducts(
            document.querySelector(
                ".category-btn.active"
            )?.dataset.category || "All"
        );


    } catch (error) {

        console.error(
            "Error adding item to cart:",
            error
        );

        alert(
            "Could not add the item to your cart."
        );
    }
}


// ========================================
// UPDATE CART BUTTONS
// ========================================

function updateCartButtons() {

    document
        .querySelectorAll(".card-btn")
        .forEach(button => {

            const productId =
                Number(
                    button.dataset.productId
                );


            const isInCart =
                cart.some(
                    item =>
                        Number(item.id) ===
                        productId
                );


            button.textContent =
                isInCart
                    ? "Added to Cart ✓"
                    : "Add to Cart";


            button.classList.toggle(
                "added",
                isInCart
            );

        });
}


// ========================================
// UPDATE CART DISPLAY
// ========================================

function updateCart() {

    if (!cartList) {
        return;
    }


    cartList.innerHTML = "";


    let total = 0;

    let totalItems = 0;


    cart.forEach(
        (product, index) => {

            const price =
                quickBites.parsePrice(
                    product.price
                );


            const quantity =
                Number(product.quantity) || 0;


            const itemTotal =
                price * quantity;


            total += itemTotal;

            totalItems += quantity;


            const item =
                document.createElement("div");


            item.classList.add(
                "item"
            );


            item.innerHTML = `

                <div class="item-image">

                    <img
                        src="${quickBites.getImagePath(product.image)}"
                        alt="${product.name}">

                </div>


                <div class="detail">

                    <h4>
                        ${product.name}
                    </h4>

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

                        ${quantity}

                    </h4>


                    <a
                        href="#"
                        class="quantity-btn increase"
                        aria-label="Increase ${product.name} quantity">

                        <i class="fa-solid fa-plus"></i>

                    </a>

                </div>

            `;


            item
                .querySelector(".decrease")
                .addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        decreaseQuantity(
                            index
                        );

                    }
                );


            item
                .querySelector(".increase")
                .addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        increaseQuantity(
                            index
                        );

                    }
                );


            cartList.appendChild(
                item
            );

        }
    );


    cartTotal.textContent =
        `Rs.${total.toFixed(2)}`;


    cartValue.textContent =
        totalItems;


    quickBites.updateCartBadge(
        cart
    );



    updateCartButtons();
}


// ========================================
// INCREASE QUANTITY
// ========================================

async function increaseQuantity(index) {

    const product =
        cart[index];


    if (!product) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://127.0.0.1:8080/api/cart-items/${product.cartItemId}`,
                {
                    method: "PUT",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        cart_id:
                            databaseCartId,

                        food_id:
                            product.id,

                        quantity:
                            Number(product.quantity) + 1

                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Could not update quantity: ${response.status}`
            );
        }


        await loadDatabaseCart();

        updateCart();


    } catch (error) {

        console.error(
            "Error increasing quantity:",
            error
        );

        alert(
            "Could not update the quantity."
        );
    }
}


// ========================================
// DECREASE QUANTITY
// ========================================

async function decreaseQuantity(index) {

    const product =
        cart[index];


    if (!product) {
        return;
    }


    const newQuantity =
        Number(product.quantity) - 1;


    try {

        // ----------------------------------------
        // DELETE ITEM IF QUANTITY BECOMES ZERO
        // ----------------------------------------

        if (newQuantity <= 0) {

            const response =
                await fetch(
                    `http://127.0.0.1:8080/api/cart-items/${product.cartItemId}`,
                    {
                        method: "DELETE",

                        credentials: "include"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Could not remove item: ${response.status}`
                );
            }


        } else {

            // ----------------------------------------
            // UPDATE QUANTITY
            // ----------------------------------------

            const response =
                await fetch(
                    `http://127.0.0.1:8080/api/cart-items/${product.cartItemId}`,
                    {
                        method: "PUT",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            cart_id:
                                databaseCartId,

                            food_id:
                                product.id,

                            quantity:
                                newQuantity

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Could not update quantity: ${response.status}`
                );
            }
        }


        await loadDatabaseCart();

        updateCart();


    } catch (error) {

        console.error(
            "Error decreasing quantity:",
            error
        );

        alert(
            "Could not update the quantity."
        );
    }
}


// ========================================
// OPEN CART
// ========================================

if (cartIcon) {

    cartIcon.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            cartTab.classList.add(
                "cart-tab-active"
            );

        }
    );
}


// ========================================
// CLOSE CART
// ========================================

if (closeBtn) {

    closeBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            cartTab.classList.remove(
                "cart-tab-active"
            );

        }
    );
}


// ========================================
// ORDER NOW
// ========================================

if (orderNowBtn) {

    orderNowBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const menu =
                document.querySelector(
                    "#menu"
                );


            if (menu) {

                menu.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );
}


// ========================================
// CHECKOUT
// ========================================

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

                return;
            }



            window.location.href =
                "checkout.html";

        }
    );
}


// ========================================
// INITIALIZE
// ========================================

loadProducts();
