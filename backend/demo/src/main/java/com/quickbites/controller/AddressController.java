package com.quickbites.controller;

import com.quickbites.entity.Address;
import com.quickbites.service.AddressService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
public class AddressController {

    private final AddressService addressService;


    public AddressController(
            AddressService addressService) {

        this.addressService = addressService;
    }


    // ========================================
    // GET ALL ADDRESSES
    // ========================================

    @GetMapping
    public List<Address> getAllAddresses() {

        return addressService.getAllAddresses();
    }


    // ========================================
    // GET ADDRESSES BY USER ID
    // ========================================

    @GetMapping("/user/{userId}")
    public List<Address> getAddressesByUserId(
            @PathVariable Integer userId) {

        return addressService.getAddressesByUserId(
                userId
        );
    }


    // ========================================
    // GET ADDRESS BY ID
    // ========================================

    @GetMapping("/{id}")
    public Address getAddressById(
            @PathVariable Integer id) {

        return addressService.getAddressById(id);
    }


    // ========================================
    // CREATE ADDRESS
    // ========================================

    @PostMapping
    public Address createAddress(
            @RequestBody Address address) {

        return addressService.createAddress(address);
    }


    // ========================================
    // UPDATE ADDRESS
    // ========================================

    @PutMapping("/{id}")
    public Address updateAddress(
            @PathVariable Integer id,
            @RequestBody Address address) {

        return addressService.updateAddress(
                id,
                address
        );
    }


    // ========================================
    // DELETE ADDRESS
    // ========================================

    @DeleteMapping("/{id}")
    public String deleteAddress(
            @PathVariable Integer id) {

        addressService.deleteAddress(id);

        return "Address deleted successfully";
    }
}