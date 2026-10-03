package com.lar.controllers;

import io.swagger.v3.oas.annotations.Hidden;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
@RequestMapping("/admin")
public class AdminTestController {

    @GetMapping("/teste")
    public String testeAdmin(Authentication authentication) {
        return "Acesso de administrador confirmado para: "
                + authentication.getName();
    }
}