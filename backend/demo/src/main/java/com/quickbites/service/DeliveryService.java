package com.quickbites.service;

import com.quickbites.entity.Delivery;
import com.quickbites.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Delivery getDeliveryById(Integer id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }

    public Delivery createDelivery(Delivery delivery) {

    Delivery existing =
            deliveryRepository.findExistingDelivery(
                    delivery.getOrder_id()
            );

    // If this order already has a delivery,
    // update the rider assignment
    if (existing != null) {

        existing.setRider_id(
                delivery.getRider_id()
        );

        existing.setDelivery_status(
                Delivery.DeliveryStatus.ASSIGNED
        );

        // Set assignment time
        existing.setAssigned_at(
                java.time.LocalDateTime.now()
        );

        return deliveryRepository.save(existing);
    }

    // New delivery
    delivery.setDelivery_status(
            Delivery.DeliveryStatus.ASSIGNED
    );

    // Set assignment time
    delivery.setAssigned_at(
            java.time.LocalDateTime.now()
    );

    return deliveryRepository.save(delivery);
}
    public Delivery updateDelivery(Integer id, Delivery deliveryDetails) {
        Delivery delivery = getDeliveryById(id);

        delivery.setOrder_id(deliveryDetails.getOrder_id());
        delivery.setRider_id(deliveryDetails.getRider_id());
        delivery.setDelivery_status(deliveryDetails.getDelivery_status());
        delivery.setAssigned_at(deliveryDetails.getAssigned_at());
        delivery.setDelivered_at(deliveryDetails.getDelivered_at());

        return deliveryRepository.save(delivery);
    }

    public void deleteDelivery(Integer id) {
        deliveryRepository.deleteById(id);
    }
}
