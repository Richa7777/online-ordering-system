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

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart getCartById(Integer id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart updateCart(Integer id, Cart cartDetails) {
        Cart cart = getCartById(id);

        cart.setUserId(cartDetails.getUserId());

        return cartRepository.save(cart);
    }

    public void deleteCart(Integer id) {
        cartRepository.deleteById(id);
    }
}