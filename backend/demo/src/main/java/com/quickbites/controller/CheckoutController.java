package com.quickbites.controller;

import com.quickbites.entity.*;
import com.quickbites.repository.*;
import jakarta.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin
public class CheckoutController {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;
    private final FoodItemRepository foodItemRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final PaymentRepository paymentRepository;

    public CheckoutController(
            UserRepository userRepository,
            CartRepository cartRepository,
            CartItemsRepository cartItemsRepository,
            FoodItemRepository foodItemRepository,
            AddressRepository addressRepository,
            OrderRepository orderRepository,
            OrderItemsRepository orderItemsRepository,
            PaymentRepository paymentRepository) {

        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.foodItemRepository = foodItemRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.paymentRepository = paymentRepository;
    }


    // ========================================
    // PLACE ORDER
    // ========================================

    @PostMapping
    @Transactional
    public ResponseEntity<?> checkout(
            @RequestBody CheckoutRequest request,
            Authentication authentication) {

        // ========================================
        // CHECK LOGIN
        // ========================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body("Please login first.");
        }


        // ========================================
        // GET LOGGED-IN USER FROM SESSION
        // ========================================

        User user =
                userRepository
                        .findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Logged-in user not found"
                                ));


        // ========================================
        // MAKE SURE CUSTOMER
        // ========================================

        if (user.getRole() != User.Role.CUSTOMER) {

            return ResponseEntity
                    .status(403)
                    .body("Only customers can place orders.");
        }


        // ========================================
        // VALIDATE DELIVERY INFORMATION
        // ========================================

        if (request.addressLine == null ||
                request.addressLine.isBlank() ||
                request.city == null ||
                request.city.isBlank() ||
                request.phone == null ||
                request.phone.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Please complete all delivery details.");
        }


        // ========================================
        // VALIDATE PAYMENT METHOD
        // ========================================

        Payment.PaymentMethod paymentMethod;

        try {

            String method =
                    request.paymentMethod
                            .trim()
                            .toUpperCase()
                            .replace(" ", "_");

            if (method.equals("CASH_ON_DELIVERY")) {
                method = "CASH";
            }

            if (method.equals("ONLINE_PAYMENT")) {
                method = "ONLINE";
            }

            paymentMethod =
                    Payment.PaymentMethod.valueOf(method);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid payment method.");
        }


        // ========================================
        // GET CUSTOMER CART
        // ========================================

        Cart cart =
                cartRepository
                        .findByUserId(user.getUserId())
                        .orElse(null);


        if (cart == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Your cart is empty.");
        }


        List<CartItems> cartItems =
                cartItemsRepository
                        .findItemsByCartId(
                                cart.getCartId()
                        );


        if (cartItems.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Your cart is empty.");
        }


        // ========================================
        // CALCULATE TOTAL FROM DATABASE
        // ========================================

        BigDecimal subtotal =
                BigDecimal.ZERO;


        // ========================================
        // CREATE / UPDATE ADDRESS
        // ========================================

        List<Address> addresses =
                addressRepository
                        .findByUserId(
                                user.getUserId()
                        );


        Address address;


        if (addresses.isEmpty()) {

            address = new Address();

            address.setUserId(
                    user.getUserId()
            );

        } else {

            address = addresses.get(0);
        }


        address.setAddressLine(
                request.addressLine
        );

        address.setCity(
                request.city
        );

        address.setPhone(
                request.phone
        );


        Address savedAddress =
                addressRepository.save(address);


        // ========================================
        // CREATE ORDER
        // ========================================

        Order order = new Order();

        order.setUser_id(
                user.getUserId()
        );

        order.setAddress_id(
                savedAddress.getAddressId()
        );

        order.setOrder_status(
                Order.OrderStatus.PLACED
        );

        order.setOrder_date(
                LocalDateTime.now()
        );


        // ========================================
        // CREATE ORDER ITEMS
        // ========================================

        for (CartItems cartItem : cartItems) {

            FoodItem food =
                    foodItemRepository
                            .findById(
                                    cartItem.getFood_id()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Food item not found: "
                                                    + cartItem.getFood_id()
                                    ));


            if (!Boolean.TRUE.equals(
                    food.getIsAvailable()
            )) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                food.getFoodName()
                                        + " is no longer available."
                        );
            }


            BigDecimal price =
                    food.getPrice();


            BigDecimal itemSubtotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            subtotal =
                    subtotal.add(
                            itemSubtotal
                    );
        }


        // ========================================
        // DELIVERY FEE
        // ========================================

        BigDecimal deliveryFee =
                subtotal.compareTo(
                        BigDecimal.ZERO
                ) > 0
                        ? BigDecimal.valueOf(50)
                        : BigDecimal.ZERO;


        BigDecimal totalAmount =
                subtotal.add(
                        deliveryFee
                );


        order.setSubtotal(subtotal);

        order.setDelivery_fee(
                deliveryFee
        );

        order.setTotal_amount(
                totalAmount
        );


        Order savedOrder =
                orderRepository.save(order);


        // ========================================
        // SAVE ORDER ITEMS
        // ========================================

        for (CartItems cartItem : cartItems) {

            FoodItem food =
                    foodItemRepository
                            .findById(
                                    cartItem.getFood_id()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Food item not found"
                                    ));


            BigDecimal price =
                    food.getPrice();


            BigDecimal itemSubtotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            OrderItems orderItem =
                    new OrderItems();


            orderItem.setOrder_id(
                    savedOrder.getOrder_id()
            );

            orderItem.setFood_id(
                    food.getFoodId()
            );

            orderItem.setFood_name(
                    food.getFoodName()
            );

            orderItem.setPrice(
                    price
            );

            orderItem.setQuantity(
                    cartItem.getQuantity()
            );

            orderItem.setSubtotal(
                    itemSubtotal
            );


            orderItemsRepository.save(
                    orderItem
            );
        }


        // ========================================
        // CREATE PAYMENT
        // ========================================

        Payment payment =
                new Payment();


        payment.setOrder_id(
                savedOrder.getOrder_id()
        );

        payment.setPayment_method(
                paymentMethod
        );

        payment.setPayment_status(
                Payment.PaymentStatus.PENDING
        );

        payment.setAmount(
                totalAmount
        );

        payment.setPayment_date(
                LocalDateTime.now()
        );


        paymentRepository.save(
                payment
        );


        // ========================================
        // CLEAR DATABASE CART
        // ========================================

        cartItemsRepository.deleteItemsByCartId(
                cart.getCartId()
        );


        // ========================================
        // RETURN ORDER
        // ========================================

        return ResponseEntity.ok(
                savedOrder
        );
    }


    // ========================================
    // REQUEST DTO
    // ========================================

    public static class CheckoutRequest {

        private String addressLine;

        private String city;

        private String phone;

        private String paymentMethod;


        public CheckoutRequest() {
        }


        public String getAddressLine() {
            return addressLine;
        }


        public void setAddressLine(
                String addressLine) {

            this.addressLine = addressLine;
        }


        public String getCity() {
            return city;
        }


        public void setCity(String city) {

            this.city = city;
        }


        public String getPhone() {
            return phone;
        }


        public void setPhone(String phone) {

            this.phone = phone;
        }


        public String getPaymentMethod() {
            return paymentMethod;
        }


        public void setPaymentMethod(
                String paymentMethod) {

            this.paymentMethod = paymentMethod;
        }
    }
}