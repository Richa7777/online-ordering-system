package com.quickbites.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Integer delivery_id;

    @Column(name = "order_id", nullable = false, unique = true)
    private Integer order_id;

    @Column(name = "rider_id", nullable = false)
    private Integer rider_id;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status")
    private DeliveryStatus delivery_status = DeliveryStatus.ASSIGNED;

    @Column(name = "assigned_at")
    private LocalDateTime assigned_at;

    @Column(name = "delivered_at")
    private LocalDateTime delivered_at;

    public enum DeliveryStatus {
        ASSIGNED,
        PICKED_UP,
        OUT_FOR_DELIVERY,
        DELIVERED
    }

    public Delivery() {
    }

    public Integer getDelivery_id() {
        return delivery_id;
    }

    public void setDelivery_id(Integer delivery_id) {
        this.delivery_id = delivery_id;
    }

    public Integer getOrder_id() {
        return order_id;
    }

    public void setOrder_id(Integer order_id) {
        this.order_id = order_id;
    }

    public Integer getRider_id() {
        return rider_id;
    }

    public void setRider_id(Integer rider_id) {
        this.rider_id = rider_id;
    }

    public DeliveryStatus getDelivery_status() {
        return delivery_status;
    }

    public void setDelivery_status(DeliveryStatus delivery_status) {
        this.delivery_status = delivery_status;
    }

    public LocalDateTime getAssigned_at() {
        return assigned_at;
    }

    public void setAssigned_at(LocalDateTime assigned_at) {
        this.assigned_at = assigned_at;
    }

    public LocalDateTime getDelivered_at() {
        return delivered_at;
    }

    public void setDelivered_at(LocalDateTime delivered_at) {
        this.delivered_at = delivered_at;
    }
}