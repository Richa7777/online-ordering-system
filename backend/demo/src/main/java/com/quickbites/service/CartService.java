
package com.quickbites.service;

import com.quickbites.entity.Cart;
import com.quickbites.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }


    // ========================================
    // GET ALL CARTS
    // ========================================

    public List<Cart> getAllCarts() {

        return cartRepository.findAll();
    }


    // ========================================
    // GET CART BY ID
    // ========================================

    public Cart getCartById(Integer id) {

        return cartRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));
    }


    // ========================================
    // GET CART BY USER ID
    // ========================================

    public Cart getCartByUserId(Integer userId) {

        return cartRepository.findByUserId(userId)
                .orElse(null);
    }


    // ========================================
    // GET OR CREATE CART
    // ========================================

    public Cart getOrCreateCart(Integer userId) {

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    Cart cart = new Cart();

                    cart.setUserId(userId);

                    return cartRepository.save(cart);
                });
    }


    // ========================================
    // CREATE CART
    // ========================================

    public Cart createCart(Cart cart) {

        return cartRepository.save(cart);
    }


    // ========================================
    // UPDATE CART
    // ========================================

    public Cart updateCart(
            Integer id,
            Cart cartDetails) {

        Cart cart = getCartById(id);

        cart.setUserId(
                cartDetails.getUserId()
        );

        return cartRepository.save(cart);
    }


    // ========================================
    // DELETE CART
    // ========================================

    public void deleteCart(Integer id) {

        cartRepository.deleteById(id);
    }
}
