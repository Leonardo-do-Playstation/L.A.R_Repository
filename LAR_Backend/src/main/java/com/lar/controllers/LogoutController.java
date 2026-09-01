package com.lar.controllers;

import com.lar.entities.TokenBlacklist;
import com.lar.repositories.TokenBlacklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class LogoutController {

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Token não informado."));
        }

        String token = authHeader.substring(7);

        if (!tokenBlacklistRepository.existsByToken(token)) {
            tokenBlacklistRepository.save(new TokenBlacklist(token));
        }

        return ResponseEntity.ok(Map.of("mensagem", "Logout realizado com sucesso."));
    }
}