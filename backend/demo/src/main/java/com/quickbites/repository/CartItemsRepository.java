package com.quickbites.repository;

import com.quickbites.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
}
