package com.lar.controllers;

import com.lar.dtos.RecuperarSenhaDTO;
import com.lar.dtos.RedefinirSenhaDTO;
import com.lar.services.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody RecuperarSenhaDTO dto) {
        String token = passwordResetService.solicitarRecuperacao(dto.email);
        // Em produção, NÃO devolveríamos o token na resposta — ele iria só por e-mail.
        return ResponseEntity.ok(Map.of(
                "mensagem", "Se este e-mail estiver cadastrado, um link de recuperação será enviado.",
                "token_teste", token
        ));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinirSenhaDTO dto) {
        passwordResetService.redefinirSenha(dto.token, dto.novaSenha);
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso."));
    }
}