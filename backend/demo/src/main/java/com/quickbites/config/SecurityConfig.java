package com.quickbites.config;

import com.quickbites.service.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

        private final CustomUserDetailsService userDetailsService;

        public SecurityConfig(
                        CustomUserDetailsService userDetailsService) {

                this.userDetailsService = userDetailsService;
        }

        // =========================
        // PASSWORD ENCODER
        // =========================

        @Bean
        public PasswordEncoder passwordEncoder() {

                return new BCryptPasswordEncoder();
        }

        // =========================
        // AUTHENTICATION MANAGER
        // =========================

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration)
                        throws Exception {

                return configuration.getAuthenticationManager();
        }

        // =========================
        // SECURITY CONTEXT REPOSITORY
        // =========================

        @Bean
        public SecurityContextRepository securityContextRepository() {

                return new HttpSessionSecurityContextRepository();
        }

        // =========================
        // CORS CONFIGURATION
        // =========================

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOriginPatterns(
                                Arrays.asList("*"));

                configuration.setAllowedMethods(
                                Arrays.asList(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                Arrays.asList("*"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }

        // =========================
        // SECURITY FILTER CHAIN
        // =========================

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http

                                // -------------------------
                                // CORS
                                // -------------------------

                                .cors(cors -> cors
                                                .configurationSource(
                                                                corsConfigurationSource()))

                                // -------------------------
                                // CSRF
                                // -------------------------

                                .csrf(csrf -> csrf.disable())

                                // -------------------------
                                // USER DETAILS
                                // -------------------------

                                .userDetailsService(
                                                userDetailsService)

                                // -------------------------
                                // SECURITY CONTEXT
                                // -------------------------

                                .securityContext(securityContext -> securityContext

                                                .securityContextRepository(
                                                                securityContextRepository())

                                                .requireExplicitSave(false))

                                // -------------------------
                                // SESSION
                                // -------------------------

                                .sessionManagement(session -> session

                                                .sessionCreationPolicy(
                                                                SessionCreationPolicy.IF_REQUIRED))

                                // -------------------------
                                // AUTHORIZATION
                                // -------------------------

                                .authorizeHttpRequests(auth -> auth

                                                // CORS preflight
                                                .requestMatchers(
                                                                HttpMethod.OPTIONS,
                                                                "/**")
                                                .permitAll()

                                                // Public authentication
                                                .requestMatchers(
                                                                "/api/auth/register",
                                                                "/api/auth/login",
                                                                "/api/auth/logout")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/auth/me")
                                                .authenticated()

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/auth/me")
                                                .authenticated()

                                                // Public food
                                                .requestMatchers(
                                                                "/api/food-items",
                                                                "/api/food-items/**")
                                                .permitAll()

                                                // Public categories
                                                .requestMatchers(
                                                                "/api/categories",
                                                                "/api/categories/**")
                                                .permitAll()

                                                // Everything else
                                                .anyRequest().authenticated());

                return http.build();
        }
}
