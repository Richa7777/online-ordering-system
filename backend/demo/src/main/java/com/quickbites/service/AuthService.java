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
    public User register(User user) {

        // Check whether the email is already registered
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        /*
         * Public registration can ONLY create customers.
         *
         * We do not trust the role sent by the frontend.
         */
        user.setRole(User.Role.CUSTOMER);

        /*
         * Hash the password before saving it.
         *
         * Example:
         *
         * 123456
         *
         * becomes something like:
         *
         * $2a$10$....
         */
        user.setPasswordHash(
                passwordEncoder.encode(user.getPasswordHash())
        );

        return userRepository.save(user);
    }

    /*
     * Login an existing user.
     */
    public User login(String email, String password) {

        // Find the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        /*
         * Compare:
         *
         * password entered by user
         *
         * with
         *
         * BCrypt password stored in database
         */
        if (!passwordEncoder.matches(
                password,
                user.getPasswordHash())) {

            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}