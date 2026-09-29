// /* =========================================
//    RIDER PROFILE
// ========================================= */


// /* =========================================
//    RIDER DATA
// ========================================= */

// const rider = {

//     id: "RD1001",

//     name: "Rider Name",

//     email: "rider@quickbites.com",

//     phone: "9800000000",

//     vehicle: "Motorcycle",

//     joined: "10 January 2026"

// };



// /* =========================================
//    DISPLAY RIDER INFORMATION
// ========================================= */

// document.getElementById("rider-name").textContent =
//     rider.name;

// document.getElementById("rider-id").textContent =
//     rider.id;

// document.getElementById("rider-email").textContent =
//     rider.email;

// document.getElementById("rider-phone").textContent =
//     rider.phone;

// document.getElementById("rider-vehicle").textContent =
//     rider.vehicle;

// document.getElementById("rider-joined").textContent =
//     rider.joined;



// /* =========================================
//    HAMBURGER MENU
// ========================================= */

// const profileHamburger =
//     document.querySelector(".hamburger");

// const profileMobileMenu =
//     document.querySelector(".mobile-menu");


// if (profileHamburger && profileMobileMenu) {

//     profileHamburger.addEventListener(
//         "click",
//         function (event) {

//             event.preventDefault();

//             profileMobileMenu.classList.toggle(
//                 "mobile-menu-active"
//             );

//             const icon =
//                 profileHamburger.querySelector("i");

//             icon.classList.toggle("fa-bars");
//             icon.classList.toggle("fa-xmark");

//         }
//     );


//     const mobileLinks =
//         profileMobileMenu.querySelectorAll("a");


//     mobileLinks.forEach(link => {

//         link.addEventListener(
//             "click",
//             function () {

//                 profileMobileMenu.classList.remove(
//                     "mobile-menu-active"
//                 );

//             }
//         );

//     });

// }


// /* =========================================
//    LOGOUT
// ========================================= */

// function logout() {

//     window.location.href =
//         "../public/index.html";

// }


// const logoutButton =
//     document.getElementById("logout-btn");

// const mobileLogoutButton =
//     document.getElementById("mobile-logout-btn");

// const footerLogout =
//     document.getElementById("footer-logout");


// if (logoutButton) {

//     logoutButton.addEventListener(
//         "click",
//         function (event) {

//             event.preventDefault();

//             logout();

//         }
//     );

// }


// if (mobileLogoutButton) {

//     mobileLogoutButton.addEventListener(
//         "click",
//         function (event) {

//             event.preventDefault();

//             logout();

//         }
//     );

// }


// if (footerLogout) {

//     footerLogout.addEventListener(
//         "click",
//         function (event) {

//             event.preventDefault();

//             logout();

//         }
//     );

// }



// /* =========================================
//    EDIT PROFILE
// ========================================= */
// /* =========================================
//    EDIT PROFILE
// ========================================= */

// document.addEventListener("DOMContentLoaded", function () {

//     const editProfileButton = document.getElementById("edit-profile-btn");
//     const cancelEditButton = document.getElementById("cancel-edit-btn");

//     const profileView = document.getElementById("profile-view");
//     const profileEdit = document.getElementById("profile-edit");


//     // EDIT PROFILE BUTTON
//     editProfileButton.onclick = function (event) {

//         event.preventDefault();

//         console.log("Edit button clicked");

//         profileView.style.display = "none";
//         profileEdit.style.display = "block";

//     };


//     // CANCEL BUTTON
//     cancelEditButton.onclick = function () {

//         profileEdit.style.display = "none";
//         profileView.style.display = "block";

//     };

// });

/* =========================================
   RIDER PROFILE
========================================= */


/* =========================================
   RIDER DATA
========================================= */

const rider = {

    id: "RD1001",

    name: "Rider Name",

    email: "rider@quickbites.com",

    phone: "9800000000",

    vehicle: "Motorcycle",

    joined: "10 January 2026"

};


/* =========================================
   DISPLAY RIDER INFORMATION
========================================= */

document.getElementById("rider-name").textContent =
    rider.name;

document.getElementById("rider-id").textContent =
    rider.id;

document.getElementById("rider-email").textContent =
    rider.email;

document.getElementById("rider-phone").textContent =
    rider.phone;

document.getElementById("rider-vehicle").textContent =
    rider.vehicle;

document.getElementById("rider-joined").textContent =
    rider.joined;


/* =========================================
   HAMBURGER MENU
========================================= */

const profileHamburger =
    document.querySelector(".hamburger");

const profileMobileMenu =
    document.querySelector(".mobile-menu");


if (profileHamburger && profileMobileMenu) {

    profileHamburger.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            profileMobileMenu.classList.toggle(
                "mobile-menu-active"
            );

            const profileMenuIcon =
                profileHamburger.querySelector("i");

            if (profileMenuIcon) {

                profileMenuIcon.classList.toggle(
                    "fa-bars"
                );

                profileMenuIcon.classList.toggle(
                    "fa-xmark"
                );

            }

        }
    );


    const profileMobileLinks =
        profileMobileMenu.querySelectorAll("a");


    profileMobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                profileMobileMenu.classList.remove(
                    "mobile-menu-active"
                );

            }
        );

    });

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    window.location.href =
        "../public/index.html";

}


const profileLogoutButton =
    document.getElementById("logout-btn");

const profileMobileLogoutButton =
    document.getElementById("mobile-logout-btn");

const profileFooterLogout =
    document.getElementById("footer-logout");


if (profileLogoutButton) {

    profileLogoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


if (profileMobileLogoutButton) {

    profileMobileLogoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


if (profileFooterLogout) {

    profileFooterLogout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


/* =========================================
   EDIT PROFILE
========================================= */

const editProfileButton =
    document.getElementById("edit-profile-btn");

const cancelEditButton =
    document.getElementById("cancel-edit-btn");

const profileView =
    document.getElementById("profile-view");

const profileEdit =
    document.getElementById("profile-edit");

const editProfileForm =
    document.getElementById("edit-profile-form");

const profileMessage =
    document.getElementById("profile-message");


/* =========================================
   OPEN EDIT PROFILE
========================================= */

if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            /* Hide profile view */

            if (profileView) {

                profileView.style.display =
                    "none";

            }


            /* Show edit form */

            if (profileEdit) {

                profileEdit.style.display =
                    "block";

            }


            /* Fill form with current data */

            const editName =
                document.getElementById("edit-name");

            const editEmail =
                document.getElementById("edit-email");

            const editPhone =
                document.getElementById("edit-phone");

            const editVehicle =
                document.getElementById("edit-vehicle");


            if (editName) {

                editName.value =
                    rider.name;

            }


            if (editEmail) {

                editEmail.value =
                    rider.email;

            }


            if (editPhone) {

                editPhone.value =
                    rider.phone;

            }


            if (editVehicle) {

                editVehicle.value =
                    rider.vehicle;

            }


            /* Clear previous message */

            if (profileMessage) {

                profileMessage.textContent = "";

                profileMessage.className =
                    "profile-message";

            }

        }
    );

}


/* =========================================
   CANCEL EDIT
========================================= */

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function () {

            /* Hide edit form */

            if (profileEdit) {

                profileEdit.style.display =
                    "none";

            }


            /* Show profile view */

            if (profileView) {

                profileView.style.display =
                    "block";

            }

        }
    );

}


/* =========================================
   SAVE PROFILE
========================================= */

if (editProfileForm) {

    editProfileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Get form values */

            const newName =
                document.getElementById("edit-name").value.trim();

            const newEmail =
                document.getElementById("edit-email").value.trim();

            const newPhone =
                document.getElementById("edit-phone").value.trim();

            const newVehicle =
                document.getElementById("edit-vehicle").value;


            /* Get passwords */

            const newPassword =
                document.getElementById("edit-password").value;

            const confirmPassword =
                document.getElementById(
                    "edit-confirm-password"
                ).value;


            /* =====================================
               VALIDATION
            ===================================== */

            if (
                newName === "" ||
                newEmail === "" ||
                newPhone === "" ||
                newVehicle === ""
            ) {

                showProfileMessage(
                    "Please fill in all required fields.",
                    "error"
                );

                return;

            }


            /* Check password */

            if (
                newPassword !== "" &&
                newPassword !== confirmPassword
            ) {

                showProfileMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            /* =====================================
               UPDATE RIDER DATA
            ===================================== */

            rider.name =
                newName;

            rider.email =
                newEmail;

            rider.phone =
                newPhone;

            rider.vehicle =
                newVehicle;


            /* =====================================
               UPDATE PROFILE VIEW
            ===================================== */

            document.getElementById(
                "rider-name"
            ).textContent =
                rider.name;


            document.getElementById(
                "rider-email"
            ).textContent =
                rider.email;


            document.getElementById(
                "rider-phone"
            ).textContent =
                rider.phone;


            document.getElementById(
                "rider-vehicle"
            ).textContent =
                rider.vehicle;


            /* =====================================
               SUCCESS MESSAGE
            ===================================== */

            showProfileMessage(
                "Profile updated successfully!",
                "success"
            );


            /* =====================================
               RETURN TO PROFILE AFTER SHORT DELAY
            ===================================== */

            setTimeout(
                function () {

                    if (profileEdit) {

                        profileEdit.style.display =
                            "none";

                    }

                    if (profileView) {

                        profileView.style.display =
                            "block";

                    }

                },
                1000
            );

        }
    );

}


/* =========================================
   PROFILE MESSAGE FUNCTION
========================================= */

function showProfileMessage(
    message,
    type
) {

    if (!profileMessage) {

        return;

    }


    profileMessage.textContent =
        message;


    profileMessage.className =
        "profile-message " + type;

}