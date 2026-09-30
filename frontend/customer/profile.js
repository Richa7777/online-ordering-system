// CUSTOMER PROFILE
// ========================================

const API_BASE_URL = "http://127.0.0.1:8080";


// ========================================
// LOAD CURRENT CUSTOMER FROM DATABASE
// ========================================

async function loadCustomerProfile() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        // ----------------------------------------
        // CHECK LOGIN SESSION
        // ----------------------------------------

        if (!response.ok) {

            if (response.status === 401 ||
                response.status === 403) {

                alert("Your session has expired. Please sign in again.");

                window.location.href =
                    "../public/login.html";

                return;
            }

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        // ----------------------------------------
        // GET USER DATA
        // ----------------------------------------

        const customer = await response.json();


        console.log(
            "Customer loaded from database:",
            customer
        );


        // ----------------------------------------
        // DISPLAY CUSTOMER DATA
        // ----------------------------------------

        document.querySelector(
            "#customer-name"
        ).textContent =
            customer.name || "Customer Name";


        document.querySelector(
            "#profile-name"
        ).textContent =
            customer.name || "Customer Name";


        document.querySelector(
            "#profile-email"
        ).textContent =
            customer.email || "customer@email.com";


        document.querySelector(
            "#profile-id"
        ).textContent =
            customer.id || "ID";


    } catch (error) {

        console.error(
            "Could not load customer profile:",
            error
        );

        alert(
            "Could not load your profile. Please make sure the backend is running."
        );
    }
}


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.querySelector("#logout-btn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();

            try {

                await fetch(
                    "http://127.0.0.1:8080/api/auth/logout",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

            } catch (error) {
                console.error("Logout error:", error);
            }

            window.location.href =
                "../public/index.html";
        }
    );
}


// ========================================
// START
// ========================================

loadCustomerProfile();
