/* =========================================
   QUICK BITES ADMIN - CUSTOMERS
========================================= */

const ORDERS_KEY = "quickBitesOrders";

let orders = [];
let customers = [];


/* =========================================
   LOAD ORDERS
========================================= */

function loadOrders() {

    const savedOrders = localStorage.getItem(ORDERS_KEY);

    if (!savedOrders) {
        orders = [];
        buildCustomers();
        return;
    }

    try {

        orders = JSON.parse(savedOrders);

        if (!Array.isArray(orders)) {
            orders = [];
        }

    } catch (error) {

        console.error("Could not read orders:", error);

        orders = [];
    }

    buildCustomers();
}


/* =========================================
   BUILD CUSTOMER DATA
========================================= */

function buildCustomers() {

    const customerMap = {};

    orders.forEach(order => {

        const name = order.customerName || "Unknown Customer";
        const phone = order.phone || "Not available";
        const address = order.address || "Not available";
        const city = order.city || "";

        /*
         * Use phone as the main identifier.
         * If phone is unavailable, use the customer name.
         */
        const key = phone !== "Not available"
            ? phone
            : name.toLowerCase();

        if (!customerMap[key]) {

            customerMap[key] = {

                name: name,

                phone: phone,

                address: address,

                city: city,

                orders: [],

                totalSpent: 0

            };

        }

        customerMap[key].orders.push(order);

        customerMap[key].totalSpent += calculateOrderTotal(order);

        /*
         * Keep the latest available address.
         */
        if (order.address) {
            customerMap[key].address = order.address;
        }

        if (order.city) {
            customerMap[key].city = order.city;
        }

    });


    customers = Object.values(customerMap);

    /*
     * Sort customers by number of orders,
     * with the most active customers first.
     */
    customers.sort((a, b) => {

        if (b.orders.length !== a.orders.length) {
            return b.orders.length - a.orders.length;
        }

        return a.name.localeCompare(b.name);

    });


    renderCustomers(customers);
}


/* =========================================
   CALCULATE ORDER TOTAL
========================================= */

function calculateOrderTotal(order) {

    if (!order || !Array.isArray(order.items)) {
        return 0;
    }

    return order.items.reduce((total, item) => {

        const price = parsePrice(item.price);

        const quantity = Number(item.quantity) || 0;

        return total + (price * quantity);

    }, 0);
}


/* =========================================
   PARSE PRICE
========================================= */

function parsePrice(price) {

    return Number(
        String(price || "")
            .replace("Rs.", "")
            .replace(/,/g, "")
            .trim()
    ) || 0;

}


/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(amount) {

    return `Rs.${Number(amount || 0).toLocaleString("en-IN")}`;

}


/* =========================================
   RENDER CUSTOMERS
========================================= */

function renderCustomers(customerData) {

    const customerList = document.getElementById("customer-list");
    const emptyCustomers = document.getElementById("empty-customers");
    const customerCount = document.getElementById("customer-count");

    if (!customerList) {
        return;
    }


    customerList.innerHTML = "";


    /* Update count */

    if (customerCount) {
        customerCount.textContent = customerData.length;
    }


    /* Empty state */

    if (customerData.length === 0) {

        customerList.style.display = "none";

        if (emptyCustomers) {
            emptyCustomers.style.display = "block";
        }

        return;
    }


    customerList.style.display = "grid";

    if (emptyCustomers) {
        emptyCustomers.style.display = "none";
    }


    /* Create cards */

    customerData.forEach((customer, index) => {

        const card = createCustomerCard(customer, index);

        customerList.appendChild(card);

    });

}


/* =========================================
   CREATE CUSTOMER CARD
========================================= */

function createCustomerCard(customer, index) {

    const card = document.createElement("article");

    card.className = "customer-card";


    const firstLetter =
        customer.name
            ? customer.name.charAt(0).toUpperCase()
            : "?";


    const location = customer.city
        ? `${customer.address}, ${customer.city}`
        : customer.address;


    card.innerHTML = `

        <div class="customer-card-top">

            <div class="customer-avatar">
                ${escapeHTML(firstLetter)}
            </div>

            <div class="customer-card-name">

                <h4>
                    ${escapeHTML(customer.name)}
                </h4>

                <span>
                    Customer
                </span>

            </div>

        </div>


        <div class="customer-info">

            <div class="customer-info-row">

                <i class="fa-solid fa-phone"></i>

                <span>
                    ${escapeHTML(customer.phone)}
                </span>

            </div>


            <div class="customer-info-row">

                <i class="fa-solid fa-location-dot"></i>

                <span>
                    ${escapeHTML(location)}
                </span>

            </div>

        </div>


        <div class="customer-card-bottom">

            <div class="customer-stat">

                <small>
                    Orders
                </small>

                <strong>
                    ${customer.orders.length}
                </strong>

            </div>


            <div class="customer-stat">

                <small>
                    Total spent
                </small>

                <strong class="amount">
                    ${formatMoney(customer.totalSpent)}
                </strong>

            </div>


            <button
                type="button"
                class="view-customer-btn"
                data-index="${index}">

                View Details

            </button>

        </div>

    `;


    const button = card.querySelector(".view-customer-btn");

    button.addEventListener("click", function () {

        openCustomerModal(customer);

    });


    return card;
}


/* =========================================
   SEARCH CUSTOMERS
========================================= */

function searchCustomers() {

    const searchInput =
        document.getElementById("customer-search");

    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value.trim().toLowerCase();


    if (!searchTerm) {

        renderCustomers(customers);

        return;
    }


    const filteredCustomers = customers.filter(customer => {

        const name =
            String(customer.name || "").toLowerCase();

        const phone =
            String(customer.phone || "").toLowerCase();

        const address =
            String(customer.address || "").toLowerCase();

        const city =
            String(customer.city || "").toLowerCase();


        return (
            name.includes(searchTerm) ||
            phone.includes(searchTerm) ||
            address.includes(searchTerm) ||
            city.includes(searchTerm)
        );

    });


    renderCustomers(filteredCustomers);
}


/* =========================================
   OPEN CUSTOMER MODAL
========================================= */

function openCustomerModal(customer) {

    const modal =
        document.getElementById("customer-modal");

    const details =
        document.getElementById("customer-details");


    if (!modal || !details) {
        return;
    }


    const firstLetter =
        customer.name
            ? customer.name.charAt(0).toUpperCase()
            : "?";


    const location = customer.city
        ? `${customer.address}, ${customer.city}`
        : customer.address;


    /*
     * Show recent orders.
     */

    const sortedOrders = [...customer.orders].sort(
        (a, b) => {

            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateB - dateA;

        }
    );


    const orderList = sortedOrders.map(order => {

        const orderTotal =
            calculateOrderTotal(order);


        return `

            <div class="details-row">

                <i class="fa-solid fa-receipt"></i>

                <div>

                    <small>
                        Order
                    </small>

                    <strong>
                        #${escapeHTML(String(order.id || "N/A"))}
                        — ${formatMoney(orderTotal)}
                    </strong>

                </div>

            </div>

        `;

    }).join("");


    details.innerHTML = `

        <div class="customer-details-header">

            <div class="customer-details-avatar">
                ${escapeHTML(firstLetter)}
            </div>

            <div>

                <h4>
                    ${escapeHTML(customer.name)}
                </h4>

                <p>
                    ${customer.orders.length}
                    ${customer.orders.length === 1 ? "order" : "orders"}
                </p>

            </div>

        </div>


        <div class="details-list">

            <div class="details-row">

                <i class="fa-solid fa-phone"></i>

                <div>

                    <small>
                        Phone
                    </small>

                    <strong>
                        ${escapeHTML(customer.phone)}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-location-dot"></i>

                <div>

                    <small>
                        Address
                    </small>

                    <strong>
                        ${escapeHTML(location)}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-bag-shopping"></i>

                <div>

                    <small>
                        Total orders
                    </small>

                    <strong>
                        ${customer.orders.length}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-money-bill"></i>

                <div>

                    <small>
                        Total spent
                    </small>

                    <strong>
                        ${formatMoney(customer.totalSpent)}
                    </strong>

                </div>

            </div>


            ${orderList}

        </div>

    `;


    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================================
   CLOSE CUSTOMER MODAL
========================================= */

function closeCustomerModal() {

    const modal =
        document.getElementById("customer-modal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const hamburger =
        document.querySelector(".hamburger");

    const mobileMenu =
        document.querySelector(".mobile-menu");


    if (!hamburger || !mobileMenu) {
        return;
    }


    hamburger.addEventListener("click", function(event) {

        event.preventDefault();

        mobileMenu.classList.toggle(
            "mobile-menu-active"
        );


        const icon =
            hamburger.querySelector("i");


        if (icon) {

            icon.classList.toggle("fa-bars");

            icon.classList.toggle("fa-xmark");

        }

    });


    mobileMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function() {

            mobileMenu.classList.remove(
                "mobile-menu-active"
            );

        });

    });

}


/* =========================================
   LOGOUT
========================================= */

function setupLogout() {

    const logoutLinks =
        document.querySelectorAll(".logout-link");


    logoutLinks.forEach(link => {

        link.addEventListener("click", function() {

            /*
             * Frontend-only project:
             * logout simply returns to the public page.
             */

        });

    });

}


/* =========================================
   EVENT LISTENERS
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    loadOrders();


    /* Search */

    const searchInput =
        document.getElementById("customer-search");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchCustomers
        );

    }


    /* Close modal */

    const closeButton =
        document.getElementById(
            "close-customer-modal"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCustomerModal
        );

    }


    /* Close modal by clicking outside */

    const modal =
        document.getElementById("customer-modal");

    if (modal) {

        modal.addEventListener("click", function(event) {

            if (event.target === modal) {

                closeCustomerModal();

            }

        });

    }


    /* Close modal with Escape */

    document.addEventListener("keydown", function(event) {

        if (event.key === "Escape") {

            closeCustomerModal();

        }

    });


    setupMobileMenu();

    setupLogout();

});