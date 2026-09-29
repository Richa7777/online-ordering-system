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
