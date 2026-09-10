package com.lar.controllers;

import com.lar.dtos.ConfirmarExclusaoOngDTO;
import com.lar.dtos.SolicitarExclusaoDTO;
import com.lar.services.ContaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/conta")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @PostMapping("/excluir/solicitar")
    public ResponseEntity<?> solicitar(@Valid @RequestBody SolicitarExclusaoDTO dto,
                                        Authentication authentication) {
        String token = contaService.solicitarExclusao(authentication.getName(), dto);

        if (token != null) {
            // Caso ONG: exclusão pendente, aguardando confirmação por e-mail
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Um código de confirmação foi enviado ao seu e-mail para concluir a exclusão.",
                    "token_teste", token
            ));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/excluir/confirmar")
    public ResponseEntity<Void> confirmar(@Valid @RequestBody ConfirmarExclusaoOngDTO dto) {
        contaService.confirmarExclusaoOng(dto.token);
        return ResponseEntity.noContent().build();
    }
}