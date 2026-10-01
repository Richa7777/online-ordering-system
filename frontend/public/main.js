var swiper = new Swiper('.mySwiper', {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');
const orderNowBtn = document.querySelector('#order-now-btn');

const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';

const requireLogin = () => {
    localStorage.setItem('redirectAfterLogin', window.location.pathname.split('/').pop() || 'index.html');
    window.location.href = 'login.html';
};

cartIcon.addEventListener('click', () => cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'));
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu-active');
    bars.classList.toggle('fa-bars');
    bars.classList.toggle('fa-xmark');
});

orderNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
        requireLogin();
        return;
    }
    document.querySelector('.card-list').scrollIntoView({ behavior: 'smooth' });
});


let productList = [];
let cartProduct = [];

const updateTotal = ()=>{
    let totalPrice = 0;
    let totalQuantity = 0;
    document.querySelectorAll('.item').forEach(item =>{
        const quantity = parseInt(item.querySelector('.quantity-value').textContent);
        const price = parseFloat(item.querySelector('.item-total').textContent.replace('Rs.',''));
        totalPrice += price;
        totalQuantity += quantity;
    });

    cartTotal.textContent = `Rs.${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
}

const showCards = () => {

    productList.forEach(product => {

        const orderCard = document.createElement('div');
        orderCard.classList.add('food-card');

        orderCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn card-btn">Add to Cart</a>
        `;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isLoggedIn()) {
                requireLogin();
                return;
            }
            addToCart(product);
        });
    });
};



const addToCart = (product) => {

    const existingProduct = cartProduct.find(item => item.id === product.id);
    if (existingProduct) {
        alert('Item already in your cart!');
        return;
    }

    cartProduct.push(product);

    let quantity = 1;
    let price = parseFloat(product.price.replace('Rs.', ''));

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
    <div class="item-image">
        <img src="${product.image}">
    </div>

    <div class="detail">
        <h4>${product.name}</h4>
        <h4 class="item-total">${product.price}</h4>
    </div>

    <div class="flex">
        <a href="#" class="quantity-btn minus">
            <i class="fa-solid fa-minus"></i>
        </a>

        <h4 class="quantity-value">${quantity}</h4>

        <a href="#" class="quantity-btn plus">
            <i class="fa-solid fa-plus"></i>
        </a>
    </div>
    `;

    cartList.appendChild(cartItem);
    updateTotal();

    const plusBtn = cartItem.querySelector('.plus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');
    const minusBtn = cartItem.querySelector('.minus');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `Rs.${(price * quantity).toFixed(2)}`;
        updateTotal();
    });

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `Rs.${(price * quantity).toFixed(2)}`;
            updateTotal();
        } 
        else {
            cartItem.classList.add('slide-out')
            setTimeout(() => {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotal(); 
            }, 300)
            
        }
    });
}




const initApp = () => {

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productList = data;
            showCards();
        })
}

initApp();