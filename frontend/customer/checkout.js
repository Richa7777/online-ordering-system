// ========================================
// DATA AND ELEMENTS
// ========================================

let cart = quickBites.getCart();

const checkoutItems = document.querySelector("#checkout-items");
const subtotalElement = document.querySelector("#checkout-subtotal");
const deliveryElement = document.querySelector("#checkout-delivery");
const totalElement = document.querySelector("#checkout-total");
const cartValue = document.querySelector(".cart-value");

const nameInput = document.querySelector("#customer-name");
const phoneInput = document.querySelector("#customer-phone");
const addressInput = document.querySelector("#customer-address");
const cityInput = document.querySelector("#customer-city");

const checkoutForm = document.querySelector("#checkout-form");
const checkoutMessage = document.querySelector("#checkout-message");


// ========================================
// LOAD CUSTOMER INFORMATION
// ========================================

nameInput.value = quickBites.getCustomer(
    "customerName",
    "Susmita Tamang"
);

phoneInput.value = quickBites.getCustomer("customerPhone");
addressInput.value = quickBites.getCustomer("customerAddress");
cityInput.value = quickBites.getCustomer("customerCity");


// ========================================
// DISPLAY CHECKOUT ITEMS
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

        subtotalElement.textContent = "Rs.0.00";
        deliveryElement.textContent = "Rs.0.00";
        totalElement.textContent = "Rs.0.00";
        cartValue.textContent = "0";
        return;
    }

    cart.forEach(product => {
        const price = Number(
            String(product.price)
                .replace("Rs.", "")
                .replace(/,/g, "")
        );

        const itemTotal = price * product.quantity;

        subtotal += itemTotal;
        totalItems += product.quantity;

        const item = document.createElement("div");
        item.classList.add("checkout-item");

        item.innerHTML = `
            <div class="checkout-item-image">
                <img
                    src="${quickBites.getImagePath(product.image)}"
                    alt="${product.name}">
            </div>

            <div class="checkout-item-info">
                <h4>${product.name}</h4>
                <p>Quantity: ${product.quantity}</p>
            </div>

            <div class="checkout-item-price">
                Rs.${itemTotal.toFixed(2)}
            </div>
        `;

        checkoutItems.appendChild(item);
    });

    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    subtotalElement.textContent = `Rs.${subtotal.toFixed(2)}`;
    deliveryElement.textContent = `Rs.${deliveryFee.toFixed(2)}`;
    totalElement.textContent = `Rs.${total.toFixed(2)}`;
    cartValue.textContent = totalItems;
}


// ========================================
// FORM SUBMISSION
// ========================================

checkoutForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // ----------------------------------------
    // CHECK CART
    // ----------------------------------------

    if (cart.length === 0) {
        quickBites.showMessage(
            checkoutMessage,
            "Your cart is empty.",
            "red"
        );
        return;
    }


    // ----------------------------------------
    // GET FORM VALUES
    // ----------------------------------------

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const city = cityInput.value.trim();


    // ----------------------------------------
    // VALIDATE DELIVERY DETAILS
    // ----------------------------------------

    if (!name || !phone || !address || !city) {
        quickBites.showMessage(
            checkoutMessage,
            "Please complete all delivery details.",
            "red"
        );
        return;
    }


    // ----------------------------------------
    // GET PAYMENT METHOD
    // ----------------------------------------

    const selectedPayment = document.querySelector(
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

    const paymentMethod = selectedPayment.value;


    // ----------------------------------------
    // GET LOGGED-IN USER ID
    // ----------------------------------------

    const userId = Number(
        localStorage.getItem("userId")
    );

    if (!userId) {
        quickBites.showMessage(
            checkoutMessage,
            "Please login before placing an order.",
            "red"
        );
        return;
    }


    // ----------------------------------------
    // SAVE CUSTOMER INFORMATION LOCALLY
    // ----------------------------------------

    quickBites.setCustomer({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerCity: city
    });


    try {

        // ========================================
        // CALCULATE ORDER TOTALS
        // ========================================

        const subtotal = cart.reduce((total, item) => {

            const price = quickBites.parsePrice(
                item.price
            );

            return total +
                price * Number(item.quantity || 0);

        }, 0);

        const deliveryFee = subtotal > 0 ? 50 : 0;

        const totalAmount =
            subtotal + deliveryFee;


        // ========================================
        // STEP 1: CREATE ADDRESS
        // ========================================

        const addressResponse = await fetch(
            "http://localhost:8080/api/addresses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userId: userId,
                    addressLine: address,
                    city: city,
                    phone: phone
                })
            }
        );


        if (!addressResponse.ok) {
            throw new Error(
                "Failed to create address"
            );
        }


        const savedAddress =
            await addressResponse.json();


        // ========================================
        // STEP 2: CREATE ORDER
        // ========================================

        const orderResponse = await fetch(
            "http://localhost:8080/api/orders",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: userId,
                    address_id: savedAddress.addressId,
                    order_status: "PLACED",
                    subtotal: subtotal,
                    delivery_fee: deliveryFee,
                    total_amount: totalAmount
                })
            }
        );


        if (!orderResponse.ok) {
            throw new Error(
                "Failed to create order"
            );
        }


        const savedOrder =
            await orderResponse.json();


        // ========================================
        // CLEAR CART
        // ========================================

        quickBites.clearCart();

        cart = [];


        // ========================================
        // SUCCESS MESSAGE
        // ========================================

        quickBites.showMessage(
            checkoutMessage,
            "Order created successfully!",
            "green"
        );


        // ========================================
        // GO TO ORDER DETAILS
        // ========================================

        setTimeout(function () {

            window.location.href =
                `order_details.html?id=${savedOrder.order_id}`;

        }, 1000);


    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );

        quickBites.showMessage(
            checkoutMessage,
            "Could not place the order. Please try again.",
            "red"
        );
    }
});


// ========================================
// INITIAL DISPLAY
// ========================================

displayCheckoutItems();
