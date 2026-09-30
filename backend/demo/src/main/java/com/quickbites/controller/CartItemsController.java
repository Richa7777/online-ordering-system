
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

    public CartItemsController(
            CartItemsService cartItemsService) {

        this.cartItemsService =
                cartItemsService;
    }


    // ========================================
    // GET ALL CART ITEMS
    // ========================================

    @GetMapping
    public List<CartItems> getAllCartItems() {

        return cartItemsService.getAllCartItems();
    }


    // ========================================
    // GET CART ITEM BY ID
    // ========================================

    @GetMapping("/{id}")
    public CartItems getCartItemById(
            @PathVariable Integer id) {

        return cartItemsService.getCartItemById(
                id
        );
    }


    // ========================================
    // GET ITEMS BY CART ID
    // ========================================

    @GetMapping("/cart/{cartId}")
    public List<CartItems> getItemsByCartId(
            @PathVariable Integer cartId) {

        return cartItemsService.getItemsByCartId(
                cartId
        );
    }


    // ========================================
    // ADD OR UPDATE CART ITEM
    // ========================================

    @PostMapping("/cart/{cartId}")
    public CartItems addOrUpdateCartItem(
            @PathVariable Integer cartId,
            @RequestBody CartItemRequest request) {

        return cartItemsService.addOrUpdateCartItem(
                cartId,
                request.getFoodId(),
                request.getQuantity()
        );
    }


    // ========================================
    // CREATE CART ITEM
    // ========================================

    @PostMapping
    public CartItems createCartItem(
            @RequestBody CartItems cartItems) {

        return cartItemsService.createCartItem(
                cartItems
        );
    }


    // ========================================
    // UPDATE CART ITEM
    // ========================================

    @PutMapping("/{id}")
    public CartItems updateCartItem(
            @PathVariable Integer id,
            @RequestBody CartItems cartItems) {

        return cartItemsService.updateCartItem(
                id,
                cartItems
        );
    }


    // ========================================
    // DELETE CART ITEM
    // ========================================

    @DeleteMapping("/{id}")
    public String deleteCartItem(
            @PathVariable Integer id) {

        cartItemsService.deleteCartItem(id);

        return "Cart item deleted successfully";
    }


    // ========================================
    // CLEAR CART
    // ========================================

    @DeleteMapping("/cart/{cartId}")
    public String clearCart(
            @PathVariable Integer cartId) {

        cartItemsService.clearCart(cartId);

        return "Cart cleared successfully";
    }


    // ========================================
    // REQUEST BODY
    // ========================================

    public static class CartItemRequest {

        private Integer foodId;

        private Integer quantity;


        public CartItemRequest() {
        }


        public Integer getFoodId() {
            return foodId;
        }


        public void setFoodId(Integer foodId) {
            this.foodId = foodId;
        }


        public Integer getQuantity() {
            return quantity;
        }


        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
