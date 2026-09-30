package com.quickbites.repository;

import com.quickbites.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {

    @Query("SELECT d FROM Delivery d WHERE d.order_id = :orderId")
    Delivery findExistingDelivery(@Param("orderId") Integer orderId);

}