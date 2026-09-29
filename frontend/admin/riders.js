/* =========================================
   QUICK BITES ADMIN - RIDERS
========================================= */

const RIDERS_KEY = "quickBitesRiders";

let riders = [];
let editingRiderId = null;


/* =========================================
   SAMPLE RIDERS
========================================= */

const sampleRiders = [
    {
        id: 1,
        name: "Ramesh Thapa",
        phone: "9801234567",
        vehicle: "Honda Dio",
        vehicleNumber: "BA 12 PA 3456",
        status: "Available",
        deliveries: 24,
        rating: 4.8
    },
    {
        id: 2,
        name: "Suman Gurung",
        phone: "9812345678",
        vehicle: "Yamaha Ray ZR",
        vehicleNumber: "BA 5 PA 7890",
        status: "Busy",
        deliveries: 31,
        rating: 4.7
    },
    {
        id: 3,
        name: "Nabin Rai",
        phone: "9823456789",
        vehicle: "Honda Shine",
        vehicleNumber: "BA 8 PA 1234",
        status: "Offline",
        deliveries: 18,
        rating: 4.6
    }
];


/* =========================================
   LOAD RIDERS
========================================= */

function loadRiders() {

    const savedRiders =
        localStorage.getItem(RIDERS_KEY);


    if (!savedRiders) {

        riders = sampleRiders;

        saveRiders();

        return;

    }


    try {

        riders = JSON.parse(savedRiders);

        if (!Array.isArray(riders)) {
            riders = [];
        }

    } catch (error) {

        console.error(
            "Could not read riders:",
            error
        );

        riders = [];

    }

}


/* =========================================
   SAVE RIDERS
========================================= */

function saveRiders() {

    localStorage.setItem(
        RIDERS_KEY,
        JSON.stringify(riders)
    );

}


/* =========================================
   RENDER RIDERS
========================================= */

function renderRiders(riderData = riders) {

    const riderList =
        document.getElementById("rider-list");

    const emptyRiders =
        document.getElementById("empty-riders");

    const riderCount =
        document.getElementById("rider-count");


    if (!riderList) {
        return;
    }


    riderList.innerHTML = "";


    /* Update count */

    if (riderCount) {

        riderCount.textContent =
            riderData.length;

    }


    /* Empty state */

    if (riderData.length === 0) {

        riderList.style.display = "none";

        if (emptyRiders) {
            emptyRiders.style.display = "block";
        }

        return;

    }


    riderList.style.display = "grid";

    if (emptyRiders) {
        emptyRiders.style.display = "none";
    }


    /* Create cards */

    riderData.forEach(rider => {

        riderList.appendChild(
            createRiderCard(rider)
        );

    });

}


/* =========================================
   CREATE RIDER CARD
========================================= */

function createRiderCard(rider) {

    const card =
        document.createElement("article");

    card.className = "rider-card";


    const firstLetter =
        rider.name
            ? rider.name.charAt(0).toUpperCase()
            : "?";


    const statusClass =
        getStatusClass(rider.status);


    card.innerHTML = `

        <div class="rider-card-top">

            <div class="rider-avatar">

                ${escapeHTML(firstLetter)}

            </div>


            <div class="rider-card-name">

                <h4>
                    ${escapeHTML(rider.name)}
                </h4>

                <p>
                    Delivery Rider
                </p>

            </div>


            <span class="rider-status ${statusClass}">

                ${escapeHTML(rider.status)}

            </span>

        </div>


        <div class="rider-info">

            <div class="rider-info-row">

                <i class="fa-solid fa-phone"></i>

                <span>
                    ${escapeHTML(rider.phone)}
                </span>

            </div>


            <div class="rider-info-row">

                <i class="fa-solid fa-motorcycle"></i>

                <span>
                    ${escapeHTML(rider.vehicle)}
                </span>

            </div>


            <div class="rider-info-row">

                <i class="fa-solid fa-id-card"></i>

                <span>
                    ${escapeHTML(rider.vehicleNumber)}
                </span>

            </div>

        </div>


        <div class="rider-stats">

            <div class="rider-stat">

                <small>
                    Deliveries
                </small>

                <strong>
                    ${Number(rider.deliveries) || 0}
                </strong>

            </div>


            <div class="rider-stat">

                <small>
                    Rating
                </small>

                <strong>
                    ${Number(rider.rating || 0).toFixed(1)}
                    <i class="fa-solid fa-star"
                       style="color: var(--gold-finger); font-size: .75rem;">
                    </i>
                </strong>

            </div>

        </div>


        <div class="rider-actions">

            <button
                type="button"
                class="rider-action-btn view-rider-btn"
                data-action="view"
            >
                View
            </button>


            <button
                type="button"
                class="rider-action-btn edit-rider-btn"
                data-action="edit"
            >
                Edit
            </button>


            <button
                type="button"
                class="rider-action-btn delete-rider-btn"
                data-action="delete"
            >
                Delete
            </button>

        </div>

    `;


    /* View */

    card.querySelector(
        '[data-action="view"]'
    ).addEventListener("click", function() {

        openDetailsModal(rider);

    });


    /* Edit */

    card.querySelector(
        '[data-action="edit"]'
    ).addEventListener("click", function() {

        openEditModal(rider);

    });


    /* Delete */

    card.querySelector(
        '[data-action="delete"]'
    ).addEventListener("click", function() {

        deleteRider(rider.id);

    });


    return card;
}


/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

    switch (status) {

        case "Available":
            return "status-available";

        case "Busy":
            return "status-busy";

        case "Offline":
            return "status-offline";

        default:
            return "status-offline";

    }

}


/* =========================================
   SEARCH AND FILTER
========================================= */

function filterRiders() {

    const searchInput =
        document.getElementById("rider-search");

    const statusFilter =
        document.getElementById("status-filter");


    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    const filteredRiders =
        riders.filter(rider => {

            const matchesSearch =
                rider.name.toLowerCase().includes(searchTerm) ||
                rider.phone.toLowerCase().includes(searchTerm) ||
                rider.vehicle.toLowerCase().includes(searchTerm) ||
                rider.vehicleNumber.toLowerCase().includes(searchTerm);


            const matchesStatus =
                selectedStatus === "All" ||
                rider.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    renderRiders(filteredRiders);

}


/* =========================================
   OPEN ADD MODAL
========================================= */

function openAddModal() {

    editingRiderId = null;


    const modal =
        document.getElementById("rider-modal");

    const title =
        document.getElementById("modal-title");

    const form =
        document.getElementById("rider-form");


    if (!modal || !form) {
        return;
    }


    title.textContent = "Add New Rider";


    form.reset();


    document.getElementById("rider-status").value =
        "Available";


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================
   OPEN EDIT MODAL
========================================= */

function openEditModal(rider) {

    editingRiderId = rider.id;


    const modal =
        document.getElementById("rider-modal");

    const title =
        document.getElementById("modal-title");


    document.getElementById("rider-id").value =
        rider.id;

    document.getElementById("rider-name").value =
        rider.name;

    document.getElementById("rider-phone").value =
        rider.phone;

    document.getElementById("rider-vehicle").value =
        rider.vehicle;

    document.getElementById("vehicle-number").value =
        rider.vehicleNumber;

    document.getElementById("rider-status").value =
        rider.status;


    title.textContent = "Edit Rider";


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================
   CLOSE FORM MODAL
========================================= */

function closeRiderModal() {

    const modal =
        document.getElementById("rider-modal");

    if (!modal) {
        return;
    }


    modal.classList.remove("active");

    document.body.style.overflow = "";

    editingRiderId = null;

}


/* =========================================
   SAVE RIDER
========================================= */

function saveRider(event) {

    event.preventDefault();


    const name =
        document.getElementById("rider-name").value.trim();

    const phone =
        document.getElementById("rider-phone").value.trim();

    const vehicle =
        document.getElementById("rider-vehicle").value.trim();

    const vehicleNumber =
        document.getElementById("vehicle-number").value.trim();

    const status =
        document.getElementById("rider-status").value;


    if (!name || !phone || !vehicle || !vehicleNumber) {

        alert("Please fill in all rider details.");

        return;

    }


    /* Editing existing rider */

    if (editingRiderId !== null) {

        const rider =
            riders.find(
                item => item.id === editingRiderId
            );


        if (rider) {

            rider.name = name;
            rider.phone = phone;
            rider.vehicle = vehicle;
            rider.vehicleNumber = vehicleNumber;
            rider.status = status;

        }


        saveRiders();

        closeRiderModal();

        filterRiders();

        alert("Rider updated successfully.");

        return;

    }


    /* Add new rider */

    const newId =
        riders.length > 0
            ? Math.max(...riders.map(rider => Number(rider.id) || 0)) + 1
            : 1;


    const newRider = {

        id: newId,

        name: name,

        phone: phone,

        vehicle: vehicle,

        vehicleNumber: vehicleNumber,

        status: status,

        deliveries: 0,

        rating: 0

    };


    riders.push(newRider);


    saveRiders();

    closeRiderModal();

    filterRiders();


    alert("Rider added successfully.");

}


/* =========================================
   DELETE RIDER
========================================= */

function deleteRider(id) {

    const rider =
        riders.find(
            item => item.id === id
        );


    if (!rider) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${rider.name}?`
        );


    if (!confirmed) {
        return;
    }


    riders =
        riders.filter(
            item => item.id !== id
        );


    saveRiders();

    filterRiders();


    alert("Rider deleted successfully.");

}


/* =========================================
   OPEN DETAILS MODAL
========================================= */

function openDetailsModal(rider) {

    const modal =
        document.getElementById(
            "rider-details-modal"
        );

    const details =
        document.getElementById(
            "rider-details"
        );


    if (!modal || !details) {
        return;
    }


    const firstLetter =
        rider.name
            ? rider.name.charAt(0).toUpperCase()
            : "?";


    const statusClass =
        getStatusClass(rider.status);


    details.innerHTML = `

        <div class="rider-details-header">

            <div class="rider-details-avatar">

                ${escapeHTML(firstLetter)}

            </div>


            <div>

                <h4>
                    ${escapeHTML(rider.name)}
                </h4>

                <p>
                    Delivery Rider
                </p>

                <span class="rider-status ${statusClass}">
                    ${escapeHTML(rider.status)}
                </span>

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
                        ${escapeHTML(rider.phone)}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-motorcycle"></i>

                <div>

                    <small>
                        Vehicle
                    </small>

                    <strong>
                        ${escapeHTML(rider.vehicle)}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-id-card"></i>

                <div>

                    <small>
                        Vehicle Number
                    </small>

                    <strong>
                        ${escapeHTML(rider.vehicleNumber)}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-box"></i>

                <div>

                    <small>
                        Deliveries
                    </small>

                    <strong>
                        ${Number(rider.deliveries) || 0}
                    </strong>

                </div>

            </div>


            <div class="details-row">

                <i class="fa-solid fa-star"></i>

                <div>

                    <small>
                        Rating
                    </small>

                    <strong>
                        ${Number(rider.rating || 0).toFixed(1)}
                    </strong>

                </div>

            </div>


        </div>

    `;


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================
   CLOSE DETAILS MODAL
========================================= */

function closeDetailsModal() {

    const modal =
        document.getElementById(
            "rider-details-modal"
        );


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


    hamburger.addEventListener(
        "click",
        function(event) {

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
                function() {

                    mobileMenu.classList.remove(
                        "mobile-menu-active"
                    );

                }
            );

        });

}


/* =========================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================= */

function setupModalOutsideClick() {

    const riderModal =
        document.getElementById("rider-modal");

    const detailsModal =
        document.getElementById(
            "rider-details-modal"
        );


    if (riderModal) {

        riderModal.addEventListener(
            "click",
            function(event) {

                if (event.target === riderModal) {

                    closeRiderModal();

                }

            }
        );

    }


    if (detailsModal) {

        detailsModal.addEventListener(
            "click",
            function(event) {

                if (event.target === detailsModal) {

                    closeDetailsModal();

                }

            }
        );

    }

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadRiders();

        renderRiders();


        /* Search */

        const searchInput =
            document.getElementById(
                "rider-search"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterRiders
            );

        }


        /* Status filter */

        const statusFilter =
            document.getElementById(
                "status-filter"
            );

        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterRiders
            );

        }


        /* Add rider */

        const addButton =
            document.getElementById(
                "add-rider-btn"
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                openAddModal
            );

        }


        /* Rider form */

        const riderForm =
            document.getElementById(
                "rider-form"
            );

        if (riderForm) {

            riderForm.addEventListener(
                "submit",
                saveRider
            );

        }


        /* Close form */

        const closeButton =
            document.getElementById(
                "close-rider-modal"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeRiderModal
            );

        }


        /* Cancel */

        const cancelButton =
            document.getElementById(
                "cancel-rider-btn"
            );

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeRiderModal
            );

        }


        /* Close details */

        const closeDetailsButton =
            document.getElementById(
                "close-details-modal"
            );

        if (closeDetailsButton) {

            closeDetailsButton.addEventListener(
                "click",
                closeDetailsModal
            );

        }


        /* Outside click */

        setupModalOutsideClick();


        /* Escape key */

        document.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Escape") {

                    closeRiderModal();

                    closeDetailsModal();

                }

            }
        );


        /* Mobile menu */

        setupMobileMenu();

    }
);