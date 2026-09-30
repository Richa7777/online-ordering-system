package com.quickbites.controller;

import com.quickbites.entity.Cart;
import com.quickbites.entity.User;
import com.quickbites.service.AuthService;
import com.quickbites.service.CartService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(
            CartService cartService,
            AuthService authService) {

        this.cartService = cartService;
        this.authService = authService;
    }

    // ========================================
    // GET ALL CARTS
    // ========================================

    @GetMapping
    public List<Cart> getAllCarts() {
        return cartService.getAllCarts();
    }

    // ========================================
    // GET CART BY ID
    // ========================================

    @GetMapping("/{id}")
    public Cart getCartById(
            @PathVariable Integer id) {

        return cartService.getCartById(id);
    }

    // ========================================
    // GET CART BY USER ID
    // ========================================

    @GetMapping("/user/{userId}")
    public Cart getCartByUserId(
            @PathVariable Integer userId) {

        return cartService.getCartByUserId(userId);
    }

    // ========================================
    // GET OR CREATE CART FOR USER
    // ========================================

    @PostMapping("/user/{userId}")
    public Cart getOrCreateCart(
            @PathVariable Integer userId) {

        return cartService.getOrCreateCart(userId);
    }

    // ========================================
    // GET CURRENT USER'S CART
    // ========================================

    @GetMapping("/me")
    public Cart getMyCart(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        User user =
                authService.getUserByEmail(
                        authentication.getName()
                );

        return cartService.getCartByUserId(
                user.getUserId()
        );
    }

    // ========================================
    // GET OR CREATE CURRENT USER'S CART
    // ========================================

    @PostMapping("/me")
    public Cart getOrCreateMyCart(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        User user =
                authService.getUserByEmail(
                        authentication.getName()
                );

        return cartService.getOrCreateCart(
                user.getUserId()
        );
    }

    // ========================================
    // CREATE CART
    // ========================================

    @PostMapping
    public Cart createCart(
            @RequestBody Cart cart) {

        return cartService.createCart(cart);
    }

    // ========================================
    // UPDATE CART
    // ========================================

    @PutMapping("/{id}")
    public Cart updateCart(
            @PathVariable Integer id,
            @RequestBody Cart cart) {

        return cartService.updateCart(
                id,
                cart
        );
    }

    // ========================================
    // DELETE CART
    // ========================================

    @DeleteMapping("/{id}")
    public String deleteCart(
            @PathVariable Integer id) {

        cartService.deleteCart(id);

        return "Cart deleted successfully";
    }
}