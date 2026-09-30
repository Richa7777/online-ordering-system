let currentDelivery = null;
let currentOrder = null;
let currentAddress = null;
let currentCustomer = null;
let currentOrderItems = [];


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDeliveryDetails();

        setupActionButtons();

    }
);

function getDeliveryIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}

async function loadDeliveryDetails() {

    try {

        const deliveryId =
            getDeliveryIdFromUrl();


        if (!deliveryId) {

            throw new Error(
                "No delivery ID found in URL."
            );

        }


        console.log(
            "Loading delivery:",
            deliveryId
        );


        /* =====================================
           LOAD DELIVERY
        ===================================== */

        const deliveryResponse =
            await fetch(
                `${API_BASE_URL}/api/deliveries/${deliveryId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!deliveryResponse.ok) {

            throw new Error(
                `Delivery request failed: ${deliveryResponse.status}`
            );

        }


        currentDelivery =
            await deliveryResponse.json();


        console.log(
            "Delivery:",
            currentDelivery
        );


        /* =====================================
           LOAD ORDER
        ===================================== */

        const orderResponse =
            await fetch(
                `${API_BASE_URL}/api/orders/${currentDelivery.order_id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!orderResponse.ok) {

            throw new Error(
                `Order request failed: ${orderResponse.status}`
            );

        }


        currentOrder =
            await orderResponse.json();


        console.log(
            "Order:",
            currentOrder
        );


        /* =====================================
           LOAD ADDRESS
        ===================================== */

        if (currentOrder.address_id) {

            const addressResponse =
                await fetch(
                    `${API_BASE_URL}/api/addresses/${currentOrder.address_id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (addressResponse.ok) {

                currentAddress =
                    await addressResponse.json();


                console.log(
                    "Address:",
                    currentAddress
                );

            }

        }


        /* =====================================
           LOAD CUSTOMERS
        ===================================== */

        const customersResponse =
            await fetch(
                `${API_BASE_URL}/api/users/customers`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (customersResponse.ok) {

            const customers =
                await customersResponse.json();


            currentCustomer =
                customers.find(
                    customer =>
                        Number(customer.id) ===
                        Number(currentOrder.user_id)
                );


            console.log(
                "Customer:",
                currentCustomer
            );

        }


        /* =====================================
           LOAD ORDER ITEMS
        ===================================== */

        const itemsResponse =
            await fetch(
                `${API_BASE_URL}/api/order-items`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (itemsResponse.ok) {

            const allItems =
                await itemsResponse.json();


            currentOrderItems =
                allItems.filter(
                    item =>
                        Number(item.order_id) ===
                        Number(currentOrder.order_id)
                );


            console.log(
                "Order items:",
                currentOrderItems
            );

        }


        /* =====================================
           DISPLAY EVERYTHING
        ===================================== */

        displayDeliveryDetails();

        displayOrderItems();

        updateActionButtons();


    } catch (error) {

        console.error(
            "Delivery details loading error:",
            error
        );


        showDeliveryMessage(
            "Unable to load delivery details.",
            "error"
        );

    }

}


/* =========================================
   DISPLAY DELIVERY DETAILS
========================================= */

function displayDeliveryDetails() {

    if (!currentDelivery) {

        return;

    }


    /* =====================================
       DELIVERY ID
    ===================================== */

    const deliveryId =
        document.getElementById(
            "delivery-id"
        );


    if (deliveryId) {

        deliveryId.textContent =
            `#${currentDelivery.delivery_id}`;

    }


    /* =====================================
       STATUS
    ===================================== */

    updateDeliveryStatus(
        currentDelivery.delivery_status
    );


    /* =====================================
       CUSTOMER NAME
    ===================================== */

    const customerName =
        document.getElementById(
            "customer-name"
        );


    if (customerName) {

        customerName.textContent =
            currentCustomer
                ? currentCustomer.name
                : `Customer #${currentOrder.user_id}`;

    }


    /* =====================================
       CUSTOMER PHONE
    ===================================== */

    const customerPhone =
        document.getElementById(
            "customer-phone"
        );


    if (customerPhone) {

        customerPhone.textContent =
            currentAddress?.phone ||
            "Not provided";

    }


    /* =====================================
       CUSTOMER EMAIL
    ===================================== */

    const customerEmail =
        document.getElementById(
            "customer-email"
        );


    if (customerEmail) {

        customerEmail.textContent =
            currentCustomer?.email ||
            "Not available";

    }


    /* =====================================
       CUSTOMER ADDRESS
    ===================================== */

    const customerAddress =
        document.getElementById(
            "customer-address"
        );


    if (customerAddress) {

        customerAddress.textContent =
            formatAddress(
                currentAddress
            );

    }


    /* =====================================
       DELIVERY INFORMATION
    ===================================== */

    const deliveryInfoItems =
        document.querySelectorAll(
            ".delivery-details-card .details-section"
        );


    /*
     * The third details section is
     * Delivery Information.
     */

    if (deliveryInfoItems.length >= 3) {

        const deliverySection =
            deliveryInfoItems[2];


        const detailItems =
            deliverySection.querySelectorAll(
                ".detail-item p"
            );


        /* Pickup location */

        if (detailItems[0]) {

            detailItems[0].textContent =
                "Quick Bites Restaurant";

        }


        /* Delivery address */

        if (detailItems[1]) {

            detailItems[1].textContent =
                formatAddress(
                    currentAddress
                );

        }


        /* Order time */

        if (detailItems[2]) {

            detailItems[2].textContent =
                formatDateTime(
                    currentOrder.order_date
                );

        }


        /* Estimated delivery */

        if (detailItems[3]) {

            detailItems[3].textContent =
                getEstimatedDeliveryTime();

        }

    }

}


/* =========================================
   DISPLAY ORDER ITEMS
========================================= */

function displayOrderItems() {

    const orderTable =
        document.querySelector(
            ".order-table"
        );


    if (!orderTable) {

        return;

    }


    /* =====================================
       REMOVE OLD DUMMY ITEM ROWS
    ===================================== */

    orderTable
        .querySelectorAll(
            ".dynamic-order-row"
        )
        .forEach(
            row => row.remove()
        );


    /* =====================================
       FIND TOTAL
    ===================================== */

    const totalRow =
        orderTable.querySelector(
            ".order-total"
        );


    if (!totalRow) {

        return;

    }


    /* =====================================
       NO ITEMS
    ===================================== */

    if (
        currentOrderItems.length === 0
    ) {

        const emptyRow =
            document.createElement(
                "div"
            );


        emptyRow.className =
            "order-row dynamic-order-row";


        emptyRow.innerHTML = `

            <span>
                No items found
            </span>

            <span>
                -
            </span>

            <span>
                -
            </span>

        `;


        orderTable.insertBefore(
            emptyRow,
            totalRow
        );


    } else {


        /* =====================================
           DISPLAY REAL ORDER ITEMS
        ===================================== */

        currentOrderItems.forEach(
            item => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "order-row dynamic-order-row";


                const foodName =
                    item.food_name ||
                    "Food Item";


                const quantity =
                    Number(
                        item.quantity || 0
                    );


                const price =
                    Number(
                        item.price || 0
                    );


                row.innerHTML = `

                    <span>
                        ${escapeHTML(
                            foodName
                        )}
                    </span>

                    <span>
                        ${quantity}
                    </span>

                    <span>
                        Rs.${price.toFixed(2)}
                    </span>

                `;


                orderTable.insertBefore(
                    row,
                    totalRow
                );

            }
        );

    }


    /* =====================================
       DISPLAY ORDER TOTAL
    ===================================== */

    const totalElement =
        totalRow.querySelector(
            "strong:last-child"
        );


    if (totalElement) {

        totalElement.textContent =
            `Rs.${Number(
                currentOrder.total_amount || 0
            ).toFixed(2)}`;

    }

}


/* =========================================
   UPDATE DELIVERY STATUS DISPLAY
========================================= */

function updateDeliveryStatus(
    status
) {

    const deliveryStatus =
        document.getElementById(
            "delivery-status"
        );


    if (!deliveryStatus) {

        return;

    }


    const cleanStatus =
        String(status)
            .toUpperCase();


    switch (cleanStatus) {

        case "ASSIGNED":

            deliveryStatus.textContent =
                "Assigned";

            deliveryStatus.style.background =
                "#fff3cd";

            deliveryStatus.style.color =
                "#856404";

            break;


        case "PICKED_UP":

            deliveryStatus.textContent =
                "Picked Up";

            deliveryStatus.style.background =
                "#cce5ff";

            deliveryStatus.style.color =
                "#004085";

            break;


        case "OUT_FOR_DELIVERY":

            deliveryStatus.textContent =
                "Out for Delivery";

            deliveryStatus.style.background =
                "#cce5ff";

            deliveryStatus.style.color =
                "#004085";

            break;


        case "DELIVERED":

            deliveryStatus.textContent =
                "Delivered";

            deliveryStatus.style.background =
                "#d4edda";

            deliveryStatus.style.color =
                "#155724";

            break;


        default:

            deliveryStatus.textContent =
                status || "Unknown";

    }

}


async function changeDeliveryStatus(newStatus, successMessage) {

    if (!currentDelivery) {
        return;
    }

    const acceptButton = document.getElementById("accept-btn");
    const completeButton = document.getElementById("complete-btn");

    // stop double clicks while saving
    if (acceptButton) acceptButton.disabled = true;
    if (completeButton) completeButton.disabled = true;

    try {
        const updated = {
            ...currentDelivery,
            delivery_status: newStatus
        };

        if (newStatus === "DELIVERED") {
            updated.delivered_at = new Date().toISOString();
        }

        const response = await fetch(
            `${API_BASE_URL}/api/deliveries/${currentDelivery.delivery_id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updated)
            }
        );

        if (!response.ok) {
            throw new Error(`Update failed: ${response.status}`);
        }

        // keep the page's copy in sync with the database
        currentDelivery = await response.json();

        updateDeliveryStatus(currentDelivery.delivery_status);
        showDeliveryMessage(successMessage, "success");

    } catch (error) {
        console.error("Could not update delivery:", error);
        showDeliveryMessage("Could not update delivery status.", "error");
    }

    // re-evaluate which button should be enabled
    updateActionButtons();
}

function setupActionButtons() {

    const acceptButton = document.getElementById("accept-btn");
    const completeButton = document.getElementById("complete-btn");

    if (acceptButton) {
        acceptButton.addEventListener("click", function () {
            changeDeliveryStatus("PICKED_UP", "Delivery accepted.");
        });
    }

    if (completeButton) {
        completeButton.addEventListener("click", function () {
            changeDeliveryStatus("DELIVERED", "Delivery marked as delivered.");
        });
    }
}

/* =========================================
   ACTION BUTTON STATE
========================================= */

function updateActionButtons() {

    const acceptButton =
        document.getElementById(
            "accept-btn"
        );


    const completeButton =
        document.getElementById(
            "complete-btn"
        );


    if (!currentDelivery) {

        return;

    }


    const status =
        String(
            currentDelivery.delivery_status
        ).toUpperCase();


    if (acceptButton) {

        acceptButton.disabled =
            status !== "ASSIGNED";

    }


    if (completeButton) {

        completeButton.disabled =
            !(
                status === "PICKED_UP" ||
                status === "OUT_FOR_DELIVERY"
            );

    }

}


/* =========================================
   FORMAT ADDRESS
========================================= */

function formatAddress(address) {

    if (!address) {

        return "Address unavailable";

    }


    return [

        address.addressLine,

        address.city

    ]
        .filter(
            value =>
                value &&
                String(value).trim() !== ""
        )
        .join(", ");

}


/* =========================================
   FORMAT DATE/TIME
========================================= */

function formatDateTime(
    dateValue
) {

    if (!dateValue) {

        return "Not available";

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Not available";

    }


    return date.toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================
   ESTIMATED DELIVERY TIME
========================================= */

function getEstimatedDeliveryTime() {

    if (
        !currentDelivery ||
        !currentDelivery.assigned_at
    ) {

        return "Not available";

    }


    const assignedDate =
        new Date(
            currentDelivery.assigned_at
        );


    if (
        Number.isNaN(
            assignedDate.getTime()
        )
    ) {

        return "Not available";

    }


    const estimatedDate =
        new Date(
            assignedDate.getTime() +
            30 * 60 * 1000
        );


    return estimatedDate.toLocaleString(
        "en-GB",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showDeliveryMessage(
    message,
    type
) {

    const deliveryMessage =
        document.getElementById(
            "delivery-message"
        );


    if (!deliveryMessage) {

        return;

    }


    deliveryMessage.textContent =
        message;


    if (type === "error") {

        deliveryMessage.style.color =
            "#dc3545";

    } else {

        deliveryMessage.style.color =
            "#155724";

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}