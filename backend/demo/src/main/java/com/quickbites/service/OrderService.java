package com.quickbites.service;

import com.quickbites.entity.Order;
import com.quickbites.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order createOrder(Order order) {

    if (order.getOrder_date() == null) {
        order.setOrder_date(java.time.LocalDateTime.now());
    }

    return orderRepository.save(order);
}

    public Order updateOrder(Integer id, Order orderDetails) {
        Order order = getOrderById(id);

        order.setUser_id(orderDetails.getUser_id());
        order.setAddress_id(orderDetails.getAddress_id());
        order.setOrder_status(orderDetails.getOrder_status());
        order.setSubtotal(orderDetails.getSubtotal());
        order.setDelivery_fee(orderDetails.getDelivery_fee());
        order.setTotal_amount(orderDetails.getTotal_amount());
        order.setOrder_date(orderDetails.getOrder_date());

        return orderRepository.save(order);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }
}
