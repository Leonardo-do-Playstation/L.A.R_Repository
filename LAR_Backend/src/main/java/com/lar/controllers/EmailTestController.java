package com.lar.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lar.services.EmailService;

@RestController
@RequestMapping("/teste-email")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping
public ResponseEntity<String> testar() {

    System.out.println(">>> ENTROU NO EMAIL TEST CONTROLLER <<<");

    emailService.enviar(
        "teste@lar.com",
        "Teste Mailtrap - L.A.R.",
        "Se você está lendo isso, o Mailtrap está funcionando!"
    );

    return ResponseEntity.ok("E-mail enviado.");
}
}