/* =========================================
   QUICK BITES ADMIN - CUSTOMERS
========================================= */

const API_BASE_URL = "http://127.0.0.1:8080";

let customers = [];


/* =========================================
   LOAD CUSTOMERS FROM BACKEND
========================================= */

async function loadCustomers() {

    const customerList =
        document.getElementById("customer-list");

    const emptyCustomers =
        document.getElementById("empty-customers");

    if (!customerList) {
        console.error("customer-list element not found");
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users/customers`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load customers. Status: ${response.status}`
            );

        }


        customers = await response.json();

        console.log("Customers loaded:", customers);

        renderCustomers(customers);


    } catch (error) {

        console.error(
            "Customer loading error:",
            error
        );

        customerList.innerHTML = "";

        if (emptyCustomers) {

            emptyCustomers.style.display = "block";

            emptyCustomers.querySelector("h3").textContent =
                "Could Not Load Customers";

            emptyCustomers.querySelector("p").textContent =
                error.message;

        }

    }

}


/* =========================================
   RENDER CUSTOMERS
========================================= */

function renderCustomers(customerData) {

    const customerList =
        document.getElementById("customer-list");

    const emptyCustomers =
        document.getElementById("empty-customers");

    const customerCount =
        document.getElementById("customer-count");


    if (!customerList) {
        return;
    }


    customerList.innerHTML = "";


    /* Update count */

    if (customerCount) {

        customerCount.textContent =
            customerData.length;

    }


    /* No customers */

    if (customerData.length === 0) {

        customerList.style.display = "none";

        if (emptyCustomers) {
            emptyCustomers.style.display = "block";
        }

        return;

    }


    /* Customers exist */

    customerList.style.display = "grid";

    if (emptyCustomers) {
        emptyCustomers.style.display = "none";
    }


    /* Create customer cards */

    customerData.forEach(customer => {

        const card =
            document.createElement("article");

        card.className = "customer-card";


        const firstLetter =
            customer.name
                ? customer.name.charAt(0).toUpperCase()
                : "?";


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

                <p>
                    <i class="fa-solid fa-envelope"></i>
                    ${escapeHTML(customer.email)}
                </p>

                <p>
                    <i class="fa-solid fa-id-card"></i>
                    Customer #${escapeHTML(customer.id)}
                </p>

            </div>

        `;


        customerList.appendChild(card);

    });

}


/* =========================================
   SEARCH
========================================= */

function searchCustomers() {

    const searchInput =
        document.getElementById("customer-search");

    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!searchTerm) {

        renderCustomers(customers);

        return;

    }


    const filteredCustomers =
        customers.filter(customer => {

            const name =
                String(customer.name || "")
                    .toLowerCase();

            const email =
                String(customer.email || "")
                    .toLowerCase();

            const id =
                String(customer.id || "")
                    .toLowerCase();


            return (
                name.includes(searchTerm) ||
                email.includes(searchTerm) ||
                id.includes(searchTerm)
            );

        });


    renderCustomers(filteredCustomers);

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
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById("customer-search");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchCustomers
            );

        }


        loadCustomers();

    }
);