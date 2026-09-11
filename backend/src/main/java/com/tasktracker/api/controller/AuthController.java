package com.tasktracker.api.controller;

import com.tasktracker.api.dto.ErrorResponse;
import com.tasktracker.api.dto.LoginRequest;
import com.tasktracker.api.dto.LoginResponse;
import com.tasktracker.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<String> token = authService.authenticate(request.getUsername(), request.getPassword());
        if (token.isPresent()) {
            return ResponseEntity.ok(new LoginResponse(token.get()));
        }
        return ResponseEntity.status(401).body(new ErrorResponse("Invalid username or password"));
    }
}