package com.quickbites.controller;

import com.quickbites.entity.User;
import com.quickbites.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;


    public AuthController(
            AuthService authService,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository) {

        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository =
                securityContextRepository;
    }


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request) {

        System.out.println(
                "========== REGISTER ENDPOINT REACHED =========="
        );

        System.out.println(
                "Email: " + request.getEmail()
        );

        System.out.println(
                "Role: " + request.getRole()
        );

        User registeredUser = authService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return new AuthResponse(
                registeredUser
        );
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        // -------------------------
        // AUTHENTICATE USER
        // -------------------------

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );


        // -------------------------
        // CREATE SECURITY CONTEXT
        // -------------------------

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(
                authentication
        );

        SecurityContextHolder.setContext(
                context
        );


        // -------------------------
        // SAVE CONTEXT TO SESSION
        // -------------------------

        securityContextRepository.saveContext(
                context,
                httpRequest,
                httpResponse
        );


        // -------------------------
        // GET USER FROM DATABASE
        // -------------------------

        User user =
                authService.getUserByEmail(
                        request.getEmail()
                );

        // The role selected on the login form must match
        // the role stored for this account.
        if (request.getRole() == null ||
                !user.getRole().name().equalsIgnoreCase(
                        request.getRole())) {

            SecurityContextHolder.clearContext();

            throw new RuntimeException(
                    "Selected role does not match this account"
            );
        }


        return new AuthResponse(
                user
        );
    }


    // =========================
    // CURRENT USER
    // =========================

    @GetMapping("/me")
    public AuthResponse getCurrentUser(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Not authenticated"
            );
        }


        User user =
                authService.getUserByEmail(
                        authentication.getName()
                );


        return new AuthResponse(
                user
        );
    }

    @PutMapping("/me")
public AuthResponse updateCurrentUser(
        @RequestBody UpdateUserRequest request,
        Authentication authentication,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse) {

    if (authentication == null ||
            !authentication.isAuthenticated()) {

        throw new RuntimeException(
                "Not authenticated"
        );
    }

    // Remember the current email before updating
    String currentEmail = authentication.getName();

    // Update the user in the database
    User updatedUser =
            authService.updateCurrentUser(
                    currentEmail,
                    request.getName(),
                    request.getEmail()
            );

    // =========================================
    // UPDATE SPRING SECURITY SESSION
    // =========================================

    Authentication newAuthentication =
            new UsernamePasswordAuthenticationToken(
                    updatedUser.getEmail(),
                    null,
                    authentication.getAuthorities()
            );

    SecurityContext context =
            SecurityContextHolder.createEmptyContext();

    context.setAuthentication(newAuthentication);

    SecurityContextHolder.setContext(context);

    // Save the new authentication to the session
    securityContextRepository.saveContext(
            context,
            httpRequest,
            httpResponse
    );

    return new AuthResponse(updatedUser);
}

    // =========================
    // LOGOUT
    // =========================

    @PostMapping("/logout")
    public String logout(
            HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        return "Logged out successfully";
    }

}
