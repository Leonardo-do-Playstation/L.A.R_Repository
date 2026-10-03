package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.entities.TokenBlacklist;
import com.lar.repositories.TokenBlacklistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Autenticação", description = "Encerramento de acesso por blacklist do token JWT.")
@RestController
@RequestMapping("/auth")
public class LogoutController {

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    @Operation(summary = "Realiza logout", description = "Adiciona o token JWT atual à blacklist para impedir seu uso posterior.")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "erro",
                                    "Token não informado."));
        }

        String token = authHeader.substring(7);

        if (!tokenBlacklistRepository.existsByToken(token)) {

            tokenBlacklistRepository.save(
                    new TokenBlacklist(token));
        }

        return ResponseEntity.ok(
                Map.of(
                        "mensagem",
                        "Logout realizado com sucesso."));
    }
}