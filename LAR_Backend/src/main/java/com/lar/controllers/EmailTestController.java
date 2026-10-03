package com.lar.controllers;

import io.swagger.v3.oas.annotations.Hidden;

import com.lar.services.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Hidden
@RestController
@RequestMapping("/teste-email")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping
    public ResponseEntity<String> testar() {

        System.out.println(
                ">>> ENTROU NO EMAIL TEST CONTROLLER <<<"
        );

        emailService.enviar(
                "teste@lar.com",
                "Teste Mailtrap - L.A.R.",
                "Se você está lendo isso, o Mailtrap está funcionando!"
        );

        return ResponseEntity.ok("E-mail enviado.");
    }
}