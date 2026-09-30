
package com.quickbites.repository;

import com.quickbites.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemsRepository
        extends JpaRepository<CartItems, Integer> {

    @Query("""
            SELECT c
            FROM CartItems c
            WHERE c.cart_id = :cartId
            """)
    List<CartItems> findItemsByCartId(
            @Param("cartId") Integer cartId
    );


    @Query("""
            SELECT c
            FROM CartItems c
            WHERE c.cart_id = :cartId
            AND c.food_id = :foodId
            """)
    Optional<CartItems> findItemByCartIdAndFoodId(
            @Param("cartId") Integer cartId,
            @Param("foodId") Integer foodId
    );


    @Modifying
    @Query("""
            DELETE FROM CartItems c
            WHERE c.cart_id = :cartId
            """)
    void deleteItemsByCartId(
            @Param("cartId") Integer cartId
    );
}
