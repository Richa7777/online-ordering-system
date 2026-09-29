package com.quickbites.controller;

import com.quickbites.entity.Delivery;
import com.quickbites.service.DeliveryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public Delivery getDeliveryById(@PathVariable Integer id) {
        return deliveryService.getDeliveryById(id);
    }

    @PostMapping
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryService.createDelivery(delivery);
    }

    @PutMapping("/{id}")
    public Delivery updateDelivery(
            @PathVariable Integer id,
            @RequestBody Delivery delivery) {
        return deliveryService.updateDelivery(id, delivery);
    }

    @DeleteMapping("/{id}")
    public String deleteDelivery(@PathVariable Integer id) {
        deliveryService.deleteDelivery(id);
        return "Delivery deleted successfully";
    }
}