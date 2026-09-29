/* =========================================
   RIDER DASHBOARD JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");


if (hamburger && mobileMenu) {

    hamburger.addEventListener("click", function (event) {

        event.preventDefault();

        mobileMenu.classList.toggle("mobile-menu-active");


        const icon = hamburger.querySelector("i");

        icon.classList.toggle("fa-bars");

        icon.classList.toggle("fa-xmark");

    });


    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileMenu.classList.remove(
                "mobile-menu-active"
            );

        });

    });

}


/* =========================================
   LOGOUT
========================================= */

const logoutBtn =
    document.querySelector("#logout-btn");

const mobileLogoutBtn =
    document.querySelector("#mobile-logout-btn");


function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (confirmLogout) {

        /*
         * Frontend-only for now.
         * Later this will clear the login
         * session when the backend is added.
         */

        window.location.href =
            "../public/index.html";

    }

}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


if (mobileLogoutBtn) {

    mobileLogoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}