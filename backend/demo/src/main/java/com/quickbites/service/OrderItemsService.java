package com.quickbites.service;

import com.quickbites.entity.OrderItems;
import com.quickbites.repository.OrderItemsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemsService {

    private final OrderItemsRepository orderItemsRepository;

    public OrderItemsService(OrderItemsRepository orderItemsRepository) {
        this.orderItemsRepository = orderItemsRepository;
    }

    public List<OrderItems> getAllOrderItems() {
        return orderItemsRepository.findAll();
    }

    public OrderItems getOrderItemById(Integer id) {
        return orderItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found"));
    }

    public OrderItems createOrderItem(OrderItems orderItems) {
        return orderItemsRepository.save(orderItems);
    }

    public OrderItems updateOrderItem(Integer id, OrderItems orderItemsDetails) {
        OrderItems orderItems = getOrderItemById(id);

        orderItems.setOrder_id(orderItemsDetails.getOrder_id());
        orderItems.setFood_id(orderItemsDetails.getFood_id());
        orderItems.setFood_name(orderItemsDetails.getFood_name());
        orderItems.setPrice(orderItemsDetails.getPrice());
        orderItems.setQuantity(orderItemsDetails.getQuantity());
        orderItems.setSubtotal(orderItemsDetails.getSubtotal());

        return orderItemsRepository.save(orderItems);
    }

    public void deleteOrderItem(Integer id) {
        orderItemsRepository.deleteById(id);
    }
}

