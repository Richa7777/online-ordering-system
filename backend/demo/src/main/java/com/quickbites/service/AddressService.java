package com.quickbites.service;

import com.quickbites.entity.Address;
import com.quickbites.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    public Address getAddressById(Integer id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }

    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }

    public Address updateAddress(Integer id, Address addressDetails) {
        Address address = getAddressById(id);

        address.setUserId(addressDetails.getUserId());
        address.setAddressLine(addressDetails.getAddressLine());
        address.setCity(addressDetails.getCity());
        address.setPhone(addressDetails.getPhone());

        return addressRepository.save(address);
    }

    public void deleteAddress(Integer id) {
        addressRepository.deleteById(id);
    }
}
