/* =========================================
   QUICK BITES ADMIN - RIDERS
   Backend connected
========================================= */

const API_BASE_URL = "http://127.0.0.1:8080";

let riders = [];


/* =========================================
   LOAD RIDERS
========================================= */

async function loadRiders() {

    const riderList =
        document.getElementById("rider-list");

    const emptyRiders =
        document.getElementById("empty-riders");


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users/riders`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load riders: ${response.status}`
            );

        }


        riders =
            await response.json();


        console.log(
            "Riders loaded:",
            riders
        );


        /*
         * Render all riders.
         * filterRiders() also handles the
         * current search box value.
         */
        filterRiders();


    } catch (error) {

        console.error(
            "Rider loading error:",
            error
        );


        if (riderList) {

            riderList.innerHTML = "";

            riderList.style.display =
                "none";

        }


        if (emptyRiders) {

            emptyRiders.style.display =
                "block";


            const heading =
                emptyRiders.querySelector("h3");

            const paragraph =
                emptyRiders.querySelector("p");


            if (heading) {

                heading.textContent =
                    "Could Not Load Riders";

            }


            if (paragraph) {

                paragraph.textContent =
                    error.message;

            }

        }

    }

}


/* =========================================
   FILTER / SEARCH RIDERS
========================================= */

function filterRiders() {

    const searchInput =
        document.getElementById(
            "rider-search"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredRiders =
        riders.filter(function (rider) {

            const name =
                (rider.name || "")
                    .toLowerCase();


            const email =
                (rider.email || "")
                    .toLowerCase();


            const id =
                String(rider.id || "")
                    .toLowerCase();


            return (
                name.includes(searchTerm) ||
                email.includes(searchTerm) ||
                id.includes(searchTerm)
            );

        });


    renderRiders(filteredRiders);

}


/* =========================================
   RENDER RIDERS
========================================= */

function renderRiders(riderData) {

    const riderList =
        document.getElementById(
            "rider-list"
        );


    const emptyRiders =
        document.getElementById(
            "empty-riders"
        );


    const riderCount =
        document.getElementById(
            "rider-count"
        );


    if (!riderList) {

        return;

    }


    riderList.innerHTML = "";


    /* Update rider count */
    if (riderCount) {

        riderCount.textContent =
            riderData.length;

    }


    /* =====================================
       NO RIDERS
    ===================================== */

    if (riderData.length === 0) {

        riderList.style.display =
            "none";


        if (emptyRiders) {

            emptyRiders.style.display =
                "block";


            const heading =
                emptyRiders.querySelector("h3");

            const paragraph =
                emptyRiders.querySelector("p");


            if (heading) {

                heading.textContent =
                    riders.length === 0
                        ? "No Riders Found"
                        : "No Matching Riders";

            }


            if (paragraph) {

                paragraph.textContent =
                    riders.length === 0
                        ? "There are currently no registered riders."
                        : "No riders match your search.";

            }

        }


        return;

    }


    /* =====================================
       RIDERS FOUND
    ===================================== */

    riderList.style.display =
        "grid";


    if (emptyRiders) {

        emptyRiders.style.display =
            "none";

    }


    riderData.forEach(function (rider) {

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
        document.createElement(
            "article"
        );


    card.className =
        "rider-card";


    /* Get first letter for avatar */
    const firstLetter =
        rider.name
            ? rider.name
                .charAt(0)
                .toUpperCase()
            : "?";


    card.innerHTML = `

        <div class="rider-card-top">

            <div class="rider-avatar">

                ${escapeHTML(firstLetter)}

            </div>


            <div class="rider-card-name">

                <h4>
                    ${escapeHTML(
                        rider.name ||
                        "Unnamed Rider"
                    )}
                </h4>


                <p>
                    Delivery Rider
                </p>

            </div>


            <span class="rider-status available">

                Active

            </span>

        </div>


        <div class="rider-info">

            <div class="rider-info-row">

                <i class="fa-solid fa-envelope"></i>

                <span>
                    ${escapeHTML(
                        rider.email ||
                        "No email"
                    )}
                </span>

            </div>


            <div class="rider-info-row">

                <i class="fa-solid fa-id-card"></i>

                <span>
                    Rider #${escapeHTML(
                        rider.id
                    )}
                </span>

            </div>


            <div class="rider-info-row">

                <i class="fa-solid fa-user-tag"></i>

                <span>
                    ${escapeHTML(
                        rider.role ||
                        "RIDER"
                    )}
                </span>

            </div>

        </div>

    `;


    return card;

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "rider-search"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        filterRiders
    );

}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const hamburger =
        document.querySelector(
            ".hamburger"
        );


    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    if (
        !hamburger ||
        !mobileMenu
    ) {

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
        .forEach(function(link) {

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


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupSearch();

        setupMobileMenu();

        loadRiders();

    }
);