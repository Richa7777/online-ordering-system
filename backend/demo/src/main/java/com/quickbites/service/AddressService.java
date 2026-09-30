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

    // ========================================
    // GET ALL ADDRESSES
    // ========================================

    public List<Address> getAllAddresses() {

        return addressRepository.findAll();
    }


    // ========================================
    // GET ADDRESS BY ID
    // ========================================

    public Address getAddressById(Integer id) {

        return addressRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Address not found"));
    }


    // ========================================
    // GET ADDRESSES BY USER ID
    // ========================================

    public List<Address> getAddressesByUserId(Integer userId) {

        return addressRepository.findByUserId(userId);
    }


    // ========================================
    // CREATE ADDRESS
    // ========================================

    public Address createAddress(Address address) {

        return addressRepository.save(address);
    }


    // ========================================
    // UPDATE ADDRESS
    // ========================================

    public Address updateAddress(
            Integer id,
            Address addressDetails) {

        Address address =
                getAddressById(id);

        address.setUserId(
                addressDetails.getUserId()
        );

        address.setAddressLine(
                addressDetails.getAddressLine()
        );

        address.setCity(
                addressDetails.getCity()
        );

        address.setPhone(
                addressDetails.getPhone()
        );

        return addressRepository.save(address);
    }


    // ========================================
    // DELETE ADDRESS
    // ========================================

    public void deleteAddress(Integer id) {

        addressRepository.deleteById(id);
    }
}