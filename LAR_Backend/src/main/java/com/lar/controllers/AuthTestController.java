package com.lar.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthTestController {

    @GetMapping("/me")
    public String usuarioAutenticado(Authentication authentication) {
        return "Você está autenticado como: " + authentication.getName();
    }
}