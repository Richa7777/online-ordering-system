(function () {

let deliveries = [];

const tableBody = document.getElementById("delivery-table-body");
const statusFilter = document.getElementById("status-filter");


// ======================================================
// LOAD CURRENT RIDER
// ======================================================

async function loadCurrentRider() {

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Failed to load current rider: ${response.status}`);
    }

    return await response.json();
}


// ======================================================
// LOAD DELIVERIES
// ======================================================

async function loadDeliveries() {

    try {

        // Get currently logged-in rider
        const currentRider = await loadCurrentRider();

        // Get all deliveries from backend
        const response = await fetch(`${API_BASE_URL}/api/deliveries`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(
                `Failed to load deliveries: ${response.status}`
            );
        }

        const allDeliveries = await response.json();

        console.log("Current rider:", currentRider);
        console.log("All deliveries:", allDeliveries);


        // Only show deliveries assigned to the logged-in rider
        const riderDeliveries = allDeliveries.filter(
            delivery =>
                Number(delivery.rider_id) === Number(currentRider.id)
        );


        // Convert backend data into the format used by the page
        deliveries = await Promise.all(
            riderDeliveries.map(delivery =>
                convertDelivery(delivery)
            )
        );


        console.log(
            "Rider deliveries from backend:",
            deliveries
        );


        // Display deliveries
        displayDeliveries(
            getFilteredDeliveries()
        );


        // Update summary cards
        updateSummary();

    } catch (error) {

        console.error(
            "Error loading deliveries:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    Unable to load deliveries.
                </td>
            </tr>
        `;
    }
}


// ======================================================
// CONVERT BACKEND DELIVERY DATA
// ======================================================

async function convertDelivery(delivery) {

    let order = null;
    let address = null;


    // --------------------------------------------------
    // Load order
    // --------------------------------------------------

    try {

        const orderResponse = await fetch(
            `${API_BASE_URL}/api/orders/${delivery.order_id}`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (orderResponse.ok) {
            order = await orderResponse.json();
        }

    } catch (error) {

        console.error(
            `Could not load order ${delivery.order_id}:`,
            error
        );
    }


    // --------------------------------------------------
    // Load address
    // --------------------------------------------------

    if (order && order.address_id) {

        try {

            const addressResponse = await fetch(
                `${API_BASE_URL}/api/addresses/${order.address_id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


            if (addressResponse.ok) {
                address = await addressResponse.json();
            }

        } catch (error) {

            console.error(
                `Could not load address ${order.address_id}:`,
                error
            );
        }
    }


    // --------------------------------------------------
    // Return data used by the frontend
    // --------------------------------------------------

    return {

        id: delivery.delivery_id,

        order: delivery.order_id,

        customer: order
            ? `Customer #${order.user_id}`
            : "Unknown Customer",

        address: address
            ? formatAddress(address)
            : "Address unavailable",

        date: formatDate(
            delivery.assigned_at
        ),

        status: formatDeliveryStatus(
            delivery.delivery_status
        )
    };
}


// ======================================================
// FORMAT ADDRESS
// ======================================================

function formatAddress(address) {

    return [
        address.addressLine,
        address.city,
        address.phone
    ]
        .filter(
            value =>
                value &&
                String(value).trim() !== ""
        )
        .join(", ");
}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "N/A";
    }


    const date = new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


// ======================================================
// FORMAT DELIVERY STATUS
// ======================================================

function formatDeliveryStatus(status) {

    switch (
        String(status).toUpperCase()
    ) {

        case "ASSIGNED":
            return "Pending";


        case "PICKED_UP":
        case "OUT_FOR_DELIVERY":
            return "In Delivery";


        case "DELIVERED":
            return "Delivered";


        default:
            return "Pending";
    }
}


// ======================================================
// DISPLAY DELIVERIES
// ======================================================

function displayDeliveries(deliveriesToDisplay) {

    tableBody.innerHTML = "";


    // No deliveries
    if (deliveriesToDisplay.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No deliveries found.
                </td>
            </tr>
        `;

        return;
    }


    deliveriesToDisplay.forEach(
        delivery => {

            const row = document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${delivery.id}
                </td>

                <td>
                    ${delivery.order}
                </td>

                <td>
                    ${delivery.customer}
                </td>

                <td>
                    ${delivery.address}
                </td>

                <td>
                    ${delivery.date}
                </td>

                <td>
                    <span class="status ${getStatusClass(delivery.status)}">
                        ${delivery.status}
                    </span>
                </td>

                <td>
                    <button
                        class="action-btn"
                        data-id="${delivery.id}"
                    >
                        Update Status
                    </button>
                </td>

            `;


            tableBody.appendChild(row);
        }
    );


    // Add temporary status button handlers
    addStatusButtonListeners();
}


// ======================================================
// STATUS CSS CLASS
// ======================================================

function getStatusClass(status) {

    switch (status) {

        case "Pending":
            return "pending";

        case "In Delivery":
            return "in-delivery";

        case "Delivered":
            return "delivered";

        default:
            return "";
    }
}


// ======================================================
// FILTER DELIVERIES
// ======================================================

function getFilteredDeliveries() {

    const selectedStatus =
        statusFilter.value;


    if (
        selectedStatus === "all"
    ) {
        return deliveries;
    }


    return deliveries.filter(
        delivery =>
            delivery.status === selectedStatus
    );
}


// ======================================================
// STATUS FILTER EVENT
// ======================================================

statusFilter.addEventListener(
    "change",
    function () {

        displayDeliveries(
            getFilteredDeliveries()
        );

    }
);


// ======================================================
// UPDATE SUMMARY CARDS
// ======================================================

function updateSummary() {

    const totalDeliveries =
        deliveries.length;


    const pendingDeliveries =
        deliveries.filter(
            delivery =>
                delivery.status === "Pending"
        ).length;


    const activeDeliveries =
        deliveries.filter(
            delivery =>
                delivery.status === "In Delivery"
        ).length;


    const completedDeliveries =
        deliveries.filter(
            delivery =>
                delivery.status === "Delivered"
        ).length;


    const totalElement =
        document.getElementById(
            "total-deliveries"
        );


    const pendingElement =
        document.getElementById(
            "pending-deliveries"
        );


    const activeElement =
        document.getElementById(
            "active-deliveries"
        );


    const completedElement =
        document.getElementById(
            "completed-deliveries"
        );


    if (totalElement) {

        totalElement.textContent =
            totalDeliveries;
    }


    if (pendingElement) {

        pendingElement.textContent =
            pendingDeliveries;
    }


    if (activeElement) {

        activeElement.textContent =
            activeDeliveries;
    }


    if (completedElement) {

        completedElement.textContent =
            completedDeliveries;
    }
}

function addStatusButtonListeners() {

    const buttons = document.querySelectorAll(".action-btn");

    buttons.forEach(button => {

        button.addEventListener("click", async function () {

            const deliveryId = this.dataset.id;

            const delivery = deliveries.find(
                item => String(item.id) === String(deliveryId)
            );

            if (!delivery) {
                return;
            }


            // Determine the next status
            let nextStatus;

            if (delivery.status === "Pending") {

                nextStatus = "PICKED_UP";

            } else if (delivery.status === "In Delivery") {

                nextStatus = "DELIVERED";

            } else {

                return;
            }


            // Prevent multiple clicks while updating
            this.disabled = true;
            this.textContent = "Updating...";


            try {

                // Get the current backend delivery
                const response = await fetch(
                    `${API_BASE_URL}/api/deliveries/${deliveryId}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


                if (!response.ok) {
                    throw new Error(
                        `Failed to load delivery: ${response.status}`
                    );
                }


                const backendDelivery =
                    await response.json();


                // Update only the status
                backendDelivery.delivery_status =
                    nextStatus;


                // When delivered, record delivery time
                if (nextStatus === "DELIVERED") {

                    backendDelivery.delivered_at =
                        new Date().toISOString();

                }


                // Save the updated delivery
                const updateResponse = await fetch(
                    `${API_BASE_URL}/api/deliveries/${deliveryId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify(
                            backendDelivery
                        )
                    }
                );


                if (!updateResponse.ok) {

                    const errorText =
                        await updateResponse.text();

                    throw new Error(
                        `Failed to update delivery: ${updateResponse.status} ${errorText}`
                    );
                }


                const updatedDelivery =
                    await updateResponse.json();


                console.log(
                    "Delivery updated:",
                    updatedDelivery
                );


                // Reload deliveries from backend
                await loadDeliveries();


            } catch (error) {

                console.error(
                    "Error updating delivery:",
                    error
                );


                alert(
                    "Unable to update delivery status."
                );


                // Restore button
                this.disabled = false;
                this.textContent = "Update Status";
            }

        });

    });
}
// ======================================================
// START
// ======================================================

loadDeliveries();})();