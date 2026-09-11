package com.tasktracker.api.service;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final String VALID_USERNAME = "tester";
    private static final String VALID_PASSWORD = "TestPass123";
    private static final String DEMO_TOKEN = "demo-token";

    public Optional<String> authenticate(String username, String password) {
        if (VALID_USERNAME.equals(username) && VALID_PASSWORD.equals(password)) {
            return Optional.of(DEMO_TOKEN);
        }
        return Optional.empty();
    }
}
