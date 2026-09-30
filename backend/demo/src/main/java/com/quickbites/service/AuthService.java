package com.quickbites.service;

import com.quickbites.entity.User;
import com.quickbites.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /*
     * Register a new customer.
     */
    public User register(
        String name,
        String email,
        String password,
        String role) {

    if (userRepository.findByEmail(email).isPresent()) {
        throw new RuntimeException("Email already registered");
    }

    User user = new User();

    user.setName(name);
    user.setEmail(email);

    User.Role selectedRole;

    try {
        selectedRole = User.Role.valueOf(role.toUpperCase());
    } catch (Exception e) {
        throw new RuntimeException("Invalid role");
    }

    if (selectedRole == User.Role.ADMIN) {
        throw new RuntimeException(
                "Admin accounts cannot be created through public registration"
        );
    }

    user.setRole(selectedRole);

    user.setPasswordHash(
            passwordEncoder.encode(password)
    );

    return userRepository.save(user);
}
     

    /*
     * Login an existing user.
     */
    public User login(String email, String password, String role) {

        // Find the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                password,
                user.getPasswordHash())) {

            throw new RuntimeException("Invalid email or password");
        }

        if (role == null || !user.getRole().name().equalsIgnoreCase(role)) {
    throw new RuntimeException("Selected role does not match this account");
}

        return user;
        
    }

    public User getUserByEmail(String email) {

    return userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));
}

public User updateCurrentUser(
        String currentEmail,
        String name,
        String email) {

    User user = userRepository.findByEmail(currentEmail)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    // Check whether the new email belongs to another account
    if (!user.getEmail().equalsIgnoreCase(email)) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException(
                    "Email is already registered"
            );
        }
    }

    user.setName(name);
    user.setEmail(email);

    return userRepository.save(user);
}
}