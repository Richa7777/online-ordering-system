package com.quickbites.controller;

import com.quickbites.entity.OrderItems;
import com.quickbites.service.OrderItemsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin
public class OrderItemsController {

    private final OrderItemsService orderItemsService;

    public OrderItemsController(OrderItemsService orderItemsService) {
        this.orderItemsService = orderItemsService;
    }

    @GetMapping
    public List<OrderItems> getAllOrderItems() {
        return orderItemsService.getAllOrderItems();
    }

    @GetMapping("/{id}")
    public OrderItems getOrderItemById(@PathVariable Integer id) {
        return orderItemsService.getOrderItemById(id);
    }

    @PostMapping
    public OrderItems createOrderItem(@RequestBody OrderItems orderItems) {
        return orderItemsService.createOrderItem(orderItems);
    }

    @PutMapping("/{id}")
    public OrderItems updateOrderItem(
            @PathVariable Integer id,
            @RequestBody OrderItems orderItems) {
        return orderItemsService.updateOrderItem(id, orderItems);
    }

    @DeleteMapping("/{id}")
    public String deleteOrderItem(@PathVariable Integer id) {
        orderItemsService.deleteOrderItem(id);
        return "Order item deleted successfully";
    }
}
