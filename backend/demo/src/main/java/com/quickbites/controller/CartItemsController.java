package com.quickbites.controller;

import com.quickbites.entity.CartItems;
import com.quickbites.service.CartItemsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@CrossOrigin
public class CartItemsController {

    private final CartItemsService cartItemsService;

    public CartItemsController(CartItemsService cartItemsService) {
        this.cartItemsService = cartItemsService;
    }

    @GetMapping
    public List<CartItems> getAllCartItems() {
        return cartItemsService.getAllCartItems();
    }

    @GetMapping("/{id}")
    public CartItems getCartItemById(@PathVariable Integer id) {
        return cartItemsService.getCartItemById(id);
    }

    @PostMapping
    public CartItems createCartItem(@RequestBody CartItems cartItems) {
        return cartItemsService.createCartItem(cartItems);
    }

    @PutMapping("/{id}")
    public CartItems updateCartItem(
            @PathVariable Integer id,
            @RequestBody CartItems cartItems) {
        return cartItemsService.updateCartItem(id, cartItems);
    }

    @DeleteMapping("/{id}")
    public String deleteCartItem(@PathVariable Integer id) {
        cartItemsService.deleteCartItem(id);
        return "Cart item deleted successfully";
    }
}