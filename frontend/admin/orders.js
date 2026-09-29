// ==================================================
// QUICK BITES - ADMIN ORDERS
// ==================================================

const ORDERS_KEY = "quickBitesOrders";

let orders = [];


// ==================================================
// ELEMENTS
// ==================================================

const ordersList =
    document.querySelector("#orders-list");

const searchInput =
    document.querySelector("#order-search");

const statusFilter =
    document.querySelector("#status-filter");

const orderCount =
    document.querySelector("#order-count");


// Modal

const orderModal =
    document.querySelector("#order-modal");

const orderDetailsContent =
    document.querySelector("#order-details-content");

const modalOrderId =
    document.querySelector("#modal-order-id");

const closeModal =
    document.querySelector("#close-modal");

const closeModalBtn =
    document.querySelector("#close-modal-btn");



// ==================================================
// MOBILE MENU
// ==================================================

const hamburger =
    document.querySelector(".hamburger");

const mobileMenu =
    document.querySelector(".mobile-menu");


if (hamburger && mobileMenu) {

    hamburger.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            mobileMenu.classList.toggle(
                "mobile-menu-active"
            );


            const icon =
                hamburger.querySelector("i");


            if (icon) {

                icon.classList.toggle(
                    "fa-bars"
                );

                icon.classList.toggle(
                    "fa-xmark"
                );

            }

        }
    );


    mobileMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "mobile-menu-active"
                    );

                }
            );

        });

}



// ==================================================
// LOAD ORDERS
// ==================================================

function loadOrders() {

    try {

        const savedOrders =
            localStorage.getItem(ORDERS_KEY);


        if (savedOrders) {

            orders =
                JSON.parse(savedOrders);

        }
        else {

            orders = [];

        }

    }

    catch (error) {

        console.error(
            "Could not load orders:",
            error
        );

        orders = [];

    }


    displayOrders();

}



// ==================================================
// SAVE ORDERS
// ==================================================

function saveOrders() {

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );

}



// ==================================================
// PARSE PRICE
// ==================================================

function parsePrice(price) {

    return Number(
        String(price)
            .replace("Rs.", "")
            .replace(/,/g, "")
    ) || 0;

}



// ==================================================
// CALCULATE TOTAL
// ==================================================

function calculateOrderTotal(order) {

    let total = 0;


    if (
        order.items &&
        Array.isArray(order.items)
    ) {

        order.items.forEach(item => {

            const price =
                parsePrice(item.price);


            const quantity =
                Number(item.quantity) || 0;


            total +=
                price * quantity;

        });

    }


    return total;

}



// ==================================================
// STATUS CLASS
// ==================================================

function getStatusClass(status) {

    switch (
        String(status || "").toLowerCase()
    ) {

        case "preparing":

            return "status-preparing";


        case "out for delivery":

            return "status-delivery";


        case "delivered":

            return "status-delivered";


        case "cancelled":

            return "status-cancelled";


        default:

            return "";

    }

}



// ==================================================
// FILTER ORDERS
// ==================================================

function getFilteredOrders() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    return [...orders]
        .reverse()
        .filter(order => {


            const orderId =
                String(order.id || "")
                    .toLowerCase();


            const customerName =
                String(
                    order.customerName || ""
                )
                    .toLowerCase();


            const phone =
                String(
                    order.phone || ""
                )
                    .toLowerCase();


            const matchesSearch =

                searchTerm === "" ||

                orderId.includes(
                    searchTerm
                ) ||

                customerName.includes(
                    searchTerm
                ) ||

                phone.includes(
                    searchTerm
                );


            const matchesStatus =

                selectedStatus === "All" ||

                order.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

}



// ==================================================
// DISPLAY ORDERS
// ==================================================

function displayOrders() {

    ordersList.innerHTML = "";


    const filteredOrders =
        getFilteredOrders();


    orderCount.textContent =
        `${filteredOrders.length} ${
            filteredOrders.length === 1
                ? "order"
                : "orders"
        }`;


    // ==================================================
    // NO ORDERS
    // ==================================================

    if (filteredOrders.length === 0) {

        ordersList.innerHTML = `

            <div class="empty-orders">

                <i class="fa-solid fa-receipt"></i>

                <h3>
                    No Orders Found
                </h3>

                <p>
                    There are no orders matching your search.
                </p>

            </div>

        `;

        return;

    }



    // ==================================================
    // CREATE ORDER CARDS
    // ==================================================

    filteredOrders.forEach(order => {


        const total =
            calculateOrderTotal(order);


        const customerName =
            order.customerName ||
            "Customer";


        const status =
            order.status ||
            "Preparing";


        const itemNames =
            getItemNames(order);


        const card =
            document.createElement("article");


        card.className =
            "admin-order-card";


        card.innerHTML = `

            <!-- ORDER TOP -->

            <div class="order-card-top">


                <div class="order-main-info">

                    <span class="order-id">

                        #${escapeHTML(order.id)}

                    </span>


                    <span class="order-customer">

                        ${escapeHTML(customerName)}

                    </span>


                    <span class="order-date">

                        <i class="fa-regular fa-calendar"></i>

                        ${escapeHTML(
                            order.date ||
                            "Date unavailable"
                        )}

                    </span>

                </div>


                <span
                    class="order-status ${getStatusClass(status)}">

                    ${escapeHTML(status)}

                </span>

            </div>



            <!-- ORDER CONTENT -->

            <div class="order-card-content">


                <div class="order-items">

                    <div class="order-items-title">

                        Ordered Items

                    </div>


                    <div class="order-items-list">

                        ${escapeHTML(itemNames)}

                    </div>

                </div>


                <div class="order-total-area">

                    <span class="order-total-label">

                        Total

                    </span>


                    <span class="order-total">

                        Rs.${total.toFixed(2)}

                    </span>

                </div>

            </div>



            <!-- ORDER BOTTOM -->

            <div class="order-card-bottom">


                <select
                    class="order-status-select"
                    data-id="${escapeHTML(order.id)}"
                >

                    <option value="Preparing"
                        ${status === "Preparing"
                            ? "selected"
                            : ""}>

                        Preparing

                    </option>


                    <option value="Out for Delivery"
                        ${status === "Out for Delivery"
                            ? "selected"
                            : ""}>

                        Out for Delivery

                    </option>


                    <option value="Delivered"
                        ${status === "Delivered"
                            ? "selected"
                            : ""}>

                        Delivered

                    </option>


                    <option value="Cancelled"
                        ${status === "Cancelled"
                            ? "selected"
                            : ""}>

                        Cancelled

                    </option>

                </select>


                <button
                    type="button"
                    class="view-order-btn"
                    data-id="${escapeHTML(order.id)}">

                    <i class="fa-solid fa-eye"></i>

                    View Details

                </button>

            </div>

        `;


        ordersList.appendChild(card);

    });


    attachOrderEvents();

}



// ==================================================
// GET ITEM NAMES
// ==================================================

function getItemNames(order) {

    if (
        !order.items ||
        !Array.isArray(order.items) ||
        order.items.length === 0
    ) {

        return "No items available";

    }


    return order.items
        .map(item => {

            const quantity =
                Number(item.quantity) || 1;


            return `${item.name} × ${quantity}`;

        })
        .join(" · ");

}



// ==================================================
// GET ADDRESS
// ==================================================

function getAddress(order) {

    let address =
        order.address ||
        "Not available";


    if (order.city) {

        address +=
            `, ${order.city}`;

    }


    return address;

}



// ==================================================
// ATTACH EVENTS
// ==================================================

function attachOrderEvents() {


    // STATUS

    document
        .querySelectorAll(
            ".order-status-select"
        )
        .forEach(select => {

            select.addEventListener(
                "change",
                function () {

                    updateOrderStatus(
                        this.dataset.id,
                        this.value
                    );

                }
            );

        });



    // VIEW DETAILS

    document
        .querySelectorAll(
            ".view-order-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    showOrderDetails(
                        this.dataset.id
                    );

                }
            );

        });

}



// ==================================================
// UPDATE STATUS
// ==================================================

function updateOrderStatus(
    orderId,
    newStatus
) {

    const order =
        orders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) {

        return;

    }


    order.status =
        newStatus;


    saveOrders();

    displayOrders();

}



// ==================================================
// SHOW ORDER DETAILS
// ==================================================

function showOrderDetails(orderId) {

    const order =
        orders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) {

        return;

    }


    const total =
        calculateOrderTotal(order);


    modalOrderId.textContent =
        `#${order.id}`;


    let itemsHTML = "";


    if (
        order.items &&
        Array.isArray(order.items) &&
        order.items.length > 0
    ) {

        itemsHTML = order.items
            .map(item => {

                const price =
                    parsePrice(item.price);


                const quantity =
                    Number(item.quantity) || 1;


                const itemTotal =
                    price * quantity;


                const image =
                    getImagePath(item.image);


                return `

                    <div class="modal-item">


                        <div class="modal-item-image">

                            <img
                                src="${image}"
                                alt="${escapeHTML(item.name)}"
                                onerror="this.style.display='none'"
                            >

                        </div>


                        <div class="modal-item-info">

                            <h4>

                                ${escapeHTML(item.name)}

                            </h4>


                            <p>

                                Rs.${price.toFixed(2)}
                                ×
                                ${quantity}

                            </p>

                        </div>


                        <div class="modal-item-price">

                            Rs.${itemTotal.toFixed(2)}

                        </div>

                    </div>

                `;

            })
            .join("");

    }
    else {

        itemsHTML = `

            <p>
                No items available.
            </p>

        `;

    }



    orderDetailsContent.innerHTML = `

        <!-- CUSTOMER -->

        <div class="detail-row">

            <strong>
                Customer
            </strong>

            <span>
                ${escapeHTML(
                    order.customerName ||
                    "Not available"
                )}
            </span>

        </div>


        <!-- DATE -->

        <div class="detail-row">

            <strong>
                Date
            </strong>

            <span>
                ${escapeHTML(
                    order.date ||
                    "Not available"
                )}
            </span>

        </div>


        <!-- PHONE -->

        <div class="detail-row">

            <strong>
                Phone
            </strong>

            <span>
                ${escapeHTML(
                    order.phone ||
                    "Not available"
                )}
            </span>

        </div>


        <!-- ADDRESS -->

        <div class="detail-row">

            <strong>
                Delivery Address
            </strong>

            <span>
                ${escapeHTML(
                    getAddress(order)
                )}
            </span>

        </div>


        <!-- PAYMENT -->

        <div class="detail-row">

            <strong>
                Payment Method
            </strong>

            <span>
                ${escapeHTML(
                    order.paymentMethod ||
                    "Not available"
                )}
            </span>

        </div>


        <!-- STATUS -->

        <div class="detail-row">

            <strong>
                Status
            </strong>

            <span>
                ${escapeHTML(
                    order.status ||
                    "Preparing"
                )}
            </span>

        </div>


        <!-- ITEMS -->

        <div class="modal-items">

            <h3>
                Ordered Items
            </h3>

            ${itemsHTML}

        </div>


        <!-- TOTAL -->

        <div class="detail-row">

            <strong>
                Total
            </strong>

            <span>

                Rs.${total.toFixed(2)}

            </span>

        </div>

    `;


    orderModal.classList.add(
        "active"
    );

}



// ==================================================
// IMAGE PATH
// ==================================================

function getImagePath(image) {

    if (!image) {

        return "";

    }


    if (
        image.startsWith("../")
    ) {

        return image;

    }


    return `../public/${image}`;

}



// ==================================================
// CLOSE MODAL
// ==================================================

function closeOrderModal() {

    orderModal.classList.remove(
        "active"
    );

}


closeModal.addEventListener(
    "click",
    closeOrderModal
);


closeModalBtn.addEventListener(
    "click",
    closeOrderModal
);


orderModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === orderModal
        ) {

            closeOrderModal();

        }

    }
);



// ==================================================
// SEARCH
// ==================================================

searchInput.addEventListener(
    "input",
    displayOrders
);



// ==================================================
// FILTER
// ==================================================

statusFilter.addEventListener(
    "change",
    displayOrders
);



// ==================================================
// LOGOUT
// ==================================================

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {

        return;

    }


    window.location.href =
        "../public/index.html";

}


document
    .querySelector("#logout-btn")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );


document
    .querySelector("#mobile-logout")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );



// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



// ==================================================
// INITIALIZE
// ==================================================

loadOrders();