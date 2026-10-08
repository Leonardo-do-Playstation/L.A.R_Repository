package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.RecuperarSenhaDTO;
import com.lar.dtos.RedefinirSenhaDTO;
import com.lar.services.PasswordResetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Recuperação de senha", description = "Solicitação e confirmação da redefinição de senha.")
@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @Operation(summary = "Solicita recuperação de senha", description = "Envia um link de recuperação caso o e-mail esteja cadastrado, sem revelar a existência da conta.")
    @SecurityRequirements
    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody RecuperarSenhaDTO dto) {
        String token = passwordResetService.solicitarRecuperacao(dto.email);
        return ResponseEntity.ok(Map.of(
                "mensagem", "Se este e-mail estiver cadastrado, um link de recuperação será enviado.",
                "token_teste", token
        ));
    }

    @Operation(summary = "Redefine a senha", description = "Altera a senha usando um token de recuperação válido.")
    @SecurityRequirements
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(
            @RequestBody RedefinirSenhaDTO dto) {

        passwordResetService.redefinirSenha(
                dto.token,
                dto.novaSenha);

        return ResponseEntity.ok(
                Map.of(
                        "mensagem",
                        "Senha redefinida com sucesso."));
    }
}