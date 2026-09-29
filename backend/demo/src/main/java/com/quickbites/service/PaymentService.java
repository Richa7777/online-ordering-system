package com.quickbites.service;

import com.quickbites.entity.Payment;
import com.quickbites.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Integer id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(Integer id, Payment paymentDetails) {
        Payment payment = getPaymentById(id);

        payment.setOrder_id(paymentDetails.getOrder_id());
        payment.setPayment_method(paymentDetails.getPayment_method());
        payment.setPayment_status(paymentDetails.getPayment_status());
        payment.setAmount(paymentDetails.getAmount());
        payment.setPayment_date(paymentDetails.getPayment_date());

        return paymentRepository.save(payment);
    }

    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }
}