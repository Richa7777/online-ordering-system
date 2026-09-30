// ========================================
// QUICK BITES CUSTOMER UTILITIES
// Session/database based - no localStorage
// ========================================

(function () {

    let memoryCart = [];

    function getCart() {
        return memoryCart;
    }

    function saveCart(cart) {
        memoryCart = Array.isArray(cart) ? cart : [];
        updateCartBadge(memoryCart);
    }

    function clearCart() {
        memoryCart = [];
        updateCartBadge([]);
    }

    function getOrders() {
        return [];
    }

    function saveOrders(orders) {
        // Orders are stored in the database.
        // This function is kept only for compatibility.
    }

    function getCustomer(key, fallback = "") {
        // Customer information comes from /api/auth/me.
        return fallback;
    }

    function setCustomer(data) {
        // Customer information is stored in the database/session.
    }

    function parsePrice(price) {
        return Number(
            String(price)
                .replace("Rs.", "")
                .replace(/,/g, "")
        ) || 0;
    }

    function getImagePath(image) {
        if (!image) {
            return "";
        }

        return image.startsWith("../")
            ? image
            : `../public/${image}`;
    }

    function getAddress(order) {
        let address = order.address || "Not available";

        if (order.city) {
            address += `, ${order.city}`;
        }

        return address;
    }

    function showMessage(element, text, color) {
        if (!element) {
            return;
        }

        element.textContent = text;
        element.style.color = color;
    }

    function updateCartBadge(cart = memoryCart) {
        const cartValue = document.querySelector(".cart-value");

        if (!cartValue) {
            return;
        }

        const totalItems = cart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );

        cartValue.textContent = totalItems;
    }

    function setupMobileMenu() {
        const hamburger = document.querySelector(".hamburger");
        const mobileMenu = document.querySelector(".mobile-menu");

        if (!hamburger || !mobileMenu) {
            return;
        }

        hamburger.addEventListener("click", function (event) {
            event.preventDefault();

            mobileMenu.classList.toggle("mobile-menu-active");

            const icon = hamburger.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-xmark");
            }
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("mobile-menu-active");
            });
        });
    }

    window.quickBites = {
        getCart,
        saveCart,
        clearCart,
        getOrders,
        saveOrders,
        getCustomer,
        setCustomer,
        parsePrice,
        getImagePath,
        getAddress,
        showMessage,
        updateCartBadge,
        setupMobileMenu
    };

    setupMobileMenu();
    updateCartBadge();

})();
