// ========================================
// API
// ========================================

const API_BASE_URL =
    "http://127.0.0.1:8080";


// ========================================
// DATA
// ========================================

let cart = [];

let currentUser = null;

let currentCart = null;


// ========================================
// ELEMENTS
// ========================================

const checkoutItems =
    document.querySelector("#checkout-items");

const subtotalElement =
    document.querySelector("#checkout-subtotal");

const deliveryElement =
    document.querySelector("#checkout-delivery");

const totalElement =
    document.querySelector("#checkout-total");

const cartValue =
    document.querySelector(".cart-value");

const nameInput =
    document.querySelector("#customer-name");

const phoneInput =
    document.querySelector("#customer-phone");

const addressInput =
    document.querySelector("#customer-address");

const cityInput =
    document.querySelector("#customer-city");

const checkoutForm =
    document.querySelector("#checkout-form");

const checkoutMessage =
    document.querySelector("#checkout-message");


// ========================================
// GET CURRENT USER
// ========================================

async function getCurrentUser() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


    if (!response.ok) {
        return null;
    }


    return await response.json();
}


// ========================================
// LOAD DATABASE CART
// ========================================

async function loadCart() {

    const cartResponse =
        await fetch(
            `${API_BASE_URL}/api/carts/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


    if (!cartResponse.ok) {

        throw new Error(
            "Could not load your cart."
        );
    }


    currentCart =
        await cartResponse.json();


    const cartId =
        currentCart.cartId;


    const itemsResponse =
        await fetch(
            `${API_BASE_URL}/api/cart-items/cart/${cartId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );


    if (!itemsResponse.ok) {

        throw new Error(
            "Could not load cart items."
        );
    }


    const databaseItems =
        await itemsResponse.json();


    cart = [];


    // ========================================
    // GET FOOD INFORMATION
    // ========================================

    for (const item of databaseItems) {

        const foodResponse =
            await fetch(
                `${API_BASE_URL}/api/food-items/${item.food_id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!foodResponse.ok) {
            continue;
        }


        const food =
            await foodResponse.json();


        cart.push({

            id:
                food.foodId,

            name:
                food.foodName,

            price:
                Number(food.price),

            image:
                food.imageUrl,

            quantity:
                Number(item.quantity),

            cartItemId:
                item.cart_item_id

        });
    }
}


// ========================================
// LOAD CUSTOMER
// ========================================

async function loadCustomerInformation() {

    try {

        currentUser =
            await getCurrentUser();


        if (!currentUser) {

            throw new Error(
                "Not logged in"
            );
        }


        if (
            currentUser.role !==
            "CUSTOMER"
        ) {

            throw new Error(
                "Only customers can checkout"
            );
        }


        // ========================================
        // CUSTOMER NAME
        // ========================================

        nameInput.value =
            currentUser.name || "";


        // ========================================
        // GET SAVED ADDRESSES
        // ========================================

        const addressResponse =
            await fetch(
                `${API_BASE_URL}/api/addresses/user/${currentUser.id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!addressResponse.ok) {

            throw new Error(
                "Could not load address."
            );
        }


        const addresses =
            await addressResponse.json();


        if (addresses.length > 0) {

            const address =
                addresses[0];


            phoneInput.value =
                address.phone || "";

            addressInput.value =
                address.addressLine || "";

            cityInput.value =
                address.city || "";
        }


    } catch (error) {

        console.error(
            "Customer loading error:",
            error
        );


        quickBites.showMessage(
            checkoutMessage,
            "Please login before checkout.",
            "red"
        );
    }
}


// ========================================
// DISPLAY CART
// ========================================

function displayCheckoutItems() {

    checkoutItems.innerHTML = "";


    let subtotal = 0;

    let totalItems = 0;


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="empty-checkout">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>Your cart is empty.</p>

            </div>
        `;


        subtotalElement.textContent =
            "Rs.0.00";

        deliveryElement.textContent =
            "Rs.0.00";

        totalElement.textContent =
            "Rs.0.00";

        cartValue.textContent =
            "0";

        return;
    }


    // ========================================
    // DISPLAY ITEMS
    // ========================================

    cart.forEach(product => {

        const price =
            Number(product.price) || 0;


        const quantity =
            Number(product.quantity) || 0;


        const itemTotal =
            price * quantity;


        subtotal += itemTotal;

        totalItems += quantity;


        const item =
            document.createElement("div");


        item.classList.add(
            "checkout-item"
        );


        item.innerHTML = `

            <div class="checkout-item-image">

                <img
                    src="${quickBites.getImagePath(
                        product.image
                    )}"
                    alt="${product.name}">

            </div>

            <div class="checkout-item-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    Quantity: ${quantity}
                </p>

            </div>

            <div class="checkout-item-price">

                Rs.${itemTotal.toFixed(2)}

            </div>
        `;


        checkoutItems.appendChild(
            item
        );
    });


    // ========================================
    // TOTALS
    // ========================================

    const deliveryFee =
        subtotal > 0 ? 50 : 0;


    const total =
        subtotal + deliveryFee;


    subtotalElement.textContent =
        `Rs.${subtotal.toFixed(2)}`;


    deliveryElement.textContent =
        `Rs.${deliveryFee.toFixed(2)}`;


    totalElement.textContent =
        `Rs.${total.toFixed(2)}`;


    cartValue.textContent =
        totalItems;
}


// ========================================
// PLACE ORDER
// ========================================

checkoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ========================================
        // CHECK LOGIN
        // ========================================

        if (!currentUser) {

            quickBites.showMessage(
                checkoutMessage,
                "Please login before placing an order.",
                "red"
            );

            return;
        }


        // ========================================
        // CHECK CART
        // ========================================

        if (cart.length === 0) {

            quickBites.showMessage(
                checkoutMessage,
                "Your cart is empty.",
                "red"
            );

            return;
        }


        // ========================================
        // GET FORM VALUES
        // ========================================

        const phone =
            phoneInput.value.trim();

        const address =
            addressInput.value.trim();

        const city =
            cityInput.value.trim();


        if (
            !phone ||
            !address ||
            !city
        ) {

            quickBites.showMessage(
                checkoutMessage,
                "Please complete all delivery details.",
                "red"
            );

            return;
        }


        // ========================================
        // PAYMENT
        // ========================================

        const selectedPayment =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (!selectedPayment) {

            quickBites.showMessage(
                checkoutMessage,
                "Please select a payment method.",
                "red"
            );

            return;
        }


        const paymentMethod =
            selectedPayment.value;


        try {

            // ========================================
            // DISABLE BUTTON
            // ========================================

            const button =
                checkoutForm.querySelector(
                    ".place-order-btn"
                );


            button.disabled = true;

            button.textContent =
                "Placing Order...";


            // ========================================
            // SEND CHECKOUT REQUEST
            // ========================================

            const response =
                await fetch(
                    `${API_BASE_URL}/api/checkout`,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            addressLine:
                                address,

                            city:
                                city,

                            phone:
                                phone,

                            paymentMethod:
                                paymentMethod

                        })
                    }
                );


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Could not place order."
                );
            }


            const savedOrder =
                JSON.parse(
                    responseText
                );


            console.log(
                "Order created:",
                savedOrder
            );


            // ========================================
            // SUCCESS
            // ========================================

            quickBites.showMessage(
                checkoutMessage,
                "Order placed successfully!",
                "green"
            );


            // ========================================
            // GO TO ORDER DETAILS
            // ========================================

            setTimeout(
                function () {

                    window.location.href =
                        `order_details.html?id=${
                            savedOrder.order_id
                        }`;

                },
                800
            );


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            quickBites.showMessage(
                checkoutMessage,
                error.message ||
                "Could not place the order. Please try again.",
                "red"
            );


            const button =
                checkoutForm.querySelector(
                    ".place-order-btn"
                );


            button.disabled = false;

            button.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Place Order
            `;
        }
    }
);


// ========================================
// INITIALIZE
// ========================================

async function initializeCheckout() {

    try {

        await loadCustomerInformation();

        await loadCart();

        displayCheckoutItems();

    } catch (error) {

        console.error(
            "Checkout initialization error:",
            error
        );

        quickBites.showMessage(
            checkoutMessage,
            "Could not load checkout.",
            "red"
        );
    }
}


initializeCheckout();