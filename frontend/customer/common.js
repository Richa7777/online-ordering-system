// ========================================
// QUICK BITES CUSTOMER UTILITIES
// ========================================

(function () {

    const CART_KEY = "quickBitesCart";
    const ORDERS_KEY = "quickBitesOrders";

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.error(`Could not read ${key}:`, error);
            return fallback;
        }
    }

    function saveJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getCart() {
        return readJSON(CART_KEY, []);
    }

    function saveCart(cart) {
        saveJSON(CART_KEY, cart);
        updateCartBadge(cart);
    }

    function clearCart() {
        localStorage.removeItem(CART_KEY);
        updateCartBadge([]);
    }

    function getOrders() {
        return readJSON(ORDERS_KEY, []);
    }

    function saveOrders(orders) {
        saveJSON(ORDERS_KEY, orders);
    }

    function getCustomer(key, fallback = "") {
        return localStorage.getItem(key) || fallback;
    }

    function setCustomer(data) {
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
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

    function updateCartBadge(cart = getCart()) {
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
