const API_BASE_URL = "http://127.0.0.1:8080";


// ========================================
// ELEMENTS
// ========================================

const form = document.querySelector("#edit-profile-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const message = document.querySelector("#profile-message");


// ========================================
// LOAD CUSTOMER DATA
// ========================================

async function loadCustomerData() {

    try {

        // ----------------------------------------
        // Get logged-in user from backend
        // ----------------------------------------

        const userResponse = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (!userResponse.ok) {

            if (
                userResponse.status === 401 ||
                userResponse.status === 403
            ) {

                alert(
                    "Your session has expired. Please sign in again."
                );

                window.location.href =
                    "../public/login.html";

                return;
            }

            throw new Error(
                `User request failed: ${userResponse.status}`
            );
        }


        const customer = await userResponse.json();


        console.log(
            "Customer loaded from database:",
            customer
        );


        // ----------------------------------------
        // Fill name and email
        // ----------------------------------------

        nameInput.value =
            customer.name || "";

        emailInput.value =
            customer.email || "";


        // ----------------------------------------
        // Load address information
        // ----------------------------------------

        const addressResponse = await fetch(
            `${API_BASE_URL}/api/addresses/user/${customer.id}`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (addressResponse.ok) {

            const addresses =
                await addressResponse.json();


            console.log(
                "Addresses loaded from database:",
                addresses
            );


            // Use the first saved address
            // for the profile form.

            if (
                Array.isArray(addresses) &&
                addresses.length > 0
            ) {

                const address =
                    addresses[0];


                addressInput.value =
                    address.addressLine ||
                    address.address_line ||
                    "";


                cityInput.value =
                    address.city ||
                    "";


                phoneInput.value =
                    address.phone ||
                    "";
            }
        }


    } catch (error) {

        console.error(
            "Error loading customer profile:",
            error
        );

        quickBites.showMessage(
            message,
            "Could not load your profile.",
            "red"
        );
    }
}


// ========================================
// SAVE PROFILE
// ========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const address =
            addressInput.value.trim();

        const city =
            cityInput.value.trim();


        // ----------------------------------------
        // Basic validation
        // ----------------------------------------

        if (!name || !email) {

            quickBites.showMessage(
                message,
                "Please enter your name and email.",
                "red"
            );

            return;
        }


        try {

            // ====================================
            // UPDATE USER
            // ====================================

            const userResponse =
                await fetch(
                    `${API_BASE_URL}/api/auth/me`,
                    {
                        method: "PUT",
                        credentials: "include",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email
                        })
                    }
                );


            if (!userResponse.ok) {

                const errorText =
                    await userResponse.text();

                console.error(
                    "User update failed:",
                    errorText
                );

                throw new Error(
                    "Could not update user information."
                );
            }


            const updatedUser =
                await userResponse.json();


            console.log(
                "User updated:",
                updatedUser
            );


            // ====================================
            // UPDATE ADDRESS
            // ====================================

            /*
             * Phone, address and city belong to the
             * addresses table, not the users table.
             *
             * We first get the customer's existing
             * addresses.
             */

            const addressResponse =
                await fetch(
                    `${API_BASE_URL}/api/addresses/user/${updatedUser.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (!addressResponse.ok) {

                throw new Error(
                    "Could not load address information."
                );
            }


            const addresses =
                await addressResponse.json();


            // ------------------------------------
            // Prepare address data
            // ------------------------------------

            const addressData = {

                userId: updatedUser.id,

                addressLine: address,

                city: city,

                phone: phone
            };


            // ====================================
            // EXISTING ADDRESS → UPDATE
            // ====================================

            if (
                Array.isArray(addresses) &&
                addresses.length > 0
            ) {

                const existingAddress =
                    addresses[0];


                const updateAddressResponse =
                    await fetch(
                        `${API_BASE_URL}/api/addresses/${existingAddress.addressId}`,
                        {
                            method: "PUT",
                            credentials: "include",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify(
                                    addressData
                                )
                        }
                    );


                if (!updateAddressResponse.ok) {

                    const errorText =
                        await updateAddressResponse.text();

                    console.error(
                        "Address update failed:",
                        errorText
                    );

                    throw new Error(
                        "Could not update address."
                    );
                }

            }


            // ====================================
            // NO ADDRESS → CREATE
            // ====================================

            else if (
                address ||
                city ||
                phone
            ) {

                const createAddressResponse =
                    await fetch(
                        `${API_BASE_URL}/api/addresses`,
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify(
                                    addressData
                                )
                        }
                    );


                if (!createAddressResponse.ok) {

                    const errorText =
                        await createAddressResponse.text();

                    console.error(
                        "Address creation failed:",
                        errorText
                    );

                    throw new Error(
                        "Could not save address."
                    );
                }
            }


            // ====================================
            // SUCCESS
            // ====================================

            quickBites.showMessage(
                message,
                "Profile updated successfully!",
                "green"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "profile.html";

                },
                1000
            );


        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            quickBites.showMessage(
                message,
                error.message ||
                    "Could not update your profile.",
                "red"
            );
        }

    }
);


// ========================================
// START
// ========================================

loadCustomerData();