package com.quickbites.controller;

import com.quickbites.entity.User;

public class AuthResponse {

    private Integer id;
    private String name;
    private String email;
    private String role;

    public AuthResponse(User user) {
        this.id = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
