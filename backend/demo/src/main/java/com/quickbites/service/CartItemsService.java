package com.quickbites.service;

import com.quickbites.entity.CartItems;
import com.quickbites.repository.CartItemsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemsService {

    private final CartItemsRepository cartItemsRepository;

    public CartItemsService(CartItemsRepository cartItemsRepository) {
        this.cartItemsRepository = cartItemsRepository;
    }

    public List<CartItems> getAllCartItems() {
        return cartItemsRepository.findAll();
    }

    public CartItems getCartItemById(Integer id) {
        return cartItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
    }

    public CartItems createCartItem(CartItems cartItems) {
        return cartItemsRepository.save(cartItems);
    }

    public CartItems updateCartItem(Integer id, CartItems cartItemsDetails) {
        CartItems cartItems = getCartItemById(id);

        cartItems.setCart_id(cartItemsDetails.getCart_id());
        cartItems.setFood_id(cartItemsDetails.getFood_id());
        cartItems.setQuantity(cartItemsDetails.getQuantity());

        return cartItemsRepository.save(cartItems);
    }

    public void deleteCartItem(Integer id) {
        cartItemsRepository.deleteById(id);
    }
}
