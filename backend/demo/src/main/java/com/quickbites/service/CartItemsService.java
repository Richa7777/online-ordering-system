
package com.quickbites.service;

import com.quickbites.entity.CartItems;
import com.quickbites.repository.CartItemsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartItemsService {

    private final CartItemsRepository cartItemsRepository;

    public CartItemsService(
            CartItemsRepository cartItemsRepository) {

        this.cartItemsRepository =
                cartItemsRepository;
    }


    // ========================================
    // GET ALL CART ITEMS
    // ========================================

    public List<CartItems> getAllCartItems() {

        return cartItemsRepository.findAll();
    }


    // ========================================
    // GET CART ITEM BY ID
    // ========================================

    public CartItems getCartItemById(Integer id) {

        return cartItemsRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item not found"
                        ));
    }


    // ========================================
    // GET ITEMS BY CART ID
    // ========================================

    public List<CartItems> getItemsByCartId(
            Integer cartId) {

        return cartItemsRepository
                .findItemsByCartId(cartId);
    }


    // ========================================
    // ADD OR UPDATE CART ITEM
    // ========================================

    public CartItems addOrUpdateCartItem(
            Integer cartId,
            Integer foodId,
            Integer quantity) {

        if (quantity == null || quantity < 1) {

            throw new RuntimeException(
                    "Quantity must be at least 1"
            );
        }


        CartItems cartItem =
                cartItemsRepository
                        .findItemByCartIdAndFoodId(
                                cartId,
                                foodId
                        )
                        .orElse(null);


        if (cartItem == null) {

            cartItem = new CartItems();

            cartItem.setCart_id(cartId);

            cartItem.setFood_id(foodId);

            cartItem.setQuantity(quantity);

        } else {

            cartItem.setQuantity(
                    cartItem.getQuantity() + quantity
            );
        }


        return cartItemsRepository.save(
                cartItem
        );
    }


    // ========================================
    // CREATE CART ITEM
    // ========================================

    public CartItems createCartItem(
            CartItems cartItems) {

        return cartItemsRepository.save(
                cartItems
        );
    }


    // ========================================
    // UPDATE CART ITEM
    // ========================================

    public CartItems updateCartItem(
            Integer id,
            CartItems cartItemsDetails) {

        CartItems cartItems =
                getCartItemById(id);


        cartItems.setCart_id(
                cartItemsDetails.getCart_id()
        );

        cartItems.setFood_id(
                cartItemsDetails.getFood_id()
        );

        cartItems.setQuantity(
                cartItemsDetails.getQuantity()
        );


        return cartItemsRepository.save(
                cartItems
        );
    }


    // ========================================
    // DELETE CART ITEM
    // ========================================

    public void deleteCartItem(Integer id) {

        cartItemsRepository.deleteById(id);
    }


    // ========================================
    // CLEAR CART
    // ========================================

    @Transactional
    public void clearCart(Integer cartId) {

        cartItemsRepository.deleteItemsByCartId(
                cartId
        );
    }
}
